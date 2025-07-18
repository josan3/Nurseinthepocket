import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import robotsaludando from "../assets/saludando.png";  

const BienvenidaGoogle = () => {
  const navigate = useNavigate(); 
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [centro, setCentro] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("1");
  const [toxichabits, setToxichabits] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const id = localStorage.getItem("id");

  const mensajes = [
    `¡Antes de empezar tengo que informarte de algo!.`,
    "Al registrarte con Google deberás inciar sesion siempre con tu cuenta de Google ",
    "Esto te permite acceder a la aplicación sin la necesidad de recordar una contraseña",
    "Por lo que recuerda siempre usar la cuenta de Google con la que te registraste",
    "Una vez dicho esto, ¡mi nombre es X y soy tu enfermero en el bolsillo!",
    "Me alegra que estés aquí y estoy aquí para ayudarte y proporcionarte información sobre la fibrilación auricular",
     "Dejame saber más de ti rellenando esta información",
  ];

  const [indiceMensaje, setIndiceMensaje] = useState(0);

  const avanzarDialogo = () => {
    setIndiceMensaje((prevIndice) => (prevIndice + 1) % mensajes.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const datos = {
    nombre,
    apellido1,
    apellido2,
    centro,
    altura: height,
    genero: gender,
    habitos_toxicos: toxichabits,
    fecha_nacimiento: birthdate,
  };

    try {
      const response = await fetch("http://localhost:8801/dataGoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id, datos}),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Datos guardados"); // Muestra mensaje de éxito
        setError(""); // Borra errores previos
        setTimeout(() => {
          navigate(`/home`); // Redirige con el ID del usuario
        }, 1000); // Espera 1s antes de redirigir
      } else {
        setError(data.error || "Error al iniciar sesión"); // Muestra el error del backend
        setSuccess(""); // Borra mensaje de éxito
      }
    } catch (error) {
      setError("Error de conexión con el servidor", error);
      setSuccess("");
    }
  };

  return (
    <div>
      <div>
        <header>¡Bienvenido!</header>
      </div>
      <div className="container" style={{ top:"10%", maxWidth: "90%",}}>
        <button
          className="image-container"
          onClick={avanzarDialogo}
          style={{
            cursor: "pointer",
            left: "-10%",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <img src={robotsaludando} alt="Robot" className="robot" style={{ width: "20%", height: "auto" }} />
          <div className="speech-bubble" style={{ height:"60%", top: "15%", left:"63%", maxWidth: "100px", minHeight:"50px", maxHeight:"80px"}}>{mensajes[indiceMensaje]}</div>
        </button>
      </div>

        <form onSubmit={handleSubmit}>     
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <br />
          <div>
            <label htmlFor="apellido1">Primer apellido:</label>
            <input
              id="apellido1"
              type="text"
              placeholder="Ingrese su primer apellido"
              value={apellido1}
              onChange={(e) => setApellido1(e.target.value)}
            />
          </div>
          <br />
          <div>
            <label htmlFor="apellido2">Segundo apellido:</label>
            <input
              id="apellido2"
              type="text"
              placeholder="Ingrese su segundo apellido"
              value={apellido2}
              onChange={(e) => setApellido2(e.target.value)}
            />
          </div>
          <br />
          <div>
            <label htmlFor="hospital">Hospital:</label>
            <input
              id="hospital"
              type="text"
              placeholder="Ingrese su hospital correspondiente"
              value={centro}
              onChange={(e) => setCentro(e.target.value)}
            />
          </div>
          <br />
          <div style={{ marginBottom:"2%" }}>
            <label htmlFor="altura">Altura:</label>
            <input
              id="altura"
              type="number"
              placeholder="Ingrese su altura en cms"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <br />
          <div className="gender-container">
            <label htmlFor="genero">Género:</label>
            <select
              id="genero"
              className="custom-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
              <option value="3">Otro</option>
            </select>
          </div>
          <br />
          <div style={{ marginBottom:"2%" }}>
            <label htmlFor="habitos">Habitos tóxicos:</label>
            <input
              id="habitos"
              type="text"
              placeholder="Indícame si tiene habitos tóxicos (fuma, alcohol,...)"
              value={toxichabits}
              onChange={(e) => setToxichabits(e.target.value)}
            />
          </div>
          <br />
          <div style={{ marginBottom:"3%" }}>
            <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
            <input
              id="fechaNacimiento"
              type="date"
              placeholder="Indica su fecha de nacimiento"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <button type="submit">Enviar</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
    </div>
  );
};

export default BienvenidaGoogle;
