import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png"; 
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import cara from "../assets/cara.png"; 

const Medicacion = () => {
    const navigate = useNavigate();
    const [showEditOptions, setShowEditOptions] = useState(false); // Estado para mostrar/ocultar las opciones de editar
    const [lista, setLista] = useState([]);
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
    const [medicamentoNombre, setMedicamentoNombre] = useState("");
    const [listaTomas, setlistaTomas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [tomas, setTomas] = useState(1); 
    const [horas, setHoras] = useState([]);
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState([]);
    const [showMedicamentos, setShowMedicamentos] = useState(false);
    const [tomaSeleccionada, setTomaSeleccionada] = useState(null); 
    const [id_toma, setIdToma] = useState(null);

    const handleHorasChange = (index, newHora) => {
        setHoras((prevHoras) => {
            const updatedHoras = [...prevHoras];
            updatedHoras[index] = newHora; 
            return updatedHoras;
        });
    };

    const handleSearchClick = () => {
        setShowMedicamentos(true);  // Mostrar la lista al hacer clic
    };


    const handleMedicamentoSelect = (medicamento) => {
        setMedicamentoNombre(medicamento.nombre);
        setBusqueda(medicamento.nombre);
        setShowMedicamentos(false);  // Ocultar la lista una vez seleccionado un medicamento
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8801/setpacientemedicamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, medicacion: medicamentoNombre, numero_tomas: tomas, horas_tomas: horas}),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                setSuccess("Medicacion registrada");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al registrar la medicacion");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };

    const handleEliminarToma = async (e) => {
        e.preventDefault();

        console.log("ID de la toma a eliminar:", id_toma); // Verifica el ID de la toma

        try {
            const response = await fetch("http://localhost:8801/deletetoma", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id_toma}),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                setSuccess("Medicacion registrada");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al registrar la medicacion");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };


    const buttons = [
        { path: "/informacion", label: "Obtener información", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
        ) },
        { path: "/correo", label: "Correo asociación", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <path d="M22 6l-10 7L2 6" />
            </svg>
        ) },
        { path: "/home", label: "Inicio", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
                <path d="M21 22H3" />
            </svg>
        ) },
        { label: "Editar parámetros", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ) },
        { path: "/configuracion", label: "Ajustes de usuario", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a2 2 0 0 0 .5 2.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.1-.5 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.5a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .5-2.1 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.5-2.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.1.5 2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.5 2.1 2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.5a2 2 0 0 0-1.8 1.2z" />
            </svg>

        ) }
    ];

    const id = localStorage.getItem("id");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8801/getmedicamentos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setLista(data.data);
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

        const getListaToma = async () => {
            try {
                const response = await fetch("http://localhost:8801/getlistatoma", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id_paciente: id
                  }),
                });
            
                const data2 = await response.json();
            
                if (response.ok) {
                  setlistaTomas(data2.data)
                } else {
                  setError("Error de conexión ");
                }
              } catch (error) {
                  setError("Error de conexión con el servidor");
            }
          
       };
    
        fetchData();
        getListaToma();

    }, []);
    

    useEffect(() => {
        if (Array.isArray(lista)) {
            const resultados = lista.filter((medicamento) =>
                medicamento.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
            setResultadosFiltrados(resultados);
        }
    }, [lista, busqueda]); 


    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); 
    };

    const handleOptionClick = (path) => {
        navigate(path); 
    };

    

    return (
        <div style={{marginBottom: "10%"}}>
            <header>Menu principal</header>

            <div className="container" style={{width: "20%", height: "auto" }}>
                <div className="image-container">
                    <img src={robot} alt="Robot" className="robot" style={{ width: "80%", height: "auto" }} />
                    <div className="speech-bubble" ></div>
                </div>
            </div>


        <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>

        

    <div style={{ left:"25%", padding: "10px", width: "50%", marginTop: "20px", backgroundColor: "white", position: "relative", zIndex: "100" }}>
        <h3 style={{marginTop:"20px"}}>Crear toma</h3>
        <form onSubmit={handleSubmit}>
            <label>Nombre medicamento:</label>
            {/* Buscador de medicamentos */}
            <input
                type="text"
                placeholder="Buscar medicamentos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onClick={handleSearchClick}
                style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    width: "75%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px",
                }}
            />
            

            {/* Resultados del buscador */}
            {showMedicamentos && (
                <div
                    style={{
                        width: "95%",
                        backgroundColor: "white",
                        padding: "10px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginTop: "5px",
                    }}
                >
                    {resultadosFiltrados.length > 0 ? (
                        <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                            {resultadosFiltrados.map((medicamento, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleMedicamentoSelect(medicamento)}
                                    style={{
                                        cursor: "pointer",
                                        color: medicamentoNombre === medicamento.nombre ? "green" : "black",
                                        padding: "5px 0",
                                    }}
                                >
                                    {medicamento.nombre}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ paddingLeft: "20px" }}>No se encontraron medicamentos</p>
                    )}
                </div>
            )}

            {/* Campos adicionales */}
            <div style={{ marginTop: "20px", paddingLeft: "10px" }}>
                <label>
                    Número de tomas:
                    <input
                        type="number"
                        value={tomas}
                        onChange={(e) => setTomas(Number(e.target.value))}
                        min="1"
                        style={{
                            padding: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            width: "50%",
                            marginLeft: "10px",
                        }}
                    />
                </label>
            </div>

            <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
                <label>Horas de las tomas:</label>
                {Array.from({ length: tomas }).map((_, index) => (
                    <div key={index}>
                        <input
                            type="time"
                            value={horas[index] || ""}
                            onChange={(e) => {
                                const updatedHoras = [...horas];
                                updatedHoras[index] = e.target.value;
                                setHoras(updatedHoras);
                            }}
                            style={{
                                padding: "5px",
                                marginBottom: "10px",
                                marginTop: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                width: "50%",
                            }}
                        />
                    </div>
                ))}
            </div>
        <button type="submit" style={{ marginTop: "20px" }}>
            Guardar
        </button>
        </form>

        {/* Lista de tomas creadas */}
    <div style={{ marginTop: "30px" }}>
        <h3>Lista de Medicación</h3>
            {listaTomas.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {Object.values(
                        listaTomas.reduce((acc, toma) => {
                            const { id, medicamento, hora } = toma;

                            if (!acc[id]) {
                                acc[id] = {
                                    id,
                                    medicamento,
                                    horas: [],
                                };
                            }
                            acc[id].horas.push(hora);
                            return acc;
                        }, {})
                    ).map((tomaAgrupada, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setTomaSeleccionada(index);
                                setIdToma(tomaAgrupada.id);
                            }}
                            style={{
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                backgroundColor: tomaSeleccionada === index ? "#e6ffe6" : "#f9f9f9",
                                cursor: "pointer",
                            }}
                        >
                            <strong>Medicamento:</strong> {tomaAgrupada.medicamento} <br />
                            <strong>Horas:</strong> {tomaAgrupada.horas.join(", ")}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay medicación asociada al paciente.</p>
            )}


            <button
                onClick={handleEliminarToma}
                disabled={tomaSeleccionada === null}
                style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    backgroundColor: tomaSeleccionada !== null ? "#2fa831" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: tomaSeleccionada !== null ? "pointer" : "not-allowed",
                }}
            >
                Eliminar toma
            </button>
        </div>
    </div>


