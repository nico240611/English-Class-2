/* =====================================================
   ESTADO DE SESIÓN
===================================================== */
let sesion = null; // { usuario, rol, nombre }

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =====================================================
   LOGIN
===================================================== */
const CLAVE_SESION = "englishClassroom.sesion";

$("#formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = $("#loginUsuario").value.trim().toLowerCase();
    const password = $("#loginPassword").value;
    const registro = USUARIOS[usuario];
    const errorBox = $("#loginError");
    const recordar = $("#loginRecordar").checked;

    if (registro && registro.password === password) {
        sesion = { usuario, rol: registro.rol, nombre: registro.nombre };
        errorBox.hidden = true;

        // Mantener sesión iniciada en este dispositivo (opcional)
        if (recordar) {
            localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
        } else {
            localStorage.removeItem(CLAVE_SESION);
        }

        iniciarApp();
    } else {
        errorBox.textContent = "Usuario o contraseña incorrectos.";
        errorBox.hidden = false;
    }
});

$("#btnLogout").addEventListener("click", () => {
    sesion = null;
    localStorage.removeItem(CLAVE_SESION);
    $("#appShell").hidden = true;
    $("#loginScreen").hidden = false;
    $("#formLogin").reset();
});

/* Al cargar la página: si ya había una sesión guardada, entra directo
   a la plataforma sin pedir usuario/contraseña de nuevo. */
(function recuperarSesion() {
    const guardada = localStorage.getItem(CLAVE_SESION);
    if (!guardada) return;
    try {
        const datos = JSON.parse(guardada);
        if (datos && USUARIOS[datos.usuario] && USUARIOS[datos.usuario].rol === datos.rol) {
            sesion = datos;
            iniciarApp();
        } else {
            localStorage.removeItem(CLAVE_SESION);
        }
    } catch {
        localStorage.removeItem(CLAVE_SESION);
    }
})();

function iniciarApp() {
    $("#loginScreen").hidden = true;
    $("#appShell").hidden = false;

    $("#userNombre").textContent = sesion.nombre;
    $("#userRol").textContent = sesion.rol === "profesor" ? "Profesor" : "Estudiante";
    $("#userRol").className = `role-badge role-${sesion.rol}`;

    // Mostrar/ocultar nav e items exclusivos de profesor
    $$(".solo-profesor").forEach(el => {
        el.hidden = sesion.rol !== "profesor";
    });

    renderDashboard();
    renderCronograma();
    renderEventos();
    renderNotas();
    if (sesion.rol === "profesor") renderPanelDocente();

    mostrarVista("dashboard");
}

/* =====================================================
   NAVEGACIÓN ENTRE VISTAS
===================================================== */
$$(".nav-link").forEach(link => {
    link.addEventListener("click", () => mostrarVista(link.dataset.vista));
});

function mostrarVista(vista) {
    $$(".vista").forEach(v => v.classList.toggle("activa", v.id === `vista-${vista}`));
    $$(".nav-link").forEach(l => l.classList.toggle("activo", l.dataset.vista === vista));
}

/* =====================================================
   DASHBOARD
===================================================== */
function renderDashboard() {
    const cont = $("#dashboardCards");
    cont.innerHTML = "";

    const { valor: general, unidades } = promedioGeneral();

    const proximaClase = todasLasClases()
        .filter(c => diasRestantes(c.fechaISO) >= 0)
        .sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO))[0];

    const proximoEvento = eventosImportantes.find(e => diasRestantes(e.fechaISO) >= 0);

    const aprobadas = unidades.filter(u => estado(promedioUnidad(u)) === "aprobado").length;

    cont.innerHTML = `
        <div class="dash-card dash-total">
            <h3>Promedio general</h3>
            <div class="valor">${formatoNota(general)}</div>
            <p class="dash-sub">Umbral de aprobación: ${UMBRAL_APROBACION.toFixed(1)}</p>
        </div>
        <div class="dash-card">
            <h3>Unidades aprobadas</h3>
            <div class="valor">${aprobadas}/${unidades.length}</div>
        </div>
        <div class="dash-card">
            <h3>Próxima clase</h3>
            <div class="valor-sm">${proximaClase ? proximaClase.nombre : "—"}</div>
            <p class="dash-sub">${proximaClase ? `${proximaClase.fecha} · ${proximaClase.hora}` : "No hay clases próximas"}</p>
        </div>
        <div class="dash-card">
            <h3>Próxima fecha límite</h3>
            <div class="valor-sm">${proximoEvento ? proximoEvento.descripcion : "—"}</div>
            <p class="dash-sub">${proximoEvento ? `en ${diasRestantes(proximoEvento.fechaISO)} día(s) · ${proximoEvento.unidad}` : "Sin eventos próximos"}</p>
        </div>
    `;
}

