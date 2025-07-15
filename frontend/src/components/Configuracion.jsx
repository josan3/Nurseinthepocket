import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png";
import cara from "../assets/cara.png"; 

const Configuracion = () => {
    const id = localStorage.getItem("id");
    const [nombre, setNombre] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [altura, setAltura] = useState("");
    const [correo, setCorreo] = useState("");
    const [centro, setCentro] = useState("");
    const [habitos_toxicos, setHabitos_toxicos] = useState("");
    const [fechnacimiento, setFechNacimiento] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editableField, setEditableField] = useState(null); // Estado para controlar qué campo es editable
    const [showEditOptions, setShowEditOptions] = useState(false); // Estado para mostrar/ocultar las opciones de editar
    const mensaje = `¿Desea modificar algún dato personal?`;
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES"); // Formato: 23/02/2003
    };

    const [hovered, setHovered] = useState(null);
    
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a2 2 0 0 0 .5 2.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.1-.5 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.5a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .5-2.1 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.5-2.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.1.5 2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.5 2.1 2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.5a2 2 0 0 0-1.8 1.2z" />
            </svg>

        ) },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8801/configuracion", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, correo, centro, nombre, apellido1, apellido2, altura, habitos_toxicos}),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Datos registrados");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al registrar los datos");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8801/getconfiguracion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                console.log("Datos recibidos:", data);

                if (response.ok) {
                    setCorreo(data.data.usuario.correo)
                    setCentro(data.data.usuario.centro)
                    setNombre(data.data.usuario.nombre);
                    setApellido1(data.data.usuario.apellido1);
                    setApellido2(data.data.usuario.apellido2);
                    setAltura(data.data.paciente.altura);
                    setHabitos_toxicos(data.data.paciente.habitos_toxicos);
                    setFechNacimiento(data.data.paciente.fecha_nacimiento)
                    setSuccess("Datos obtenidos");
                    setError("");
                    
                } else {
                    setError(data.error || "Error al obtener datos");
                    setSuccess("");
                }
            } catch (error) {
                setError("Error de conexión con el servidor");
                setSuccess("");
            }
        };

        fetchData();
    }, [id]);

    const handleEditClick1 = (field) => {
        setEditableField(field); // Establece el campo que se puede editar
    };

    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); // Alterna la visibilidad de las opciones de editar
    };

    const handleOptionClick = (path) => {
        navigate(path); // Redirige a la ruta seleccionada
    };

    const handleInputChange = (field, value) => {
        if (field === "nombre") setNombre(value);
        if (field === "apellido1") setApellido1(value);
        if (field === "apellido2") setApellido2(value);
        if (field === "altura") setAltura(value);
        if (field === "habito_toxicos") setHabitos_toxicos(value);
        if (field === "fecha_nacimiento") setFechNacimiento(value);
        if (field === "correo") setCorre(value);
        if (field === "centro") setCentro(value);
    };

    return (
        <div>
            <header style={{marginBottom: "50px"}}>Configuración</header>
  
            <div className="cuerpo">
            
                <div className="container" >
                    <div className="robothablando-container">
                        <img src={robot} alt="Robot" className="robotquieto" />
                        <div className="speech-bubble" style={{maxHeight:"150px"}}>
                            {mensaje}
                        </div>
                    </div>

                    {/* Modal de confirmación */}
                       {showModal && (
                           <div className="confirmation-modal" >
                               <div className="modal-content">
                               <img src={cara} alt="Robot" className="robot" style={{ width: "10%", height: "auto" }} />
                               
                               <p>
                                   ¿Quieres guardar los cambios realizados?                              
                               </p>
                               
                                <button
                                onClick={handleSubmit} // tu función de submit
                                style={{
                                    marginRight: "10px",
                                    padding: "8px 16px",
                                    backgroundColor: "#2fa831",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                                >
                                Guardar
                                </button>
                                <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ccc",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                                >
                                Cancelar
                                </button>
                               </div>
                           </div>
                           )}

                           <div style={{ height: "5px" }} />
            
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
                                color: btn.path === "/configuracion" ? "#2fa831" : "black",
                                cursor: btn.path === "/configuracion" ? "default" : "pointer",
                                transition: "transform 0.5s",
                            }}
                            disabled={btn.path === "/configuracion"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {btn.icon}
                                <span className="button-label" style={
                                    btn.nombre === "Editar datos personales"
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 10v2"/>
                                    </svg>
                                    &nbsp; &nbsp; Peso
                                </button>
                                <button onClick={() => handleOptionClick("/arritmia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
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
            

            <div className="configuracion" >
                <form onSubmit={handleSubmit} style={{marginBottom: "100px", backgroundColor: "transparent", fontSize: "18px"}}>
                    <h3 style={{marginTop: "-10px", marginBottom: "10px", backgroundColor: "transparent"}}>Datos personales</h3>
                    <div>
                        <label>Correo:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: "100%" }}
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={correo}
                                onChange={(e) => handleInputChange("correo", e.target.value)}
                                disabled
                            />
                            
                        </div>
                    </div>
                    <div>
                        <label>Nombre:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={nombre}
                                onChange={(e) => handleInputChange("nombre", e.target.value)}
                            />
                    </div>
                    </div>
                    <div>
                        <label>Primer apellido:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese su primer apellido"
                                value={apellido1}
                                onChange={(e) => handleInputChange("apellido1", e.target.value)}
                                />
                        </div>
                    </div>
                    <div>
                        <label>Segundo apellido:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese su segundo apellido"
                                value={apellido2}
                                onChange={(e) => handleInputChange("apellido2", e.target.value)}
                                />
                        </div>
                    </div>
                    <div>
                        <label>Centro:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese su centro médico"
                                value={centro}
                                onChange={(e) => handleInputChange("centro", e.target.value)}
                                disabled
                            />
                        </div>
                    </div>
                    <div>
                        <label>Altura:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                           <div style={{ position: "relative", width: "90%" }}>
                                <input
                                    style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    width: "100%",
                                    paddingRight: "8%",
                                    }}
                                    type="text"
                                    placeholder="Ingrese altura"
                                    value={altura}
                                    onChange={(e) => handleInputChange("altura", e.target.value)}
                                />
                                <span
                                    style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "black",
                                    pointerEvents: "none"
                                    }}
                                >
                                    cms
                                </span>
                                </div>
                        </div>
                    </div>
                    <div>
                        <label>Hábitos tóxicos:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese hábitos tóxicos"
                                value={habitos_toxicos}
                                onChange={(e) => handleInputChange("habito_toxicos", e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Fecha Nacimiento:</label><br />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: "100%"  }}
                                type="text"
                                placeholder="Ingrese su fecha de nacimiento"
                                value={formatDate(fechnacimiento)}
                                disabled
                            />
                        </div>
                    </div>
                    <button type="button" onClick={() => setShowModal(true)}>
                        Guardar cambios
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
           </div>

           <div style={{height: "10px"}}></div>

        
        </div>
        </div>
        </div>
    );
};

export default Configuracion;