function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
    document.getElementById("pantalla-" + id).classList.add("activa");
}

// Menú lateral
function toggleMenu() {
    document.getElementById("menu-lateral").classList.toggle("abierto");
}

// Datos falsos
const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];
const litros = [820, 910, 880, 950, 1020, 980, 1000, 970, 930, 860, 890, 920];

// Tabla meses
const tabla = document.getElementById("tabla-meses");
meses.forEach((m, i) => {
    tabla.innerHTML += `<tr><td>${m}</td><td>${litros[i]} L</td></tr>`;
});

// Gráfica principal
new Chart(document.getElementById("graficoMes"), {
    type: "bar",
    data: {
        labels: meses.slice(0, 6),
        datasets: [{
            label: "Litros",
            data: litros.slice(0, 6)
        }]
    }
});

// Clima simulado
const climas = ["Soleado", "Nublado", "Lluvia ligera", "Tormenta"];
const clima = climas[Math.floor(Math.random() * climas.length)];

document.getElementById("texto-clima").innerText = clima;

// Recomendación
const r = document.getElementById("recomendacion-clima");

if (clima.includes("Lluvia") || clima.includes("Tormenta")) {
    r.innerText = "⚠ Revisar sistema: se aproxima lluvia.";
    r.style.color = "red";
} else {
    r.innerText = "✔ Todo en orden.";
    r.style.color = "green";
}
