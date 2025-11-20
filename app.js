/* app.js - navegación, datos, gráficos, consumo, clima, menú push */

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  const el = document.getElementById("pantalla-" + id);
  if (el) el.classList.add("activa");
}

function toggleMenu() {
  const menu = document.getElementById("menu-lateral");
  menu.classList.toggle("abierto");
  // agregar clase al body para desplazar contenido (evitar que tape)
  document.body.classList.toggle("menu-open");
}

/* Datos (12 meses) */
const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const litros = [820, 910, 880, 950, 1020, 980, 1000, 970, 930, 860, 890, 920];

/* ----- Tabla meses ----- */
function llenarTabla() {
  const tabla = document.getElementById("tabla-meses");
  tabla.innerHTML = "";
  meses.forEach((m, i) => {
    tabla.innerHTML += `<tr><td>${m}</td><td>${litros[i]} L</td></tr>`;
  });
}

/* ----- Gráfico 12 meses (barras más delgadas) ----- */
let chart;
function renderChart() {
  const ctx = document.getElementById("graficoMes").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: 'Litros recolectados',
        data: litros,
        backgroundColor: '#2e7d32'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        x: {
          ticks: { maxRotation: 0, autoSkip: false },
          grid: { display: false }
        },
        y: {
          beginAtZero: true
        }
      },
      // barras más delgadas
      datasets: {
        bar: {
          categoryPercentage: 0.6,
          barPercentage: 0.6,
          maxBarThickness: 36
        }
      }
    }
  });
}

/* ----- Consumo: generar tarjetas para 3 meses ejemplo ----- */
const consumoEjemplo = {
  Enero: { total: 950, usos: { Riego: 300, Limpieza: 200, Cocina: 150 } },
  Febrero: { total: 1000, usos: { Riego: 350, Limpieza: 250, Cocina: 200 } },
  Marzo: { total: 1100, usos: { Riego: 400, Limpieza: 300, Cocina: 250 } }
};

function renderConsumo() {
  const cont = document.getElementById("contenedor-consumo");
  cont.innerHTML = "";
  Object.keys(consumoEjemplo).forEach(mes => {
    const d = consumoEjemplo[mes];
    const usados = Object.values(d.usos).reduce((a,b)=>a+b,0);
    const restante = d.total - usados;
    const html = `
      <div class="card">
        <h3>${mes} — ${d.total} L</h3>
        <ul>
          <li>Riego: ${d.usos.Riego} L (${(d.usos.Riego/d.total*100).toFixed(1)}%)</li>
          <li>Limpieza: ${d.usos.Limpieza} L (${(d.usos.Limpieza/d.total*100).toFixed(1)}%)</li>
          <li>Cocina: ${d.usos.Cocina} L (${(d.usos.Cocina/d.total*100).toFixed(1)}%)</li>
        </ul>
        <p class="muted">Estimado restante en tanque: <b>${restante} L</b></p>
      </div>
    `;
    cont.insertAdjacentHTML('beforeend', html);
  });
}

/* ----- Clima simulado y recomendación ----- */
const estados = ["Soleado", "Nublado", "Lluvia ligera", "Tormenta"];
function simularClima() {
  const idx = Math.floor(Math.random() * estados.length);
  const estado = estados[idx];
  document.getElementById("texto-clima").innerText = estado;
  const rec = document.getElementById("recomendacion-clima");
  if (estado.includes("Lluvia") || estado.includes("Tormenta")) {
    rec.innerText = "⚠ Se aproxima lluvia: preparar sistema de recolección / revisar filtros.";
    rec.style.color = "red";
  } else {
    rec.innerText = "✔ Buen clima. No se requiere acción.";
    rec.style.color = "green";
  }
}

/* ----- Inicialización al cargar la página ----- */
document.addEventListener("DOMContentLoaded", () => {
  llenarTabla();
  renderChart();
  renderConsumo();
  simularClima();

  // botón simular clima
  const btn = document.getElementById("simularClimaBtn");
  if (btn) btn.addEventListener("click", simularClima);
});
