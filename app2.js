// DATOS DE PRUEBA
const litrosPorMes = {
    Enero: 950,
    Febrero: 1000,
    Marzo: 1100,
    Abril: 980,
    Mayo: 1200,
    Junio: 1150,
    Julio: 1300,
    Agosto: 1250,
    Septiembre: 1180,
    Octubre: 1230,
    Noviembre: 1100,
    Diciembre: 1050
};

// -------- TABLA DE MESES ----------
const tabla = document.getElementById("tabla-meses");
Object.keys(litrosPorMes).forEach(mes => {
    tabla.innerHTML += `
        <tr>
            <td>${mes}</td>
            <td>${litrosPorMes[mes]} L</td>
        </tr>
    `;
});

// -------- GRAFICO PRINCIPAL ----------
const ctx = document.getElementById("graficoMes");
new Chart(ctx, {
    type: "bar",
    data: {
        labels: Object.keys(litrosPorMes),
        datasets: [{
            label: "Litros recolectados",
            data: Object.values(litrosPorMes),
            backgroundColor: "#43a047"
        }]
    }
});

// -------- CONSUMO DE AGUA (3 MESES) ----------
const contenedorConsumo = document.getElementById("contenedor-consumo");

const consumoEjemplo = {
    Enero: { total: 950, usos: { Riego: 300, Limpieza: 200, Cocina: 150 }},
    Febrero: { total: 1000, usos: { Riego: 350, Limpieza: 250, Cocina: 200 }},
    Marzo: { total: 1100, usos: { Riego: 400, Limpieza: 300, Cocina: 250 }}
};

Object.keys(consumoEjemplo).forEach(mes => {
    const datos = consumoEjemplo[mes];

    contenedorConsumo.innerHTML += `
        <div class="card">
            <h3>${mes}</h3>
            <p>Total recolectado: <b>${datos.total} L</b></p>
            <ul>
                <li>Riego: ${datos.usos.Riego} L (${(datos.usos.Riego / datos.total * 100).toFixed(1)}%)</li>
                <li>Limpieza: ${datos.usos.Limpieza} L (${(datos.usos.Limpieza / datos.total * 100).toFixed(1)}%)</li>
                <li>Cocina: ${datos.usos.Cocina} L (${(datos.usos.Cocina / datos.total * 100).toFixed(1)}%)</li>
            </ul>
        </div>
    `;
});

// -------- NAVEGACIÓN ENTRE PANTALLAS ----------
function mostrarPantalla(p) {
    document.querySelectorAll(".pantalla").forEach(sec => sec.classList.remove("activa"));

    document.getElementById(`pantalla-${p}`).classList.add("activa");
}
