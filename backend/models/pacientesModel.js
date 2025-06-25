const mysql = require('mysql');

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '24022003Ja.',
  database: 'nurseinthepocket',
});


/**
 * Obtiene los registros de peso de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe ser un número válido que pertenezca a un paciente existente.
 * @postcondicion Devuelve una lista de registros de peso con fechas formateadas, o un error si la consulta falla.
 */
const getPeso = (id, callback) => {
  const sql = 'SELECT peso, fecha_registro FROM paciente_peso WHERE id_paciente = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          callback(err, null);
      } else {
          const formattedData = result.map(record => ({
              peso: record.peso,  
              fecha: new Date(record.fecha_registro).toLocaleDateString("fr-CA")
          }));
          callback(null, formattedData);
      }
  });
};

/**
 * Registra un nuevo peso para un paciente y mantiene solo los últimos 10 registros.
 * 
 * @param {number} id - El ID del paciente.
 * @param {number} weight - El peso del paciente.
 * @param {function} callback - Función que maneja el error o la confirmación de inserción.
 * @returns {void}
 * 
 * @precondicion El ID debe ser válido y el peso debe ser un número positivo.
 * @postcondicion Se registra el peso y se eliminan los registros más antiguos, manteniendo un máximo de 10.
 */
const setPeso = (id, weight, callback) => {
  const today = new Date().toISOString().split("T")[0];
  const insertSql = `INSERT INTO paciente_peso (id_paciente, peso, fecha_registro) VALUES (?, ?, ?)`;
  db.query(insertSql, [id, weight, today], (err, result) => {
    if (err) return callback(err, null);
    const deleteSql = `
      DELETE FROM paciente_peso 
      WHERE id_paciente = ? 
      AND id NOT IN (
        SELECT id FROM (
          SELECT id FROM paciente_peso 
          WHERE id_paciente = ? 
          ORDER BY fecha_registro DESC 
          LIMIT 10
        ) AS subquery
      )`;
    db.query(deleteSql, [id, id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  });
};

/**
 * Obtiene los registros de frecuencia cardíaca de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe ser válido y corresponder a un paciente registrado.
 * @postcondicion Devuelve una lista de frecuencias cardíacas con fechas formateadas o un error si la consulta falla.
 */
const getFrecuencia = (id, callback) => {
  const sql = 'SELECT frecuencia_cardiaca, fecha_registro FROM paciente_frecuenciacardiaca WHERE id_paciente = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          callback(err, null);
      } else {
          const formattedData = result.map(record => ({  
              frecuencia: record.frecuencia_cardiaca,  
              fecha: new Date(record.fecha_registro).toLocaleDateString("fr-CA")
          }));
          callback(null, formattedData);
      }
  });
};

/**
 * Registra una nueva frecuencia cardíaca para un paciente y mantiene solo los últimos 10 registros.
 * 
 * @param {number} id - El ID del paciente.
 * @param {number} frecuencia - La frecuencia cardíaca.
 * @param {function} callback - Función que maneja el error o la confirmación de inserción.
 * @returns {void}
 * 
 * @precondicion El ID debe ser válido y la frecuencia debe ser un número entero positivo.
 * @postcondicion Se registra la nueva frecuencia y se eliminan los registros más antiguos, dejando un máximo de 10.
 */
const setFrecuencia = (id, frecuencia, callback) => {
  const today = new Date().toISOString().split("T")[0];
  const insertSql = `INSERT INTO paciente_frecuenciacardiaca (id_paciente, frecuencia_cardiaca, fecha_registro) VALUES (?, ?, ?)`;
  db.query(insertSql, [id, frecuencia, today], (err, result) => {
    if (err) return callback(err, null);
    const deleteSql = `
      DELETE FROM paciente_frecuenciacardiaca 
      WHERE id_paciente = ? 
      AND id NOT IN (
        SELECT id FROM (
          SELECT id FROM paciente_frecuenciacardiaca
          WHERE id_paciente = ? 
          ORDER BY fecha_registro DESC 
          LIMIT 10
        ) AS subquery
      )`;
    db.query(deleteSql, [id, id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  });
};

/**
 * Obtiene los registros de tensión arterial de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe existir en la base de datos.
 * @postcondicion Se devuelven registros de tensión mínima y máxima con sus respectivas fechas.
 */
const getTension = (id, callback) => {
  const sql = 'SELECT tension_minima, tension_maxima, fecha_registro FROM paciente_tension WHERE id_paciente = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          callback(err, null);
      } else {
          const formattedData = result.map(record => ({
              tension_max: record.tension_maxima,  
              tension_min: record.tension_minima,
              fecha: new Date(record.fecha_registro).toLocaleDateString("fr-CA")
          }));
          callback(null, formattedData);
      }
  });
};

