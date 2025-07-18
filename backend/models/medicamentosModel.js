const mysql = require('mysql');
require("dotenv").config({ path: "../.env" });

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const getListaMedicamentos = (callback) => {
  const sql = 'SELECT nombre FROM medicamento';
  db.query(sql, [], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result); 
    }
  });
}

// Función para crear un usuario en la base de datos
const setMedicamentoNuevo = (nombre, callback) => {

    const sql = "INSERT INTO medicamento (nombre) VALUES (?)";
    db.query(sql, [nombre], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      else{
        return callback(null, { nombre: nombre});
      }
    });

};

// Función para crear un usuario en la base de datos
const eliminarMedicamentoporNombre = (nombre, callback) => {

    const sql = "DELETE FROM medicamento WHERE nombre = ?";
    db.query(sql, [nombre], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        else{
            return callback(null, { nombre: nombre});
        }
    })

};

const setTomaMedicamento = (id_paciente, medicamento, numero_tomas, horas_tomas, callback) => {
  const sql = "SELECT id FROM medicamento WHERE nombre = ?";

  // Función para ejecutar query con promesa
  const queryAsync = (sql, params) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

  (async () => {
    try {
      const result = await queryAsync(sql, [medicamento]);
      const id_medicamento = result[0]?.id;
      if (!id_medicamento) throw new Error('Medicamento no encontrado');

      const sql2 = "INSERT INTO toma_medicamento (id_medicamento, id_paciente, numero_tomas) VALUES (?, ?, ?)";
      const result1 = await queryAsync(sql2, [id_medicamento, id_paciente, numero_tomas]);

      const sql3 = "SELECT id FROM toma_medicamento WHERE id_medicamento = ? AND id_paciente = ? AND numero_tomas = ?";
      const result2 = await queryAsync(sql3, [id_medicamento, id_paciente, numero_tomas]);

      const id_toma = result2[0]?.id;
      if (!id_toma) throw new Error('Toma no encontrada');

      const sql4 = "INSERT INTO toma_horas (id_toma, hora) VALUES (?, ?)";

      // Insertar todas las horas con promesas
      await Promise.all(
        horas_tomas.map((hora) => queryAsync(sql4, [id_toma, hora]))
      );

      callback(null, { result: result1 });
    } catch (error) {
      callback(error, null);
    }
  })();
};


const setTomaporDia = (id_toma, fecha,hora, callback) => {

  console.log ("asdf", id_toma, fecha, hora )

  const sql = "INSERT INTO historial_toma (id_toma, fecha, hora) VALUES (?, ?, ?)";
  db.query(sql, [id_toma, fecha, hora], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    else{
      console.log("dia" , id_toma)
      return callback(null, { id_toma: id_toma});
    }
  })
}

const getTomaporIdPaciente = (id_paciente, callback) => {
  const queryAsync = (sql, params) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

  (async () => {
    try {
      const sql1 = `
        SELECT 
            ht.id_toma,
            ht.fecha,
            ht.hora
        FROM 
            historial_toma ht
        JOIN 
            toma_medicamento tm ON ht.id_toma = tm.id
        WHERE 
            tm.id_paciente = ?
        ORDER BY 
            ht.id_toma,
            ht.fecha,
            ht.hora;
      `;
      const results1 = await queryAsync(sql1, [id_paciente]);

      const sql2 = `
        SELECT 
            m.nombre AS medicamento
        FROM 
            historial_toma ht
        JOIN 
            toma_medicamento tm ON ht.id_toma = tm.id
        JOIN 
            medicamento m ON tm.id_medicamento = m.id
        WHERE 
            tm.id = ? AND ht.fecha = ?
        LIMIT 1;
      `;

      const promises = results1.map(async (result1) => {
        const results2 = await queryAsync(sql2, [result1.id_toma, result1.fecha]);
        return {
          id_toma: result1.id_toma,
          medicamento: results2[0]?.medicamento || "Desconocido",
          fecha: result1.fecha,
          hora: result1.hora,
        };
      });

      const results = await Promise.all(promises);
      callback(null, results);
    } catch (err) {
      callback(err, null);
    }
  })();
};


