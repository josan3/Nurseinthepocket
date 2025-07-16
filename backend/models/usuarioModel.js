const mysql = require('mysql');
const bcrypt = require('bcryptjs');
require("dotenv").config({ path: "../.env" });

const saltRounds = 10;

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});


// Manejo de errores en la conexión
db.connect((err) => {
  if (err) {
    console.error("Prueba",  process.env.DB_PASSWORD)
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

/**
 * Crea un nuevo usuario y lo registra como paciente en la base de datos.
 * 
 * @param {string} correo - Correo del usuario.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} password - Contraseña del usuario (sin cifrar).
 * @param {string} apellido1 - Primer apellido del usuario.
 * @param {string} apellido2 - Segundo apellido del usuario.
 * @param {string} centro - Hospital del usuario.
 * @param {function} callback - Función callback que recibe error o resultado.
 */
const crearUsuario = async (correo, nombre, password, apellido1, apellido2, centro, callback) => {
  try {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    const insertSql = "INSERT INTO usuario (correo, password, nombre, apellido1, apellido2, centro) VALUES (?, ?, ?, ?, ?, ?)";
    await new Promise((resolve, reject) => {
      db.query(insertSql, [correo, hashedPassword, nombre, apellido1, apellido2, centro], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const sql1 = "SELECT id FROM usuario WHERE correo = ?";
    const result2 = await new Promise((resolve, reject) => {
      db.query(sql1, [correo], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (result2.length === 0) {
      return callback(new Error('Usuario no encontrado'), null);
    }

    const sql2 = "INSERT INTO paciente (id) VALUES (?)";
    await new Promise((resolve, reject) => {
      db.query(sql2, [result2[0].id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    return callback(null, { id: result2[0].id });
  } catch (error) {
    return callback(error, null);
  }
};


/**
 * Crea un nuevo usuario y lo registra como paciente en la base de datos.
 * 
 * @param {string} correo - Correo del usuario.
 * @param {function} callback - Función callback que recibe error o resultado.
 */
const crearUsuarioGoogle = (correo, callback) => {
  const insertSql = "INSERT INTO usuario (correo) VALUES (?)";

  db.query(insertSql, [correo], (err, result1) => {
    if (err) {
      console.error("Error al insertar en usuario:", err);
      return callback(err, null);
    }

    const sql1 = "SELECT id FROM usuario WHERE correo = ?";
    db.query(sql1, [correo], (err, result2) => {
      if (err) {
        console.error("Error al buscar el ID del usuario:", err);
        return callback(err, null);
      }

      if (result2.length === 0) {
        console.error("Usuario no encontrado después de insertar.");
        return callback(new Error('Usuario no encontrado'), null);
      }

      const sql2 = "INSERT INTO paciente (id) VALUES (?)";
      db.query(sql2, [result2[0].id], (err, result3) => {
        if (err) {
          console.error("Error al insertar en paciente:", err);
          return callback(err, null);
        }

        return callback(null, { id: result2[0].id });
      });
    });
  });
};


/**
 * Busca todos los datos de un usuario por su ID.
 * 
 * @param {string} correo - Correo del usuario.
 * @param {function} callback - Callback que recibe error o los datos del usuario.
 */
const encontrarUsuarioporCorreo = (correo, callback) => {
  const sql = 'SELECT * FROM usuario WHERE correo = ?';
  db.query(sql, [correo], (err, result) => {
    if (err) return callback(err, null);

    if (result.length === 0) return callback(null, null);

    return callback(null, result[0]);
  });
};


/**
 * Obtiene nombre y apellidos de un usuario por su ID.
 * 
 * @param {string} id - ID del usuario.
 * @param {function} callback - Callback con el resultado.
 */
const getUsuarioporId = (id, callback) => {
  const sql = 'SELECT nombre, apellido1, apellido2, correo, centro FROM usuario WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result[0]);
  });
};

/**
 * Obtiene solo el nombre de un usuario por su ID.
 * 
 * @param {string} id - ID del usuario.
 * @param {function} callback - Callback con el nombre.
 */
const getNombreUsuarioporId = (id, callback) => {
  const sql = 'SELECT nombre FROM usuario WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result[0]);
  });
};

/**
 * Actualiza los datos del paciente.
 * 
 * @param {string} id - ID del paciente.
 * @param {number} altura - Altura en cm.
 * @param {string} genero - Género del paciente.
 * @param {string} habitos_toxicos - Hábitos tóxicos del paciente.
 * @param {string} fecha_nacimiento - Fecha de nacimiento (YYYY-MM-DD).
 * @param {function} callback - Callback que retorna el resultado.
 */
const actualizar = (id, altura, genero, habitos_toxicos, fecha_nacimiento, callback) => {
  const sql = `UPDATE paciente SET altura = ?, genero = ?, habitos_toxicos = ?, fecha_nacimiento = ? WHERE id = ?`;
  db.query(sql, [altura, genero, habitos_toxicos, fecha_nacimiento, id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

/**
 * Actualiza los datos del paciente.
 * 
 * @param {string} id - ID del paciente.
 * @param {string} correo - Correo del usuario.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} password - Contraseña del usuario (sin cifrar).
 * @param {string} apellido1 - Primer apellido del usuario.
 * @param {string} apellido2 - Segundo apellido del usuario.
 * @param {string} centro - Hospital del usuario.
 * @param {number} altura - Altura en cm.
 * @param {string} genero - Género del paciente.
 * @param {string} habitos_toxicos - Hábitos tóxicos del paciente.
 * @param {string} fecha_nacimiento - Fecha de nacimiento (YYYY-MM-DD).
 * @param {function} callback - Callback que retorna el resultado.
 */
const actualizarGoogle = (id, datos, callback) => {
  const { nombre, apellido1, apellido2, centro, altura, genero, habitos_toxicos, fecha_nacimiento } = datos;

  const sql1 = `UPDATE usuario SET nombre = ?, apellido1 = ?, apellido2 = ?, centro = ? WHERE id = ?`;
  db.query(sql1, [nombre, apellido1, apellido2, centro, id], (err, result) => {
    if (err) return callback(err, null);

    const sql2 = `UPDATE paciente SET altura = ?, genero = ?, habitos_toxicos = ?, fecha_nacimiento = ? WHERE id = ?`;
    db.query(sql2, [altura, genero, habitos_toxicos, fecha_nacimiento, id], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  });
};



/**
 * Actualiza los datos personales del usuario (nombre y apellidos).
 * 
 * @param {string} id - ID del usuario.
 * @param {string} nombre - Nuevo nombre.
 * @param {string} apellido1 - Nuevo primer apellido.
 * @param {string} apellido2 - Nuevo segundo apellido.
 * @param {string} correo - Nuevo correo
 * @param {string} centro - Nuevo centro medico
 * @param {function} callback - Callback con resultado.
 */
const actualizarUsuarioporId = (id, nombre, apellido1, apellido2, correo, centro, callback) => {
  const sql = `UPDATE usuario SET nombre = ?, apellido1 = ?, apellido2 = ?, correo = ?, centro = ? WHERE id = ?`;
  db.query(sql, [nombre, apellido1, apellido2, correo, centro, id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

/**
 * Obtiene el ID de un usuario a partir de su nombre y apellidos.
 * 
 * @param {string} nombre - Nombre del usuario.
 * @param {string} apellido1 - Primer apellido.
 * @param {string} apellido2 - Segundo apellido.
 * @param {function} callback - Callback con el ID encontrado.
 */
const getIdporNombreUsuario = (nombre, apellido1, apellido2, fecha_nacimiento, callback) => {

  console.log(nombre, apellido1, apellido2, fecha_nacimiento)
  const sql = `
    SELECT usuario.id
    FROM usuario
    JOIN paciente ON paciente.id = usuario.id
    WHERE usuario.nombre = ? AND usuario.apellido1 = ? AND usuario.apellido2 = ? AND paciente.fecha_nacimiento = ?
  `;
  
  db.query(sql, [nombre, apellido1, apellido2, fecha_nacimiento], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result[0]);
  });
};


/**
 * Obtiene la lista de todos los usuarios registrados.
 * 
 * @param {function} callback - Callback con un array de usuarios.
 */
const getListaUsuarios = (callback) => {
  const sql = `
    SELECT u.nombre, u.apellido1, u.apellido2, u.id, p.fecha_nacimiento, u.cuerpo_medico
    FROM usuario u
    JOIN paciente p ON u.id = p.id
  `;

  db.query(sql, [], (err, result) => {
    if (err) callback(err, null);
    else  callback(null, result);
  });
};



const editarUsuarioporId = (id, updatedData, callback) => {

  console.log(id, updatedData)
  const queryUsuario = `
      UPDATE usuario 
      SET nombre = ?, apellido1 = ?, apellido2 = ?, correo = ?, centro = ?, cuerpo_medico = ? 
      WHERE id = ?
  `;
  const paramsUsuario = [
      updatedData.nombre,
      updatedData.apellido1,
      updatedData.apellido2,
      updatedData.correo,
      updatedData.centro,
      updatedData.cuerpo_medico,
      id
  ];

  const queryPaciente = `
      UPDATE paciente 
      SET altura = ?, genero = ?, habitos_toxicos = ?, fecha_nacimiento = ?, exploraciones = ? 
      WHERE id = ?
  `;
  const paramsPaciente = [
      updatedData.altura,
      updatedData.genero,
      updatedData.habitos_toxicos,
      updatedData.fecha_nacimiento,
      updatedData.exploraciones,
      id
  ];

  db.query(queryUsuario, paramsUsuario, (err1, result1) => {
      if (err1) return callback(err1);

      db.query(queryPaciente, paramsPaciente, (err2, result2) => {
          if (err2) return callback(err2);

          callback(null, {
              usuario: result1,
              paciente: result2
          });
      });
  });
};

const eliminarUsuarioporId = (id, callback) => {
  console.log("Eliminando usuario con ID:", id);

  const queryPaciente = `DELETE FROM paciente WHERE id = ?`;
  const queryUsuario = `DELETE FROM usuario WHERE id = ?`;

  db.query(queryPaciente, [id], (err1, result1) => {
    if (err1) return callback(err1);

    db.query(queryUsuario, [id], (err2, result2) => {
      if (err2) return callback(err2);

      callback(null, {
        paciente: result1,
        usuario: result2
      });
    });
  });
};

/**
 * Obtiene los datos básicos del paciente (altura, hábitos, fecha de nacimiento).
 * 
 * @param {number} id - El ID del paciente.
 * @param {function} callback - Función que maneja el error o los datos obtenidos.
 * @returns {void}
 * 
 * @precondicion El ID debe existir en la tabla de uusario.
 * @postcondicion Se devuelve el correo del usuario.
 */
const getCorreo = (id, callback) => {
    
  const sql = 'SELECT correo FROM usuario WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    console.log("dentro")
    if (err) callback(err, null);
    else callback(null, result[0]); 
  });
};


/**
 * Obtiene la lista de todos los usuarios registrados.
 * 
 * @param {string} centro - El centro del paciente.
 * @param {function} callback - Callback con un array de usuarios.
 */
const getListaUsuariosCentro = (centro, callback) => {
  const sql = `
    SELECT u.nombre, u.apellido1, u.apellido2, u.id, p.fecha_nacimiento, u.cuerpo_medico
    FROM usuario u
    JOIN paciente p ON u.id = p.id
    WHERE u.centro = ?
  `;

  db.query(sql, [centro], (err, result) => {
    if (err) callback(err, null);
    else  callback(null, result);
  });
};

const setRegistroUsuarioAcceso = async (id) => {
  const sql = "INSERT INTO registro_usuarios (id_usuario) VALUES (?)";

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve({ result: true });
    });
  });
};

const obtenerHistorial = (callback) => {
  const sql = `
    SELECT 
      u.nombre,
      u.apellido1,
      u.apellido2,
      u.correo,
      r.hora
    FROM 
      registro_usuarios r
    JOIN 
      usuario u ON r.id_usuario = u.id
    ORDER BY 
      r.hora DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

const obtenerCentros = (callback) => {
  const sql = `
  SELECT DISTINCT 
    centro
  FROM 
    usuario
`;
  db.query(sql, (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};



module.exports = {obtenerCentros, obtenerHistorial, setRegistroUsuarioAcceso, crearUsuario, actualizarGoogle, encontrarUsuarioporCorreo, getUsuarioporId, actualizarUsuarioporId, actualizar, getNombreUsuarioporId, getIdporNombreUsuario, getListaUsuarios, editarUsuarioporId, eliminarUsuarioporId, getCorreo, getListaUsuariosCentro, crearUsuarioGoogle};