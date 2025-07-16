import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png"; 
import emailjs from "@emailjs/browser";

const Correo = () => {
    const navigate = useNavigate();
    const [showEditOptions, setShowEditOptions] = useState(false); // Estado para mostrar/ocultar las opciones de editar

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        emailjs.sendForm("service_2b5cnq4", "template_5od5vic", e.target, "sIPPhiKFwIJxPCofc")
        setSuccess("Correo enviado");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
    };

    const buttons = [
        { path: "/informacion", label: "Obtener información", nombre: "Obtener información", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
        ) },
        { path: "/correo", label: "Correo asociación",  nombre: "Enviar correo", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <path d="M22 6l-10 7L2 6" />
            </svg>
        ) },
        { path: "/home", label: "Inicio", nombre: "Inicio", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
                <path d="M21 22H3" />
            </svg>
        ) },
        { label: "Editar parámetros", nombre: "Añadir parámetro", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ) },
        { path: "/configuracion",label: "Ajustes de usuario", nombre: "Editar datos personales", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a2 2 0 0 0 .5 2.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.1-.5 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.5a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .5-2.1 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.5-2.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.1.5 2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.5 2.1 2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.5a2 2 0 0 0-1.8 1.2z" />
            </svg>

        ) },
    ];

    const id = localStorage.getItem("id");

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch("http://localhost:8801/getcorreo", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id }),
                    });
    
                    const data = await response.json();
                    console.log("Datos recibidos:", data);
    
                    if (response.ok) {
                        setEmail(data.data.correo)
                        
                    } else {
                        console.log(data.error || "Error al obtener datos");
                    }
                } catch (error) {
                    console.log("Error de conexión con el servidor", error);
                }
            };
    
            fetchData();
        }, [id]);

    const mensaje = (
        <>
          Si quieres conseguir más información o consultar dudas, no dudes en mandarle un correo a la asociación Trebol de corazones.
          <br />
          <br />
          Una vez enviado el correo te responderán cuando puedan a la dirección de correo que nos proporcionaste.
          <br />
        </>
    );      

    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); // Alterna la visibilidad de las opciones de editar
    };

    const handleOptionClick = (path) => {
        navigate(path); // Redirige a la ruta seleccionada
    };

    return (
        <div>
            <header style={{marginBottom: "50px"}}>Contacto asociación</header>
           
            <div className="cuerpo">

            <div className="container" >
                <div className="robothablando-container">
                    <img src={robot} alt="Robot" className="robotquieto" />
                    <div className="speech-bubble" style={{maxHeight:"250px"}}>
                        {mensaje}
                    </div>
                </div>
           

                <div className="correo" >
                        <form onSubmit={handleSubmit} className="formulario-contacto">
                            <div style={{ marginBottom: "20px"}}>
                                <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                    Correo del destinatario:
                                </label>
                                <input
                                    id="name"
                                    type="email"
                                    name="name"
                                    placeholder="Ingrese su correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        fontSize: "16px",
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label htmlFor="message" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                    Mensaje:
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="Escriba su mensaje aquí"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        fontSize: "16px",
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#2fa831",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    minWidth: "100px",
                                }}
                            >
                                Enviar
                            </button>
                            {success && <p style={{ color: "green" }}>{success}</p>}
                        </form>
                        
                    </div>

             </div>
            
            <div style={{ height: "700px" }} />
  

            
            <div className="barra"style={{ height: "10%" }}></div>
            <div className="barra2" style={{ height: "1000%", top: "-200px" }}></div>
            <div className="barra3" style={{ top: "426px"}}></div>
            <div className="footer" >
                
                {buttons.map((btn, index) => (
                    <div key={index} className="button-container">
                        <button
                            onClick={() => {
                                if (btn.label === "Editar parámetros") {
                                    handleEditClick();
                                } else if (btn.path) {
                                    navigate(btn.path);
                                }
                            }}
                            style={{

                                display: "inline-block",
                                padding: "10px",
                                position: "relative",
                                color: btn.path === "/correo" ? "#2fa831" : "black",
                                cursor: btn.path === "/correo" ? "default" : "pointer",
                                transition: "transform 0.5s",
                            }}
                            disabled={btn.path === "/correo"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {btn.icon}
                                <span className="button-label" style={
                                    btn.nombre === "Enviar correo"
                                    ? { color: "#2fa831", fontWeight: "bold" }
                                    : {}
                                }>{btn.nombre}</span>
                            </div>
                        </button>
                        {btn.label === "Editar parámetros" && showEditOptions && (
                            <div
                                className="edit-options"
                                style={{left: "10%"}}
                            >
                                <button onClick={() => handleOptionClick("/frecuencia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12h4l3 6 5-12 3 6h5" />
                                        <circle cx="20" cy="12" r="2" />
                                    </svg>
                                    &nbsp; &nbsp; Frecuencia
                                </button>

                                <button onClick={() => handleOptionClick("/peso")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 10v2"/>
                                    </svg>
                                    &nbsp; &nbsp; Peso
                                </button>
                                <button onClick={() => handleOptionClick("/arritmia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                                    </svg>
                                    &nbsp; &nbsp; Arritmia
                                </button>
                                <button onClick={() => handleOptionClick("/tension")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="15"
                                             height="15"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            >
                                            <circle cx="10" cy="6" r="4" />

                                            <line x1="10" y1="6" x2="12" y2="4" />

                                            <path d="M10 10c0 4 0 6-6 6" />

                                            <rect x="2" y="14" width="8" height="4"  rx="1"/>

                                            <circle cx="16" cy="16" r="2" />

                                            <path d="M14 16c-3 0-3-2-3-4" />
                                        </svg>

                                &nbsp; &nbsp; Tensión
                                </button>
                                <button onClick={() => handleOptionClick("/medicacion")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)" />
                                        <line x1="10" y1="10" x2="14" y2="15" />
                                        <rect x="8" y="12" width="7" height="8" rx="2" transform="rotate(45 12 12)" fill="currentColor"/>
                                    </svg>
                                &nbsp; &nbsp; Medicación
                                </button>
                                <button onClick={() => handleOptionClick("/tomas")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15" 
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                &nbsp;&nbsp;Tomas
                                
                            </button>
                            
                            </div>
                            
                        )}
                    </div>
                ))}
            </div>
         </div>

            
        </div>
    );
};

export default Correo;