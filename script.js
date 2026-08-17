/* =====================================================
   USUARIOS (login simulado en el navegador)
   — Sitio estático: esto NO es seguridad real, es una
     demostración de control de acceso por rol. Para
     producción real se necesita un backend con
     autenticación de verdad.
===================================================== */
const USUARIOS = {
    estudiante: { password: "Ingles2026", rol: "estudiante", nombre: "Estudiante" },
    profesor:   { password: "Docente2026*", rol: "profesor",   nombre: "Profesor" }
};

const UMBRAL_APROBACION = 3;
const ACTIVIDADES_BASE = ["Vocabulary", "Speaking", "Listening", "Writing"];

/* =====================================================
   CRONOGRAMA — English Classroom, semestre 2026-2
   (tomado de "Programación_Primos_2026-2.xlsb")
===================================================== */
const cronograma = {
    Agosto: {
        eventosEspeciales: [],
        unidades: [
            {
                id: "bienvenida",
                nombre: "👋 Bienvenida",
                clases: [
                    { id: "c1", nombre: "Welcome Back!", tipo: "Primera Sesión", fecha: "Viernes 7 de Agosto", fechaISO: "2026-08-07", hora: "12:00 p.m.", actividades: null },
                    { id: "c2", nombre: "Last Details", tipo: "Reposición 10 de Junio", fecha: "Martes 18 de Agosto", fechaISO: "2026-08-18", hora: "7:30 p.m.", actividades: null }
                ]
            },
            {
                id: "python",
                nombre: "🐍 Python",
                clases: [
                    { id: "c3", nombre: "Python #1", tipo: "Normal", fecha: "Miércoles 19 de Agosto", fechaISO: "2026-08-19", hora: "6:30 p.m.", actividades: null },
                    { id: "c4", nombre: "Python #2", tipo: "Reposición 17 de Junio", fecha: "Jueves 20 de Agosto", fechaISO: "2026-08-20", hora: "7:30 p.m.", actividades: null },
                    { id: "c5", nombre: "Python #3", tipo: "Reposición 24 de Junio", fecha: "Martes 25 de Agosto", fechaISO: "2026-08-25", hora: "7:30 p.m.", actividades: null },
                    { id: "c6", nombre: "Exam Python", tipo: "Normal", fecha: "Miércoles 26 de Agosto", fechaISO: "2026-08-26", hora: "6:30 p.m.", actividades: null }
                ]
            },
            {
                id: "letter",
                nombre: "✉️ Letter",
                clases: [
                    { id: "c7", nombre: "Letter #1", tipo: "Clase Adicional", fecha: "Viernes 28 de Agosto", fechaISO: "2026-08-28", hora: "7:05 p.m.", actividades: null },
                    { id: "c8", nombre: "Letter #2", tipo: "Reposición 2 de Septiembre", fecha: "Lunes 7 de Septiembre", fechaISO: "2026-09-07", hora: "7:30 p.m.", actividades: null },
                    { id: "c9", nombre: "Exam Letter", tipo: "Normal", fecha: "Miércoles 9 de Septiembre", fechaISO: "2026-09-09", hora: "6:30 p.m.", actividades: null }
                ]
            }
        ]
    },

    Septiembre: {
        eventosEspeciales: [
            { nombre: "Curso Gratuito Excel Daxus", detalle: "31 de Agosto al 3 de Septiembre · 7:00 p.m.", tipo: "evento" }
        ],
        unidades: [
            {
                id: "diagnostic",
                nombre: "🧪 Diagnostic Test",
                clases: [
                    { id: "c10", nombre: "Diagnostic Test", tipo: "Normal", fecha: "Miércoles 16 de Septiembre", fechaISO: "2026-09-16", hora: "6:30 p.m.", actividades: null }
                ]
            },
            {
                id: "webpages",
                nombre: "🌐 Web Pages & AI",
                clases: [
                    { id: "c11", nombre: "Web Pages & AI #1", tipo: "Normal", fecha: "Miércoles 23 de Septiembre", fechaISO: "2026-09-23", hora: "6:30 p.m.", actividades: null },
                    { id: "c12", nombre: "Web Pages & AI #2", tipo: "Clase Adicional", fecha: "Lunes 28 de Septiembre", fechaISO: "2026-09-28", hora: "7:30 p.m.", actividades: null },
                    { id: "c13", nombre: "Web Pages & AI #3", tipo: "Normal", fecha: "Miércoles 30 de Septiembre", fechaISO: "2026-09-30", hora: "6:30 p.m.", actividades: null }
                ]
            }
        ]
    },

    Octubre: {
        eventosEspeciales: [
            { nombre: "Semana de Receso", detalle: "Del 1 al 13 de Octubre · Retoma: 14 de Octubre", tipo: "receso" }
        ],
        unidades: [
            {
                id: "webpages",
                nombre: "🌐 Web Pages & AI",
                clases: [
                    { id: "c14", nombre: "Web Pages & AI #4", tipo: "Normal", fecha: "Miércoles 14 de Octubre", fechaISO: "2026-10-14", hora: "6:30 p.m.", actividades: null },
                    { id: "c15", nombre: "Web Pages & AI #5", tipo: "Clase Adicional", fecha: "Lunes 19 de Octubre", fechaISO: "2026-10-19", hora: "7:30 p.m.", actividades: null },
                    { id: "c16", nombre: "Exam Pages & AI", tipo: "Normal", fecha: "Miércoles 21 de Octubre", fechaISO: "2026-10-21", hora: "6:30 p.m.", actividades: null }
                ]
            },
            {
                id: "minecraft",
                nombre: "⛏️ Minecraft",
                clases: [
                    { id: "c17", nombre: "Minecraft #1", tipo: "Normal", fecha: "Miércoles 28 de Octubre", fechaISO: "2026-10-28", hora: "6:30 p.m.", actividades: null }
                ]
            }
        ]
    },

    Noviembre: {
        eventosEspeciales: [],
        unidades: [
            {
                id: "minecraft",
                nombre: "⛏️ Minecraft",
                clases: [
                    { id: "c18", nombre: "Minecraft #2", tipo: "Normal", fecha: "Miércoles 4 de Noviembre", fechaISO: "2026-11-04", hora: "6:30 p.m.", actividades: null },
                    { id: "c19", nombre: "Minecraft #3", tipo: "Normal", fecha: "Miércoles 11 de Noviembre", fechaISO: "2026-11-11", hora: "6:30 p.m.", actividades: null },
                    { id: "c20", nombre: "Minecraft #4", tipo: "Normal", fecha: "Miércoles 18 de Noviembre", fechaISO: "2026-11-18", hora: "6:30 p.m.", actividades: null },
                    { id: "c21", nombre: "Exam Minecraft", tipo: "Clase Adicional", fecha: "Lunes 23 de Noviembre", fechaISO: "2026-11-23", hora: "7:30 p.m.", actividades: null }
                ]
            },
            {
                id: "proyecto",
                nombre: "🎓 Proyecto Final",
                clases: [
                    { id: "c22", nombre: "Proyect", tipo: "Normal", fecha: "Miércoles 25 de Noviembre", fechaISO: "2026-11-25", hora: "6:30 p.m.", actividades: null }
                ]
            }
        ]
    },

    Diciembre: {
        eventosEspeciales: [],
        unidades: [
            {
                id: "proyecto",
                nombre: "🎓 Proyecto Final",
                clases: [
                    { id: "c23", nombre: "Proyect", tipo: "Normal", fecha: "Miércoles 2 de Diciembre", fechaISO: "2026-12-02", hora: "6:30 p.m.", actividades: null },
                    { id: "c24", nombre: "Proyect", tipo: "Clase Adicional (Festivo)", fecha: "Martes 8 de Diciembre", fechaISO: "2026-12-08", hora: "11:00 a.m.", actividades: null },
                    { id: "c25", nombre: "Presentation Proyect", tipo: "Normal", fecha: "Miércoles 9 de Diciembre", fechaISO: "2026-12-09", hora: "6:30 p.m.", actividades: null },
                    { id: "c26", nombre: "Final Review Session", tipo: "Cambio de Día", fecha: "Jueves 17 de Diciembre", fechaISO: "2026-12-17", hora: "11:00 a.m.", actividades: null }
                ]
            }
        ]
    }
};

