const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Configura tu conexión a PostgreSQL
const pool = new Pool({
  user: "postgres", // tu usuario de PostgreSQL
  host: "localhost",
  database: "registro_huespedes", // el nombre de tu BD
  password: "Aa123456", // cámbiala según tu caso
  port: 5432,
});

// ✅ Ruta para insertar un nuevo huésped
// Esta ruta activa el TRIGGER 'trg_gestionar_reservas' en la base de datos,
// que se encarga de calcular 'numero_total_reservas' (contador por cédula).
app.post("/huespedes", async (req, res) => {
  try {
    const {
      correo,
      nombre_completo,
      cedula,
      lugar_expedicion_id,
      pasaporte,
      direccion_residencia,
      telefono,
      numero_habitacion,
      fecha_ingreso,
      hora_llegada,
      fecha_salida,
      nacionalidad,
      estado_civil,
      profesion,
      lugar_origen,
      destino,
      dias_hospedados,
      cantidad_personas,
      contacto_emergencia,
      observaciones,
    } = req.body;

    // Log para depuración
    console.log("Datos de huésped recibidos:", req.body);

    // Ejecuta la consulta SQL
    const result = await pool.query(
      `INSERT INTO huespedes (
        correo, nombre_completo, cedula, lugar_expedicion_id, pasaporte,
        direccion_residencia, telefono, numero_habitacion, fecha_ingreso,
        hora_llegada, fecha_salida, nacionalidad, estado_civil, profesion,
        lugar_origen, destino, dias_hospedados, cantidad_personas, contacto_emergencia,
        observaciones
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
      RETURNING *`,
      [
        correo,
        nombre_completo,
        cedula,
        lugar_expedicion_id,
        pasaporte,
        direccion_residencia,
        telefono,
        numero_habitacion,
        fecha_ingreso,
        hora_llegada,
        fecha_salida,
        nacionalidad,
        estado_civil,
        profesion,
        lugar_origen,
        destino,
        dias_hospedados,
        cantidad_personas,
        contacto_emergencia,
        observaciones,
      ]
    );

    console.log(`✅ Huésped insertado correctamente: ${result.rows[0].nombre_completo}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error insertando huésped:", error);
    res.status(500).json({ error: "Error interno al insertar huésped" });
  }
});

// ✅ Ruta para ver todos los huéspedes, incluyendo el contador sin saltos (1, 2, 3...)
app.get("/huespedes", async (req, res) => {
  try {
    // Usamos ROW_NUMBER() para generar una columna 'registro_consecutivo'
    // que cuenta las filas de 1 a N sin importar los saltos en 'id' (el número de orden que solicitaste).
    const result = await pool.query(
      `SELECT
        ROW_NUMBER() OVER (ORDER BY id) as registro_consecutivo,
        id,
        nombre_completo,
        cedula,
        numero_total_reservas, -- Contador de reservas por cédula (1, 2, 3...)
        numero_habitacion,
        fecha_ingreso,
        fecha_salida
       FROM huespedes
       ORDER BY id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error consultando huéspedes:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