/**
 * Registra una nueva medición de tensión arterial para un paciente y mantiene solo las últimas 10 mediciones.
 * 
 * @param {number} id - El ID del paciente.
 * @param {number} tension_max - La tensión máxima.
 * @param {number} tension_min - La tensión mínima.
 * @param {function} callback - Función que maneja el error o la confirmación de inserción.
 * @returns {void}
 * 
 * @precondicion El ID debe ser válido y las tensiones deben ser números mayores a cero.
 * @postcondicion Se guarda el nuevo registro y se mantiene un histórico de máximo 10 entradas.
 */
const setTension = (id, tension_max, tension_min, callback) => {
  const today = new Date().toLocaleDateString("fr-CA");
  const insertSql = `INSERT INTO paciente_tension (id_paciente, tension_maxima, tension_minima, fecha_registro) VALUES (?, ?, ?, ?)`;
  db.query(insertSql, [id, tension_max, tension_min, today], (err, result) => {
    if (err) return callback(err, null);
    const deleteSql = `
      DELETE FROM paciente_tension 
      WHERE id_paciente = ? 
      AND id NOT IN (
        SELECT id FROM (
          SELECT id FROM paciente_tension
          WHERE id_paciente = ? 
          ORDER BY fecha_registro DESC 
          LIMIT 10
        ) AS subquery
      )`;
    db.query(deleteSql, [id, id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  });
};

/**
 * Obtiene los registros de arritmia de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe existir en la base de datos.
 * @postcondicion Devuelve una lista de fechas con eventos de arritmia.
 */
const getArritmia = (id, callback) => {
  const sql = 'SELECT arritmia, fecha_registro FROM paciente_arritmia WHERE id_paciente = ?';
  db.query(sql, [id], (err, result) => {
      if (err) {
          callback(err, null);
      } else {
          const formattedData = result.map(record => ({
              arritmia: record.arritmia,  
              fecha: new Date(record.fecha_registro).toLocaleDateString("fr-CA")
          }));
          callback(null, formattedData);
      }
  });
};

/**
 * Registra una nueva arritmia para un paciente, evitando duplicados por fecha.
 * 
 * @param {number} id - El ID del paciente.
 * @param {string} fecha - La fecha del evento (formato "YYYY-MM-DD").
 * @param {function} callback - Función que maneja el error o la confirmación de inserción.
 * @returns {void}
 * 
 * @precondicion La combinación de ID y fecha no debe repetirse previamente.
 * @postcondicion Se registra una nueva arritmia o se ignora si ya existe para esa fecha.
 */
const setArritmia = (id, fecha, callback) => {
  const insertSql = `INSERT IGNORE INTO paciente_arritmia (id_paciente, fecha_registro) VALUES (?, ?)`;
  db.query(insertSql, [id, fecha], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

/**
 * Obtiene los datos básicos del paciente (altura, hábitos, fecha de nacimiento).
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe existir en la tabla de pacientes.
 * @postcondicion Se devuelven los datos básicos del paciente.
 */
const getDatosPacienteporId = (id, callback) => {
  const sql = 'SELECT altura, habitos_toxicos, fecha_nacimiento FROM paciente WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result[0]); 
  });
};

/**
 * Actualiza los datos del paciente, como la altura y los hábitos tóxicos.
 * 
 * @param {number} id - El ID del paciente.
 * @param {number} altura - La nueva altura en cm.
 * @param {string} habitos_toxicos - Descripción de hábitos tóxicos.
 * @param {function} callback - Función que maneja el error o la confirmación.
 * @returns {void}
 * 
 * @precondicion El ID debe ser válido y los datos deben tener el formato correcto.
 * @postcondicion Se actualizan los campos especificados en la base de datos.
 */
const setPacienteporId = (id, altura, habitos_toxicos, callback) => {
  const sql = `UPDATE paciente SET altura = ?, habitos_toxicos = ? WHERE id = ?`;
  db.query(sql, [altura, habitos_toxicos, id], (err, result) => {
    if (err) return callback(err, null); 
    return callback(null, result);
  });
};

/**
 * Obtiene todos los datos médicos y personales relevantes de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El paciente debe existir y tener datos registrados en todas las tablas asociadas.
 * @postcondicion Devuelve un objeto combinado con todos los datos de salud relevantes.
 */
const getPacienteporId = (id, callback) => {
  const queries = [
    {
      sql: 'SELECT nombre, apellido1, apellido2, correo, centro, cuerpo_medico FROM usuario WHERE id = ?',
      key: 'usuario',
    },
    {
      sql: 'SELECT altura, genero, habitos_toxicos, fecha_nacimiento, exploraciones FROM paciente WHERE id = ?',
      key: 'paciente',
    },
    {
      sql: 'SELECT tension_maxima, tension_minima FROM paciente_tension WHERE id_paciente = ?',
      key: 'tension',
    },
    {
      sql: 'SELECT frecuencia_cardiaca FROM paciente_frecuenciacardiaca WHERE id_paciente = ?',
      key: 'frecuencia',
    },
    {
      sql: 'SELECT peso FROM paciente_peso WHERE id_paciente = ?',
      key: 'peso',
    },
    {
      sql: 'SELECT fecha_registro FROM paciente_arritmia WHERE id_paciente = ?',
      key: 'arritmia',
    },
  ];

  Promise.all(
    queries.map((query) =>
      new Promise((resolve, reject) => {
        db.query(query.sql, [id], (err, result) => {
          if (err) return reject(err);
          resolve({ [query.key]: result });
        });
      })
    )
  )
    .then((results) => {
      const combinedResult = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      callback(null, combinedResult);
    })
    .catch((err) => {
      callback(err, null);
    });
};

/**
 * Actualiza los datos médicos y personales de un paciente.
 * 
 * @param {number} id - El ID del paciente.
 * @param {object} updatedData - Objeto con los datos a actualizar (nombre, apellidos, fecha de nacimiento, etc).
 * @param {function} callback - Función que maneja el error o el resultado de la actualización.
 * @returns {void}
 * 
 * @precondicion El paciente debe existir y los datos a actualizar deben ser válidos.
 * @postcondicion Actualiza los datos del paciente en la base de datos.
 */
const actualizarPacientePorId = (id, updatedData, callback) => {
  const queries = [
    {
      sql: 'UPDATE usuario SET nombre = ?, apellido1 = ?, apellido2 = ?, correo = ?, centro = ?, cuerpo_medico = ? WHERE id = ?',
      params: [updatedData.nombre, updatedData.apellido1, updatedData.apellido2, updatedData.correo, updatedData.centro, updatedData.cuerpo_medico, id],
    },
    {
      sql: 'UPDATE paciente SET altura = ?, genero = ?, habitos_toxicos = ?, fecha_nacimiento = ?, exploraciones = ? WHERE id = ?',
      params: [updatedData.altura, updatedData.genero, updatedData.habitos_toxicos, updatedData.fecha_nacimiento, updatedData.exploraciones, id],
    },
    {
      sql: 'UPDATE paciente_tension SET tension_maxima = ?, tension_minima = ? WHERE id_paciente = ?',
      params: [updatedData.tension_maxima, updatedData.tension_minima, id],
    },
    {
      sql: 'UPDATE paciente_frecuenciacardiaca SET frecuencia_cardiaca = ? WHERE id_paciente = ?',
      params: [updatedData.frecuencia_cardiaca, id],
    },
    {
      sql: 'UPDATE paciente_peso SET peso = ? WHERE id_paciente = ?',
      params: [updatedData.peso, id],
    },
    {
      sql: 'UPDATE paciente_arritmia SET fecha_registro = ? WHERE id_paciente = ?',
      params: [updatedData.fecha_registro, id],
    },
  ];

  // Utilizamos Promise.all para actualizar todas las tablas de forma asíncrona
  Promise.all(
    queries.map((query) =>
      new Promise((resolve, reject) => {
        db.query(query.sql, query.params, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      })
    )
  )
    .then(() => {
      // Si todas las consultas se ejecutan correctamente
      callback(null, { message: "Datos actualizados correctamente." });
    })
    .catch((err) => {
      // Si ocurre un error en cualquiera de las consultas
      callback(err, null);
    });
};


/**
 * Obtiene las alarmas de medicamentos programadas para un paciente.
 * 
 * @param {number} id_paciente - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos de las alarmas.
 * @returns {void}
 * 
 * @precondicion El ID debe corresponder a un paciente con alarmas programadas.
 * @postcondicion Devuelve un arreglo de objetos con medicamento y hora.
 */
const getAlarmasPaciente = (id_paciente, callback) => {
  const sql = `
    SELECT m.nombre, th.hora, th.id_toma
    FROM toma_horas th
    JOIN toma_medicamento tm ON th.id_toma = tm.id
    JOIN medicamento m ON m.id = tm.id_medicamento
    WHERE tm.id_paciente = ?`;
  db.query(sql, [id_paciente], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

/**
 * Elimina un evento de arritmia de un paciente por fecha.
 * 
 * @param {number} id_paciente - El ID del paciente.
 * @param {string} fecha - La fecha del evento (formato "YYYY-MM-DD").
 * @param {function} callback - Función que maneja el error o la confirmación.
 * @returns {void}
 * 
 * @precondicion Debe existir una entrada de arritmia con esa fecha para ese paciente.
 * @postcondicion Si la entrada existe, se elimina y se retorna el resultado de la operación.
 */
const eliminarArritmiaporId = (id_paciente, fecha, callback) => {
  const sql = 'DELETE FROM paciente_arritmia WHERE id_paciente = ? AND fecha_registro = ?';
  db.query(sql, [id_paciente, fecha], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};


module.exports = {getPeso, setPeso, getTension, setFrecuencia, getFrecuencia, getDatosPacienteporId , setTension, getArritmia, setArritmia, getPacienteporId, setPacienteporId, getAlarmasPaciente, eliminarArritmiaporId, actualizarPacientePorId};