const getIdToma = (id_paciente, medicamento, hora, callback) => {
  const sql1 = `
  SELECT 
      th.id_toma,
      th.hora
  FROM 
      toma_horas th
  JOIN 
      toma_medicamento tm ON th.id_toma = tm.id
  JOIN 
      medicamento m ON m.id = tm.id_medicamento
  WHERE 
      th.hora = ? AND m.nombre = ? AND tm.id_paciente = ?
  ORDER BY 
      th.id_toma, th.hora`;

      db.query(sql1, [hora, medicamento, id_paciente], (err, results1) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results1); 
        }
      });

}

const getListaTomaporIdPaciente = (id_paciente, callback) => {
  const sql1 = `
  SELECT 
      tm.id,
      m.nombre AS medicamento,
      th.hora
  FROM 
      toma_horas th
  JOIN 
      toma_medicamento tm ON th.id_toma = tm.id
  JOIN 
      medicamento m ON m.id = tm.id_medicamento
  WHERE 
      tm.id_paciente = ?
  ORDER BY 
      tm.id,
      m.nombre,
      th.hora;`;

  db.query(sql1, [id_paciente], (err, results1) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results1); 
    }
  });
};


const eliminarTomaporId = (id_paciente, medicamento, fecha, hora, callback) => {
  // Primero, buscamos el ID del medicamento dado su nombre
  const sqlBuscarMedicamento = `
    SELECT m.id 
    FROM medicamento m 
    WHERE m.nombre = ?;
  `;

  db.query(sqlBuscarMedicamento, [medicamento], (err, result) => {
    if (err) return callback(err, null);
    if (result.length === 0) return callback(new Error('Medicamento no encontrado'), null);

    const idMedicamento = result[0].id;

    // Aseguramos que la fecha esté en formato YYYY-MM-DD
    let formattedFecha = fecha;
    if (fecha.includes('/')) {
      const parts = fecha.split('/');
      if (parts.length !== 3) {
        return callback(new Error('Formato de fecha inválido'), null);
      }

      const [day, month, year] = parts;
      formattedFecha = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const sqlEliminar = `
      DELETE FROM historial_toma
      WHERE id_toma IN (
        SELECT tm.id
        FROM toma_medicamento tm
        JOIN toma_horas th ON tm.id = th.id_toma
        WHERE tm.id_paciente = ? AND tm.id_medicamento = ? AND th.hora = ? AND EXISTS (
          SELECT 1 FROM medicamento m WHERE m.id = tm.id_medicamento
        )
      ) AND fecha = ?;
    `;

    db.query(sqlEliminar, [id_paciente, idMedicamento, hora, formattedFecha], (err, result) => {
      if (err) return callback(err, null);
      if (result.affectedRows === 0) {
        return callback(new Error('No se encontró registro para eliminar'), null);
      }

      return callback(null, { success: true, message: 'Toma eliminada con éxito' });
    });
  });
};



const eliminarMedicamentoPorIdToma = (id_toma, callback) => {
  const sql = `
    DELETE FROM historial_toma WHERE id_toma = ?;
    DELETE FROM toma_horas WHERE id_toma = ?;
    DELETE FROM toma_medicamento WHERE id = ?;
  `;

  db.query(sql, [id_toma, id_toma, id_toma], (err, result) => {
      if (err) {
          return callback(err, null);
      } else {
          return callback(null, { success: true, message: 'Toma eliminada con éxito' });
      }
  });
};




module.exports = {getListaMedicamentos, setMedicamentoNuevo, eliminarMedicamentoporNombre, setTomaMedicamento, setTomaporDia, getTomaporIdPaciente, eliminarTomaporId, getListaTomaporIdPaciente, getIdToma, eliminarMedicamentoPorIdToma};