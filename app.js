/* ----- Cambiar pantallas ----- */
function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
    document.getElementById("pantalla-" + id).classList.add("activa");
}

/* ----- Menú lateral ----- */
function toggleMenu() {
    document.getElementById("menu-lateral").classList.toggle("abierto");
}

/* ----- Datos falsos ----- */
const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const litros = [820, 910, 880, 950, 1020, 980, 1000, 970, 930, 860, 890, 920];

/* ----- Tabla de meses ----- */
const tabla = document.getElementById("tabla-meses");

meses.forEach((m, i) => {
    tabla.innerHTML += `<tr><td>${m}</td><td>${litros[i]} L</td></tr>`;
});

/* ----- Gráfico compacto ----- */
new Chart(document.getElementById("graficoMes"), {
    type: "bar",
    data: {
        labels: meses.slice(0, 6),
        datasets: [{
            label: "Litros recolectados",
            data: litros.slice(0, 6),
            backgroundColor: "#0077cc"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

/* ----- Clima simulado ----- */
const estados = ["Soleado", "Nublado", "Lluvia ligera", "Tormenta"];
const clima = estados[Math.floor(Math.random() * estados.length)];

document.getElementById("texto-clima").innerText = clima;

const rec = document.getElementById("recomendacion-clima");

if (clima.includes("Lluvia") || clima.includes("Tormenta")) {
    rec.innerText = "⚠ Se recomienda revisar el sistema.";
    rec.style.color = "red";
} else {
    rec.innerText = "✔ No se requiere acción.";
    rec.style.color = "green";
}