/* =====================================================
   FECHAS IMPORTANTES / EVENTOS (deadlines por unidad)
===================================================== */
const eventosImportantes = [
    { unidad: "Python", descripcion: "Control de Lectura Python", fecha: "Martes 25 de Agosto", fechaISO: "2026-08-25", limite: "En Clase" },
    { unidad: "Python", descripcion: "Exámen Python", fecha: "Miércoles 26 de Agosto", fechaISO: "2026-08-26", limite: "En Clase" },
    { unidad: "Python", descripcion: "Recomendaciones de Notas Python", fecha: "Domingo 30 de Agosto", fechaISO: "2026-08-30", limite: "11 de Septiembre" },
    { unidad: "Letter", descripcion: "Control de Lectura Letter", fecha: "Lunes 7 de Septiembre", fechaISO: "2026-09-07", limite: "En Clase" },
    { unidad: "Letter", descripcion: "Exámen Letter", fecha: "Miércoles 9 de Septiembre", fechaISO: "2026-09-09", limite: "En Clase" },
    { unidad: "Python", descripcion: "Último Día Mejorar Notas Python", fecha: "Viernes 11 de Septiembre", fechaISO: "2026-09-11", limite: "Último Día" },
    { unidad: "Letter", descripcion: "Recomendaciones de Notas Letter", fecha: "Domingo 13 de Septiembre", fechaISO: "2026-09-13", limite: "19 de Septiembre" },
    { unidad: "Diagnostic Test", descripcion: "Diagnostic Test", fecha: "Miércoles 16 de Septiembre", fechaISO: "2026-09-16", limite: "En Clase" },
    { unidad: "Letter", descripcion: "Último Día Mejorar Notas Letter", fecha: "Sábado 19 de Septiembre", fechaISO: "2026-09-19", limite: "Último Día" },
    { unidad: "Web Pages & AI", descripcion: "Control de Lectura Web Pages", fecha: "Lunes 19 de Octubre", fechaISO: "2026-10-19", limite: "En Clase" },
    { unidad: "Web Pages & AI", descripcion: "Exámen Web Pages", fecha: "Miércoles 21 de Octubre", fechaISO: "2026-10-21", limite: "En Clase" },
    { unidad: "Web Pages & AI", descripcion: "Recomendaciones de Notas Pages", fecha: "Domingo 25 de Octubre", fechaISO: "2026-10-25", limite: "6 de Noviembre" },
    { unidad: "Web Pages & AI", descripcion: "Último Día Mejorar Notas Pages", fecha: "Viernes 6 de Noviembre", fechaISO: "2026-11-06", limite: "Último Día" },
    { unidad: "Minecraft", descripcion: "Control de Lectura Minecraft", fecha: "Miércoles 18 de Noviembre", fechaISO: "2026-11-18", limite: "En Clase" },
    { unidad: "Minecraft", descripcion: "Exámen Minecraft", fecha: "Lunes 23 de Noviembre", fechaISO: "2026-11-23", limite: "En Clase" },
    { unidad: "Minecraft", descripcion: "Recomendaciones de Notas Minecraft", fecha: "Domingo 29 de Noviembre", fechaISO: "2026-11-29", limite: "17 de Diciembre" },
    { unidad: "Proyecto Final", descripcion: "Presentation Proyect", fecha: "Miércoles 9 de Diciembre", fechaISO: "2026-12-09", limite: "En Clase" },
    { unidad: "Minecraft", descripcion: "Último Día Mejorar Notas Minecraft", fecha: "Jueves 17 de Diciembre", fechaISO: "2026-12-17", limite: "Último Día - En Clase" }
].sort((a, b) => new Date(a.fechaISO) - new Date(b.fechaISO));

