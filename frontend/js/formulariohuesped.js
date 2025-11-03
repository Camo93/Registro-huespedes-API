document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroForm');
  if (!form) return;

  // Lógica del acordeón
  const acc = document.getElementsByClassName("accordion");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }


  // Envío del formulario
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Validación del checkbox de aceptación
    const acepta = document.getElementById('acepta_politicas').checked;
    if (!acepta) {
      alert('Debes aceptar las políticas para enviar el formulario.');
      return;
    }

    // Captura los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Envía los datos al backend
      const response = await fetch('http://localhost:3000/huespedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const resultado = await response.json();
        console.log("Registro exitoso:", resultado);
        window.location.href = 'registroexitoso.html';
      } else {
        console.error("Error al registrar:", await response.text());
        alert("Hubo un error al registrar el huésped.");
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor:", error);
      alert("No se pudo conectar al servidor.");
    }
  });
});