function todasLasClases() {
    return Object.values(cronograma).flatMap(mes => mes.unidades).flatMap(u => u.clases);
}

/* =====================================================
   CRONOGRAMA (pestañas por mes)
===================================================== */
function renderCronograma() {
    const tabs = $("#tabsMeses");
    const paneles = $("#panelesMeses");
    tabs.innerHTML = "";
    paneles.innerHTML = "";

    Object.entries(cronograma).forEach(([mes, data], i) => {
        const tab = document.createElement("button");
        tab.className = "tab-mes";
        tab.textContent = mes;
        tab.dataset.mes = mes;
        tab.addEventListener("click", () => abrirMes(mes));
        tabs.appendChild(tab);

        const panel = document.createElement("div");
        panel.className = "panel-mes";
        panel.id = `panel-${mes}`;

        const especiales = (data.eventosEspeciales || []).map(ev => `
            <div class="aviso-especial aviso-${ev.tipo}">
                <span class="aviso-icono">${ev.tipo === "receso" ? "🌴" : "✨"}</span>
                <div>
                    <strong>${ev.nombre}</strong>
                    <p>${ev.detalle}</p>
                </div>
            </div>
        `).join("");

        const filas = data.unidades.flatMap(u => u.clases.map(c => `
            <tr>
                <td>${c.fecha}</td>
                <td>${c.hora}</td>
                <td>${c.nombre}</td>
                <td><span class="badge-tipo">${c.tipo}</span></td>
                <td><span class="badge-unidad">${u.nombre}</span></td>
            </tr>
        `)).join("");

        panel.innerHTML = `
            ${especiales}
            <table class="tabla-cronograma">
                <thead>
                    <tr><th>Fecha</th><th>Hora</th><th>Sesión</th><th>Tipo</th><th>Unidad</th></tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
        paneles.appendChild(panel);

        if (i === 0) { tab.classList.add("activo"); panel.classList.add("abierto"); }
    });
}

function abrirMes(mes) {
    $$(".tab-mes").forEach(t => t.classList.toggle("activo", t.dataset.mes === mes));
    $$(".panel-mes").forEach(p => p.classList.toggle("abierto", p.id === `panel-${mes}`));
}

/* =====================================================
   FECHAS IMPORTANTES
===================================================== */
function renderEventos() {
    const cont = $("#listaEventos");
    cont.innerHTML = eventosImportantes.map(ev => {
        const dias = diasRestantes(ev.fechaISO);
        let estadoTexto, estadoClase;
        if (dias < 0) { estadoTexto = "Ya pasó"; estadoClase = "pasado"; }
        else if (dias === 0) { estadoTexto = "¡Es hoy!"; estadoClase = "hoy"; }
        else { estadoTexto = `En ${dias} día${dias === 1 ? "" : "s"}`; estadoClase = "futuro"; }

        return `
            <div class="evento-card evento-${estadoClase}">
                <div class="evento-fecha">
                    <span class="evento-dia">${ev.fecha.split(" de ")[0].split(" ").pop()}</span>
                    <span class="evento-mes">${ev.fecha.split(" de ")[1] || ""}</span>
                </div>
                <div class="evento-info">
                    <span class="badge-unidad">${ev.unidad}</span>
                    <h4>${ev.descripcion}</h4>
                    <p>Fecha límite: <strong>${ev.limite}</strong></p>
                </div>
                <div class="evento-estado">${estadoTexto}</div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   NOTAS POR TEMA (acordeón)
===================================================== */
function unidadesUnicas() {
    const vistos = new Set();
    const lista = [];
    Object.values(cronograma).flatMap(mes => mes.unidades).forEach(u => {
        if (!vistos.has(u.id)) { vistos.add(u.id); lista.push(u); }
        else {
            // fusionar clases de meses distintos con la misma unidad
            const existente = lista.find(x => x.id === u.id);
            u.clases.forEach(c => {
                if (!existente.clases.some(ec => ec.id === c.id)) existente.clases.push(c);
            });
        }
    });
    return lista;
}

function renderNotas() {
    const cont = $("#listaTemas");
    cont.innerHTML = unidadesUnicas().map(u => crearTemaHTML(u)).join("");
}

function crearTemaHTML(unidad) {
    const prom = promedioUnidad(unidad);
    const meta = prom !== null
        ? `${unidad.clases.length} clase${unidad.clases.length > 1 ? "s" : ""} · prom. ${formatoNota(prom)}`
        : `${unidad.clases.length} clase${unidad.clases.length > 1 ? "s" : ""} · sin notas registradas`;

    const clasesHTML = unidad.clases.map(clase => crearClaseHTML(clase)).join("");

    return `
        <div class="tema-card">
            <div class="tema-header">
                <span class="tema-nombre">${unidad.nombre}</span>
                <span class="tema-meta">${meta} <span class="tema-toggle-icon">▼</span></span>
            </div>
            <div class="clases-panel">
                <div class="clases-grid">${clasesHTML}</div>
                ${prom !== null ? selloHTML(prom) : '<div class="sello sello-pendiente">Sin notas aún</div>'}
            </div>
        </div>
    `;
}

function crearClaseHTML(clase) {
    const prom = promedioClase(clase);
    const filas = ACTIVIDADES_BASE.map(act => {
        const val = clase.actividades ? clase.actividades[act] : null;
        return `<div class="actividad-row"><span>${act}</span><span class="nota-valor">${formatoNota(val)}</span></div>`;
    }).join("");

    return `
        <div class="clase-mini">
            <h4>${clase.nombre}</h4>
            <p class="clase-fecha">${clase.fecha}</p>
            ${filas}
            ${prom !== null ? selloHTML(prom, true) : '<div class="sello sello-pendiente sello-mini">N.A.</div>'}
        </div>
    `;
}

function selloHTML(valor, mini = false) {
    const clase = estado(valor);
    const texto = clase === "aprobado" ? "Aprobado" : "Reprobado";
    return `<div class="sello sello-${clase} ${mini ? "sello-mini" : ""}">${texto} · ${formatoNota(valor)}</div>`;
}

$("#listaTemas").addEventListener("click", (e) => {
    const header = e.target.closest(".tema-header");
    if (header) header.closest(".tema-card").classList.toggle("abierto");
});

/* =====================================================
   PANEL DOCENTE (solo profesor)
===================================================== */
function renderPanelDocente() {
    const cont = $("#tablaDocente");
    const clases = todasLasClases();

    cont.innerHTML = clases.map(c => `
        <tr data-clase="${c.id}">
            <td>${c.nombre}<br><span class="fecha-mini">${c.fecha}</span></td>
            ${ACTIVIDADES_BASE.map(act => `
                <td>
                    <input type="number" min="0" max="5" step="0.1"
                        class="input-nota" data-clase="${c.id}" data-actividad="${act}"
                        value="${c.actividades && c.actividades[act] !== undefined ? c.actividades[act] : ""}"
                        placeholder="N.A.">
                </td>
            `).join("")}
        </tr>
    `).join("");
}

$("#btnGuardarNotas").addEventListener("click", () => {
    const clases = todasLasClases();
    $$(".input-nota").forEach(input => {
        const claseId = input.dataset.clase;
        const actividad = input.dataset.actividad;
        const clase = clases.find(c => c.id === claseId);
        const valor = input.value.trim();

        if (!clase) return;
        if (valor === "") {
            if (clase.actividades) delete clase.actividades[actividad];
            if (clase.actividades && Object.keys(clase.actividades).length === 0) clase.actividades = null;
        } else {
            if (!clase.actividades) clase.actividades = {};
            clase.actividades[actividad] = parseFloat(valor);
        }
    });

    renderDashboard();
    renderNotas();
    $("#guardadoMsg").hidden = false;
    setTimeout(() => { $("#guardadoMsg").hidden = true; }, 2500);
});

/* =====================================================
   EXPORTAR / IMPORTAR NOTAS (persistencia sin backend)
===================================================== */
$("#btnExportar").addEventListener("click", () => {
    const datos = {};
    todasLasClases().forEach(c => { datos[c.id] = c.actividades; });
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notas-english-classroom.json";
    a.click();
    URL.revokeObjectURL(url);
});

$("#inputImportar").addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
        try {
            const datos = JSON.parse(lector.result);
            const clases = todasLasClases();
            Object.entries(datos).forEach(([id, actividades]) => {
                const clase = clases.find(c => c.id === id);
                if (clase) clase.actividades = actividades;
            });
            renderDashboard();
            renderNotas();
            if (sesion.rol === "profesor") renderPanelDocente();
            $("#importadoMsg").hidden = false;
            setTimeout(() => { $("#importadoMsg").hidden = true; }, 2500);
        } catch {
            alert("El archivo no es un JSON de notas válido.");
        }
    };
    lector.readAsText(archivo);
    e.target.value = "";
});
