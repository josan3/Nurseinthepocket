import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robotsaludando from "../assets/saludando.png";  


const Bienvenida = () => {
  const navigate = useNavigate(); 

  const username = localStorage.getItem("username");
  const id = localStorage.getItem("id");

  const mensajes = [
    `¡Hola ${username}! Mi nombre es botAna y soy tu enfermero en el bolsillo`,
    "Estoy aquí para ayudarte y proporcionarte información sobre la fibrilación auricular",
    "Llevaremos el control de tu evolución y te acompañaré en este proceso ",
    "Pero tienes que saber que yo solo no puedo realizar esta tarea",
    "Necesito que emplees unos minutos a la semana para actualizar tus datos",
    "¡Esto te servirá tanto a ti como a los profesionales que te ayudan diariamente!"
  ];


  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndiceMensaje((prevIndice) => (prevIndice + 1) % mensajes.length);
    }, 5000);

    return () => clearInterval(intervalId); 
  }, [mensajes.length]);

  const [indiceMensaje, setIndiceMensaje] = useState(0);

  const avanzarDialogo = () => {
    setIndiceMensaje((prevIndice) => (prevIndice + 1) % mensajes.length);
  };

  return (
    <div>
      <div>
        <header>¡Bienvenido!</header>
      </div>

        <div className="cuerpo">
          <div className="container">
            <div className="robot-container" style={{ maxHeight:"100px", }} onClick={avanzarDialogo}>
              <img src={robotsaludando} alt="Robot" className="robot" />
              <div className="speech-bubble" style={{ maxHeight:"100px"}}>{mensajes[indiceMensaje]}</div>
            </div>
          </div>
        

          <div className="button2"
            onClick={() => {
              setTimeout(() => {
                localStorage.setItem("id", id);
                navigate(`/data`); 
              }, 1000); 
            }}
            >
            Continuar
          </div>
        </div>
        

    </div>
    
  );
};

export default Bienvenida;
