document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            window.location.href = 'registroexitoso.html';
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroForm');
  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Captura los datos del formulario
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // Envía los datos al backend (asegúrate que el server está en localhost:3000)
        const response = await fetch('http://localhost:3000/huespedes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log("Registro exitoso:", resultado);
          // Redirige después de guardar correctamente
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
  }
});
