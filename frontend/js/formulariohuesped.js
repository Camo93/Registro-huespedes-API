const form = document.getElementById('registroForm');
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

  // Campos obligatorios (excepto pasaporte, contacto de emergencia y observaciones)
  const camposObligatorios = [
    'correo', 'nombre_completo', 'cedula', 'lugar_expedicion_id',
    'direccion_residencia', 'telefono', 'numero_habitacion',
    'fecha_ingreso', 'hora_llegada', 'fecha_salida', 'nacionalidad',
    'estado_civil', 'profesion', 'lugar_origen', 'destino',
    'dias_hospedados', 'cantidad_personas'
  ];

  for (let campo of camposObligatorios) {
    if (!data[campo] || data[campo].trim() === '') {
      alert(`El campo "${campo}" es obligatorio.`);
      return;
    }
  }

  // Validar cédula solo números
if (!/^\d+$/.test(data.cedula)) {
  alert('La cédula solo puede contener números.');
  return;
}

// Validar teléfono solo números
if (!/^\d+$/.test(data.telefono)) {
  alert('El teléfono solo puede contener números.');
  return;
}

  // Validación de correo
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(data.correo)) {
    alert('Por favor, ingresa un correo válido.');
    return;
  }

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
