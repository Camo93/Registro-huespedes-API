const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


// 🧠 Configura tu conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",          // tu usuario de PostgreSQL
  host: "localhost",
  database: "registro_huespedes", // el nombre de tu BD
  password: "Aa123456",     // cámbiala según tu caso
  port: 5432,
});

// ✅ Ruta para insertar un nuevo huésped
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
    } = req.body;

    // No incluimos "numero_total_reservas", el trigger lo hace solo 👇
    const result = await pool.query(
      `INSERT INTO huespedes (
        correo, nombre_completo, cedula, lugar_expedicion_id, pasaporte,
        direccion_residencia, telefono, numero_habitacion, fecha_ingreso,
        hora_llegada, fecha_salida, nacionalidad, estado_civil, profesion,
        lugar_origen, destino, dias_hospedados, cantidad_personas
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
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
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error insertando huésped:", error);
    res.status(500).json({ error: "Error al insertar huésped" });
  }
});

// ✅ Ruta para ver todos los huéspedes
app.get("/huespedes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre_completo, numero_total_reservas FROM huespedes ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error consultando huéspedes:", error); // 👈 muestra el error real en consola
    res.status(500).json({ error: error.message }); // 👈 ahora el navegador mostrará el mensaje real
  }
});


// 🚀 Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
