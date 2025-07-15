import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  ComposedChart, Bar, Legend, Scatter } from "recharts";
import robot from "../assets/normal.png"; 



const Tension = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);  // Estado para almacenar los datos de la API
    const [error, setError] = useState(""); // Estado para manejar errores
    const [, setSuccess] = useState(""); // Estado para mostrar mensajes de éxito
    const [valor_max, setValorMax] = useState("");
    const [valor_min, setValorMin] = useState("");
    const mensaje = `¿Quieres añadir un nuevo dato sobre tu tensión`;
    const id = localStorage.getItem("id");
    const [showEditOptions, setShowEditOptions] = useState(false); // Estado para mostrar/ocultar las opciones de editar
    

    const handleOptionClick = (path) => {
        navigate(path); // Redirige a la ruta seleccionada
    };
    
    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); // Alterna la visibilidad de las opciones de editar
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a2 2 0 0 0 .5 2.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.1-.5 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.5a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .5-2.1 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.5-2.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.1.5 2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.5 2.1 2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.5a2 2 0 0 0-1.8 1.2z" />
            </svg>

        ) },
    ];


    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        try {
            const response = await fetch("http://localhost:8801/tension", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, tension_max: valor_max, tension_min: valor_min }),
            });
            
            const data = await response.json();
        
            if (response.ok) {
                setSuccess("Tensión registrada");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al registrar la tensión");
                setSuccess("");
            }
        } catch (error) {
          setError("Error de conexión con el servidor", error);
          setSuccess("");
        }
        
    };

    useEffect(() => {

        const fetchData = async () => {
            const id = localStorage.getItem("id");

            try {
                const response = await fetch("http://localhost:8801/gettension", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                console.log("Datos recibidos:", data);

                if (response.ok) {
                    // Calcula la frecuencia media y añade el campo `frecuencia_med` a cada objeto
                    const updatedData = data.data.map((item) => ({
                        ...item,
                        tension_med: (item.tension_max + item.tension_min) / 2, // Calcula la media
                        tension_maxima: item.tension_max - item.tension_min, // Suma tension_max y tension_min
                    }));
    
                    console.log("Datos con tension_maxima calculada:", updatedData);
                    setData(updatedData); // Actualiza el estado con los datos modificados
                    setSuccess("Datos obtenidos"); // Muestra mensaje de éxito
                    setError(""); // Borra errores previos
                } else {
                    setError(data.error || "Error al obtener datos"); // Muestra el error del backend
                    setSuccess(""); // Borra mensaje de éxito
                }
            } catch (error) {
                setError("Error de conexión con el servidor", error);
                setSuccess("");
            }
        };

        fetchData();
    }, []); 



    return (
        <div >
            <header>Historial de tension arterial</header>


        <div className="cuerpo">
                    <div className="container">
                    <div className="robothablando-container" style={{ marginBottom: "500px" }}>
                        <img src={robot} alt="Robot" className="robotquieto" />
                        <div 
                        className="speech-bubble" 
                        style={{ 
                            marginTop: "-350px",
                            height: "auto", 
                            padding: "15px",  
                            boxSizing: "border-box",
                            minWidth: "170px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        >
                       {mensaje}
                        <div style={{ marginTop: "20px" }}>
                        <form onSubmit={handleSubmit} style={{ marginTop: "20px", backgroundColor: "transparent", top: "-30px" }}>
                            <label>Ingresa la nueva tensión máxima:</label>
                            <input 
                                type="number"  
                                value={valor_max} 
                                onChange={(e) => setValorMax(e.target.value)} 
                                placeholder="Ingreselo aqui"
                                style={{ marginTop: "10px"}}
                                required
                            />
                            <label>Ingresa la nueva tensión mínima:</label>
                            <input 
                                type="number"  
                                value={valor_min} 
                                onChange={(e) => setValorMin(e.target.value)} 
                                placeholder="Ingreselo aqui"
                                style={{ marginTop: "10px"}}
                                required
                            />

                        <button type="submit" style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}>Enviar</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="barra" ></div>
            <div className="barra2"></div>
            <div className="barra3"></div>
            <div className="footer">
                
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
                                transition: "transform 0.5s",
 
                            }}
                            disabled={btn.path === "/tension"}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {btn.icon}
                                <span className="button-label" style={
                                    btn.nombre === "" 
                                    ? { color: "#2fa831", fontWeight: "bold" }
                                    : {}
                                }>{btn.nombre}</span>
                            </div>
                        </button>
                        {btn.label === "Editar parámetros" && showEditOptions && (
                            <div
                                className="edit-options"
                                style={{left: "10%",
                                }}>   
                                <button onClick={() => handleOptionClick("/frecuencia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentcolor"
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
                                <button onClick={() => handleOptionClick("/tension")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px", color: "#2fa831" }}>
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
            

            <div style={{ backgroundColor: "white", position: "relative", zIndex: "100", width: "75%", left: "19%", borderRadius: "10px"  }}>
                <div className="graficas" style={{ marginTop: "280px"}}>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis stroke="#2fa831" dataKey="fecha" tick={{ fontSize: 16, fontWeight: 'bold' }} />
                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 16, fontWeight: 'bold' }} stroke="#2fa831" />
                        <Tooltip />

                        {/* Barra para la diferencia entre tensiones */}
                        <Bar dataKey="tension_min" fill="transparent" barSize={8} name="" stackId="tension" />
                        <Bar dataKey="tension_maxima" fill="blue" barSize={8} name="Diferencia entre máxima y mínima"  stackId="tension" />

                        {/* Punto en tensión máxima */}
                        <Scatter 
                            dataKey="tension_max" 
                            fill="blue" // Color de los puntos
                            name="Tensión Máxima"
                        />
                        
                        {/* Punto en tensión mínima */}
                        <Scatter 
                            dataKey="tension_min" 
                            fill="blue" // Color de los puntos
                            name="Tensión Mínima"
                        />

                        {/* Línea de tensión media */}
                        <Line 
                            type="monotone" 
                            dataKey="tension_med" 
                            stroke="#4A90E2" 
                            strokeWidth={4} 
                            dot={{ r: 6 }} 
                            strokeDasharray="5 5" 
                            name="Tensión Media" 
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            </div>
            </div>
        </div>
    );
};

export default Tension;
