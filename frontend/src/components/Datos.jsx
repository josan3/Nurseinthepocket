import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import robothablando from "../assets/hablando.png"; 

const Datos = () => {
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("1");
  const [toxichabits, setToxichab] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const id = localStorage.getItem("id");
  const navigate = useNavigate(); 

  const mensaje = `Necesito que rellenes el cuestionario debajo de mí para saber más sobre tí`;
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    try {
      const response = await fetch("http://localhost:8801/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id,altura: height,genero: gender,habitos_toxicos: toxichabits,fecha_nacimiento: birthdate }),
      });

      const data = await response.json();

      console.log("id, ",id, height, gender, toxichabits, birthdate, data);

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
      <header>¡Bienvenido!</header>

      <div className="cuerpo">
        <div className="container">
          <div className="robot-container">
            <img src={robothablando} alt="Robot" className="robot"/>
            <div className="speech-bubble" style={{ maxHeight:"100px"}}>{mensaje}</div>
          </div>
        </div>   
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:"2%"}}>
            <label>Altura:</label><br />
            <input
              type="number"
              placeholder="Ingrese su altura en cms"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            </div>

            <div className="gender-container">
              <label>Género:</label><br />
              <select className="custom-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
                <option value="3">Otro</option>
              </select>
            </div>

            <div style={{marginBottom:"2%"}}>
              <label>Habitos toxicos:</label><br />
              <input
                type="text"
                placeholder="Indicame si tiene habitos toxicos (fuma, alchol,...)"
                value={toxichabits}
                onChange={(e) => setToxichab(e.target.value)}
              />
            </div>

            <div style={{marginBottom:"3%"}}>
              <label>Fecha de nacimiento:</label><br />
              <input
                type="date"
                placeholder="Indica su fecha de nacimiento"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>

            <button type="submit">
              Enviar</button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}
              
          </form>
      </div>
    </div> 
  );
};

export default Datos;