import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa los estilos del calendario
import robot from "../assets/normal.png"; 
import cara from "../assets/cara.png"; 

const Arritmia = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([false]);  // Estado para almacenar los datos de la API
    const [, setError] = useState(""); // Estado para manejar errores
    const [, setSuccess] = useState(""); // Estado para mostrar mensajes de éxito
    const [selectedDate, setSelectedDate] = useState(null);  // Nuevo estado para la fecha seleccionada
    const [showEditOptions, setShowEditOptions] = useState(false); 
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const id = localStorage.getItem("id");
    const [dia, setDia] = useState(false);

    
    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); // Alterna la visibilidad de las opciones de editar
    };

    const mensaje = (
        <>
          Si has tenido una arritmia utiliza este calendario como diario.
          <br />
          <br />
          <br />
          ¡Recuerda que puedes tanto registrar como eliminar arritmias!
          <br />
          <br />
          <br />
          El control en la evolución de tus arritmias te ayudará a ti y a los profesionales que te cuidan a tener un mejor seguimiento de tu salud.
        </>
    ); 

    // Función para manejar la confirmación
    const confirmArritmia = () => {
        // Registro de la arritmia con la fecha seleccionada
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato AÑO-MES-DÍA
        registerArritmia(formattedDate);
        setShowConfirmation(false); // Cierra el modal de confirmación
    };

    const cancelArritmia = () => {
        setShowConfirmation(false); // Cierra el modal si se cancela
    };

    // Función para manejar la confirmación de eliminar la arritmia
    const confirmDeleteArritmia = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato AÑO-MES-DÍA
        try {
            const response = await fetch("http://localhost:8801/eliminararritmia", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, fecha: formattedDate }), // Eliminamos la arritmia
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Arritmia eliminada");
                setError("");
                window.location.reload(); 
            } else {
                setError(data.error || "Error al eliminar la arritmia");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor", error);
            setSuccess("");
        }
        setShowDeleteConfirmation(false); 
    };



    const handleOptionClick = (path) => {
        navigate(path);
    };

    const handleDateClick = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1); // Sumar un día

        setSelectedDate(newDate);

        const newDia = new Date(date);
        newDia.setDate(newDia.getDate()); // Sumar un día
        setDia(newDia)

        const formattedDate = newDate.toISOString().split('T')[0];
        const arritmiaExists = data.some(entry => entry.fecha === formattedDate); // Verifica si ya existe una arritmia para la fecha

        if (arritmiaExists) {
            setShowDeleteConfirmation(true); // Muestra el modal de eliminar
        } else {
            setShowConfirmation(true); // Muestra el modal de confirmar registro
        }
    };

    const registerArritmia = async (date) => {
        try {
            const response = await fetch("http://localhost:8801/arritmia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, fecha: date }), // Registramos la fecha
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Arritmia registrada");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al registrar la arritmia");
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
                const response = await fetch("http://localhost:8801/getarritmia", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                console.log("Datos recibidos:", data);

                if (response.ok) {
                    setData(data.data); // Aquí se actualizan los datos
                    setSuccess("Datos obtenidos");
                    setError("");
                } else {
                    setError(data.error || "Error al obtener datos");
                    setSuccess("");
                }
            } catch (error) {
                setError("Error de conexión con el servidor", error);
                setSuccess("");
            }
        };

        fetchData();
    }, []);

    // Convierte las fechas de arritmia en formato Date
    const markedDates = data.map(entry => new Date(entry.fecha));
            
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

    return (
        <div >
            <header>Historial de arritmias</header>

            <div className="cuerpo">
            <div className="container">
                <div className="robothablando-container" style={{ marginBottom: "400px" }}>
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
                            disabled={btn.path === "/arritmia"}
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
                                <button onClick={() => handleOptionClick("/frecuencia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px"}}>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 10v2"/>
                                    </svg>
                                    &nbsp; &nbsp; Peso
                                </button>
                                <button onClick={() => handleOptionClick("/arritmia")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px", color: "#2fa831"  }}>
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


            {/* Calendario con días marcados */}
            <div className="calendar-container">
                <Calendar
                    onClickDay={handleDateClick} // Llamamos a la función handleDateClick al hacer clic en un día
                    tileClassName={({ date }) => 
                        markedDates.some(d => d.toDateString() === date.toDateString()) 
                        ? "marked-date" 
                        : null
                    }
                    tileContent={({ date }) =>
                        markedDates.some(d => d.toDateString() === date.toDateString()) ? (
                            <div className="calendar-note" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                                </svg>
                            </div>
                        ) : null
                    }
                    
                    onClick={() => {}} // Deshabilita la selección de días
                    selectRange={false} // Evita la selección de un rango de fechas
                />
            </div>

            {/* Modal de confirmación */}
            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                    <img src={cara} alt="Robot" className="robot" style={{ width: "10%", height: "auto" }} />
                    
                    <p>
                        ¿Quieres registrar la arritmia para el día seleccionado?
                        <br />
                        <strong>
                        {dia?.toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                        </strong>
                    </p>
                    
                    <button onClick={confirmArritmia}>Sí</button>
                    <button onClick={cancelArritmia}>No</button>
                    </div>
                </div>
                )}


            {/* Modal de confirmación para eliminar */}
            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <img src={cara} alt="Robot" className="robot" style={{ width: "10%", height: "auto" }} />
                        <p>¿Quieres eliminar la arritmia para el día seleccionado?
                        <br />
                        <strong>
                        {dia?.toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                        </strong>
                    </p>
                        <button onClick={confirmDeleteArritmia}>Sí</button>
                        <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Arritmia;
