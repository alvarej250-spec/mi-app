/* app.js
   Lógica principal: navegación, datos, gráficos, clima simulado, tank indicator, ahorro.
   Asegúrate que este archivo se llame exactamente "app.js" en la raíz.
*/

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Datos de ejemplo (12 meses) ---------- */
  const litrosPorMes = {
    Enero: 950, Febrero: 1000, Marzo: 1100, Abril: 980,
    Mayo: 1200, Junio: 1150, Julio: 1300, Agosto: 1250,
    Septiembre: 1180, Octubre: 1230, Noviembre: 1100, Diciembre: 1050
  };

  // Config inicial (puede guardarse en localStorage)
  const config = {
    siteName: localStorage.getItem("siteName") || "Sistema de Agua #27",
    tankCapacity: Number(localStorage.getItem("tankCapacity")) || 2000,
    darkMode: (localStorage.getItem("darkMode") === "true")
  };

  // ELEMENTOS
  const tabla = document.getElementById("tabla-meses");
  const contenedorConsumo = document.getElementById("contenedor-consumo");
  const grafCtx = document.getElementById("graficoMes").getContext("2d");
  const tankIndicator = document.getElementById("tankIndicator");
  const tankPercent = document.getElementById("tankPercent");
  const quickToday = document.getElementById("quick-today");
  const quickAvg = document.getElementById("quick-avg");
  const quickState = document.getElementById("quick-state");
  const siteTitle = document.getElementById("siteTitle");
  const siteNameInput = document.getElementById("siteName");
  const tankCapInput = document.getElementById("tankCapacity");
  const saveConfigBtn = document.getElementById("saveConfig");
  const simulateWeatherBtn = document.getElementById("simulateWeather");
  const weatherText = document.getElementById("weatherText");
  const weatherAdvice = document.getElementById("weatherAdvice");

  // Sidebar controls
  const sidebar = document.getElementById("sidebar");
  document.getElementById("openSidebar").addEventListener("click", ()=> sidebar.classList.add("show"));
  document.getElementById("closeSidebar").addEventListener("click", ()=> sidebar.classList.remove("show"));

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  function applyTheme(dark){
    if(dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", dark);
    themeIcon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  themeToggle.addEventListener("click", ()=>{
    config.darkMode = !config.darkMode;
    applyTheme(config.darkMode);
  });
  applyTheme(config.darkMode);

  // Inicializar campos de configuración
  siteTitle.textContent = config.siteName ? `${config.siteName}` : "Sistema de Agua";
  siteNameInput.value = config.siteName;
  tankCapInput.value = config.tankCapacity;

  saveConfigBtn.addEventListener("click", ()=>{
    config.siteName = siteNameInput.value || config.siteName;
    config.tankCapacity = Number(tankCapInput.value) || config.tankCapacity;
    localStorage.setItem("siteName", config.siteName);
    localStorage.setItem("tankCapacity", String(config.tankCapacity));
    siteTitle.textContent = config.siteName;
    alert("Configuración guardada.");
    actualizarIndicadores();
  });

  // Mostrar tabla de meses + cálculo de ahorro
  function llenarTablaYCalculos(){
    const meses = Object.keys(litrosPorMes);
    tabla.innerHTML = "";
    for(let i=0;i<meses.length;i++){
      const mes = meses[i];
      const litros = litrosPorMes[mes];
      // ahorro vs mes anterior
      let ahorroText = "-";
      if(i>0){
        const prev = litrosPorMes[meses[i-1]];
        const diff = litros - prev;
        const pct = (diff / prev * 100).toFixed(1);
        ahorroText = (diff>=0? `+${pct}%` : `${pct}%`);
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${mes}</td><td>${litros} L</td><td>${ahorroText}</td>`;
      tabla.appendChild(tr);
    }
  }

  // Grafico de barras (Chart.js)
  let chartInstance = null;
  function renderChart(){
    const labels = Object.keys(litrosPorMes);
    const data = Object.values(litrosPorMes);
    if(chartInstance) chartInstance.destroy();
    chartInstance = new Chart(grafCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Litros recolectados',
          data,
          backgroundColor: data.map(v => v >= 1200 ? '#2e7d32' : '#66bb6a')
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio:false,
        plugins: { legend: { display:false } }
      }
    });
  }

  // Consumo ejemplo (3 meses)
  const consumoEjemplo = {
    Enero: { total: 950, usos: { Riego: 300, Limpieza: 200, Cocina: 150 }},
    Febrero: { total: 1000, usos: { Riego: 350, Limpieza: 250, Cocina: 200 }},
    Marzo: { total: 1100, usos: { Riego: 400, Limpieza: 300, Cocina: 250 }}
  };

  function renderConsumo(){
    contenedorConsumo.innerHTML = "";
    Object.keys(consumoEjemplo).forEach(mes=>{
      const d = consumoEjemplo[mes];
      const restante = d.total - (d.usos.Riego + d.usos.Limpieza + d.usos.Cocina);
      const ul = `
        <div class="card">
          <h3>${mes} — Total: ${d.total} L</h3>
          <ul>
            <li>Riego: ${d.usos.Riego} L (${(d.usos.Riego/d.total*100 || (d.usos.Riego/d.total*100)).toFixed(1)}%)</li>
            <li>Limpieza: ${d.usos.Limpieza} L (${(d.usos.Limpieza/d.total*100).toFixed(1)}%)</li>
            <li>Cocina: ${d.usos.Cocina} L (${(d.usos.Cocina/d.total*100).toFixed(1)}%)</li>
          </ul>
          <p class="muted">Litros restantes estimados en tanque: <b>${restante} L</b></p>
        </div>
      `;
      contenedorConsumo.insertAdjacentHTML("beforeend", ul);
    });
  }

  // Indicador del tanque con conic-gradient
  function actualizarIndicadores(){
    // Simular cantidad actual en tanque como porcentaje del mes más reciente
    const meses = Object.keys(litrosPorMes);
    const ultimoMes = meses[meses.length-1];
    const ultimoLitros = litrosPorMes[ultimoMes];
    const percent = Math.min(100, Math.round((ultimoLitros / config.tankCapacity) * 100));
    tankIndicator.style.background = `conic-gradient(var(--accent-2) 0deg, var(--accent-2) ${percent*3.6}deg, rgba(230,245,230,0.9) ${percent*3.6}deg)`;
    tankPercent.textContent = `${percent}%`;

    // quick cards
    quickToday.textContent = `${Math.round(ultimoLitros/30)} L`;
    const avg = Math.round(Object.values(litrosPorMes).reduce((a,b)=>a+b,0)/12/1);
    quickAvg.textContent = `${avg} L`;

    // Estado quick
    quickState.textContent = percent >= 50 ? "✔ Todo en orden" : (percent >= 25 ? "⚠ Atención" : "❗ Revisión requerida");
  }

  // Navegación (mostrar/ocultar secciones)
  function mostrarPantalla(name){
    document.querySelectorAll(".pantalla").forEach(s=>s.classList.remove("activa"));
    const id = `pantalla-${name}`;
    const el = document.getElementById(id);
    if(el) el.classList.add("activa");
    // hide sidebar on small screens
    if(window.innerWidth < 900) sidebar.classList.remove("show");
  }
  // Exponer globalmente para onclick inline
  window.mostrarPantalla = mostrarPantalla;

  // Weather simulator
  const weatherStates = [
    { text: "Despejado", advice: "Buen día — no es necesario ajustar el sistema." },
    { text: "Nublado", advice: "Atención: revisar tanque en caso de lluvia ligera." },
    { text: "Lluvias cercanas", advice: "Recomendado: Preparar sistema para recolección. Verificar filtros." },
    { text: "Tormenta próxima", advice: "¡Revisión urgente! Asegurar válvulas y revisiones." }
  ];

  function simulateWeather(){
    // aleatorio simple
    const idx = Math.floor(Math.random()*weatherStates.length);
    const state = weatherStates[idx];
    weatherText.textContent = state.text;
    weatherAdvice.textContent = state.advice;
    // adicional: marcar una alerta en quickState si lluvia fuerte
    if(state.text.includes("Lluvia") || state.text.includes("Tormenta")){
      quickState.textContent = "⚠ Prepararse para lluvia";
    }
  }

  // Botones
  simulateWeatherBtn.addEventListener("click", simulateWeather);

  // Inicialización
  function init(){
    llenarTablaYCalculos();
    renderChart();
    renderConsumo();
    actualizarIndicadores();
    simulateWeather(); // al cargar muestra un clima simulado
    // fill site name from config
    siteNameInput.value = config.siteName;
  }
  init();

  // Exponer alguna utilidad (para test)
  window._APP = { litrosPorMes, config, renderChart, actualizarIndicadores };

});