</div>

                 <div className="footer">
                {buttons.map((btn, index) => (
                    <div key={index} className="button-container">

                        {btn.label === "Editar parámetros" && showEditOptions && (
                            <div
                                className="edit-options"
                                style={{
                                    position: "absolute",
                                    width: "200px",
                                    bottom: "60px", // Ajusta la distancia desde el botón hacia arriba
                                    left: "70%", // Centra el contenedor respecto al botón
                                    transform: "translateX(-50%)", // Ajusta para que quede centrado
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Añade sombra para mejor visibilidad
                                    zIndex: 10, // Asegúrate de que esté encima de otros elementos
                                }}
                            >
                                <button 
                                path="/frecuencia"
                                onClick={() => handleOptionClick("/frecuencia")} style={{ display: "block", marginBottom: "5px" }}>
                                    
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
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

                                <button onClick={() => handleOptionClick("/peso")} style={{ display: "block", marginBottom: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 10v2"/>
                                    </svg>
                                    &nbsp; &nbsp; Peso
                                </button>
                                <button onClick={() => handleOptionClick("/arritmia")} style={{ display: "block", marginBottom: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                                    </svg>
                                    &nbsp; &nbsp; Arritmia
                                </button>
                                <button onClick={() => handleOptionClick("/tension")} style={{ display: "block" }}>
                                <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
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
                                <button onClick={() => handleOptionClick("/medicacion")} style={{ display: "block", marginBottom: "5px", color: "#2fa831" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
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
                                <button onClick={() => handleOptionClick("/tomas")} style={{ display: "block", marginBottom: "5px" }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
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
                            }}
                            disabled={btn.path === "/medicacion"}
                        >
                            {btn.icon}
                        </button>
                        
                       
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Medicacion;