function cambiarPantalla(pantalla) {
    document.querySelectorAll(".pantalla")
        .forEach(p => p.classList.remove("activa"));

    document.getElementById("pantalla-" + pantalla)
        .classList.add("activa");

    const titulos = {
        inicio: "Inicio",
        recoleccion: "Recolección mensual",
        estado: "Estado del sistema",
        uso: "Uso del agua"
    };

    document.getElementById("titulo-pantalla").textContent = titulos[pantalla];
}
