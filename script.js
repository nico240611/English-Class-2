// =====================================================
// DATOS: Mes -> Tema -> Clases
// =====================================================

const cronograma = {

    Enero: {
        temas: [
            { nombre: "Greetings" },
            { nombre: "Alphabet" }
        ]
    },

    Febrero: {
        temas: [
            { nombre: "Numbers" },
            { nombre: "Colors" }
        ]
    },

    Marzo: {
        temas: [
            { nombre: "Family" }
        ]
    },

    Junio: {
        temas: [
            {
                nombre: "🍎 Apple",
                clases: [
                    { nombre: "Clase 1", actividades: { Vocabulary: 4.5, Speaking: 4.8, Listening: 5.0, Writing: 4.2 } },
                    { nombre: "Clase 2", actividades: { Vocabulary: 4.0, Speaking: 3.5, Listening: 4.7, Writing: 4.9 } }
                ]
            }
        ]
    },

    Julio: {
        temas: [
            {
                nombre: "🏠 House",
                clases: [
                    { nombre: "Clase 1", actividades: { Vocabulary: 4.2, Speaking: 4.0, Listening: 3.8, Writing: 4.5 } }
                ]
            }
        ]
    }

};

const UMBRAL_APROBACION = 3;

// =====================================================
// UTILIDADES DE PROMEDIO
// =====================================================

function promedio(valores) {
    const suma = valores.reduce((total, n) => total + n, 0);
    return suma / valores.length;
}

function promedioClase(clase) {
    return promedio(Object.values(clase.actividades));
}

function promedioTema(tema) {
    if (!tema.clases || tema.clases.length === 0) return null;
    return promedio(tema.clases.map(promedioClase));
}

function promedioMes(mesData) {
    const promediosTemas = mesData.temas
        .map(promedioTema)
        .filter(p => p !== null);
    if (promediosTemas.length === 0) return null;
    return promedio(promediosTemas);
}

function estado(valor) {
    return valor >= UMBRAL_APROBACION ? "aprobado" : "reprobado";
}

function selloHTML(valor) {
    const clase = estado(valor);
    const texto = clase === "aprobado" ? "¡Aprobado!" : "Reprobado";
    return `<div class="sello ${clase}">${texto} · ${valor.toFixed(2)}</div>`;
}

// =====================================================
// RENDER: TABS DE MESES + PANELES
// =====================================================

const tabsMeses = document.getElementById("tabsMeses");
const panelesMeses = document.getElementById("panelesMeses");

function crearTabsYPaneles() {

    Object.entries(cronograma).forEach(([mes, mesData], index) => {

        const tieneClases = mesData.temas.some(t => t.clases && t.clases.length > 0);

        // --- Tab ---
        const tab = document.createElement("button");
        tab.className = "tab-mes" + (tieneClases ? "" : " vacio");
        tab.textContent = mes;
        tab.dataset.mes = mes;

        tab.addEventListener("click", () => abrirMes(mes));
        tabsMeses.appendChild(tab);

        // --- Panel ---
        const panel = document.createElement("div");
        panel.className = "panel-mes";
        panel.id = `panel-${mes}`;

        const temasHTML = mesData.temas.map(tema => crearTemaHTML(tema)).join("");

        panel.innerHTML = `<div class="temas-lista">${temasHTML}</div>`;
        panelesMeses.appendChild(panel);

        // Abrir el primer mes con clases por defecto
        if (tieneClases && !panelesMeses.dataset.abierto) {
            panelesMeses.dataset.abierto = mes;
        }
    });

    // Activar el mes por defecto (o el primero) al cargar
    const mesInicial = panelesMeses.dataset.abierto || Object.keys(cronograma)[0];
    abrirMes(mesInicial);

    // Delegar clicks de temas (se crean dinámicamente)
    panelesMeses.addEventListener("click", (e) => {
        const header = e.target.closest(".tema-header");
        if (header) {
            header.closest(".tema-card").classList.toggle("abierto");
        }
    });
}

function crearTemaHTML(tema) {

    const prom = promedioTema(tema);
    const meta = prom !== null
        ? `${tema.clases.length} clase${tema.clases.length > 1 ? "s" : ""} · prom. ${prom.toFixed(2)}`
        : "Próximamente";

    const clasesHTML = (tema.clases && tema.clases.length > 0)
        ? `<div class="clases-grid">
            ${tema.clases.map(clase => crearClaseHTML(clase)).join("")}
           </div>`
        : `<p class="sin-clases">Aún no hay clases registradas para este tema.</p>`;

    return `
        <div class="tema-card">
            <div class="tema-header">
                <span class="tema-nombre">${tema.nombre}</span>
                <span class="tema-meta">${meta} <span class="tema-toggle-icon">▼</span></span>
            </div>
            <div class="clases-panel">
                ${clasesHTML}
            </div>
        </div>
    `;
}

function crearClaseHTML(clase) {

    const prom = promedioClase(clase);

    const actividadesHTML = Object.entries(clase.actividades)
        .map(([actividad, valor]) => `
            <div class="actividad-row">
                <span>${actividad}</span>
                <span>${valor}</span>
            </div>
        `).join("");

    return `
        <div class="clase-mini">
            <h4>${clase.nombre}</h4>
            ${actividadesHTML}
            ${selloHTML(prom)}
        </div>
    `;
}

function abrirMes(mes) {
    document.querySelectorAll(".tab-mes").forEach(tab => {
        tab.classList.toggle("activo", tab.dataset.mes === mes);
    });
    document.querySelectorAll(".panel-mes").forEach(panel => {
        panel.classList.toggle("abierto", panel.id === `panel-${mes}`);
    });
}

// =====================================================
// RENDER: RESUMEN GENERAL
// =====================================================

function crearResumenGeneral() {

    const contenedor = document.getElementById("resumenGeneral");
    const promediosConDatos = [];

    Object.entries(cronograma).forEach(([mes, mesData]) => {

        const prom = promedioMes(mesData);
        if (prom === null) return; // meses sin notas aún no cuentan

        promediosConDatos.push(prom);

        const card = document.createElement("div");
        card.className = `resumen-card ${estado(prom)}`;
        card.innerHTML = `
            <h3>${mes}</h3>
            <div class="valor">${prom.toFixed(2)}</div>
        `;
        contenedor.appendChild(card);
    });

    if (promediosConDatos.length > 0) {
        const total = promedio(promediosConDatos);
        const totalCard = document.createElement("div");
        totalCard.className = "resumen-card total";
        totalCard.innerHTML = `
            <h3>Promedio general</h3>
            <div class="valor">${total.toFixed(2)}</div>
        `;
        contenedor.appendChild(totalCard);
    }
}

// =====================================================
// INIT
// =====================================================

crearTabsYPaneles();
crearResumenGeneral();