/* =====================================================
   UTILIDADES DE PROMEDIO (ignoran clases sin notas)
===================================================== */
function promedio(valores) {
    if (valores.length === 0) return null;
    const suma = valores.reduce((total, n) => total + n, 0);
    return suma / valores.length;
}

function promedioClase(clase) {
    if (!clase.actividades) return null;
    return promedio(Object.values(clase.actividades));
}

function promedioUnidad(unidad) {
    const proms = unidad.clases.map(promedioClase).filter(p => p !== null);
    return promedio(proms);
}

function promedioGeneral() {
    const todasUnidades = Object.values(cronograma).flatMap(mes => mes.unidades);
    // deduplicar unidades repetidas entre meses (mismo id)
    const vistos = new Set();
    const unidadesUnicas = [];
    todasUnidades.forEach(u => {
        if (!vistos.has(u.id)) { vistos.add(u.id); unidadesUnicas.push(u); }
    });
    const proms = unidadesUnicas.map(promedioUnidad).filter(p => p !== null);
    return { valor: promedio(proms), unidades: unidadesUnicas };
}

function estado(valor) {
    if (valor === null || valor === undefined) return "pendiente";
    return valor >= UMBRAL_APROBACION ? "aprobado" : "reprobado";
}

function formatoNota(valor) {
    return (valor === null || valor === undefined) ? "N.A." : valor.toFixed(2);
}

function diasRestantes(fechaISO) {
    const hoy = new Date("2026-08-17T00:00:00");
    const objetivo = new Date(fechaISO + "T00:00:00");
    const diff = Math.round((objetivo - hoy) / 86400000);
    return diff;
}
