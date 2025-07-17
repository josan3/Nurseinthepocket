import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png";
import "react-calendar/dist/Calendar.css";

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
    const [showMedicamentos, setShowMedicamentos] = useState(false);
    const [tomaSeleccionada, setTomaSeleccionada] = useState(null); 
    const [idToma, setIdToma] = useState(null);

    const mensaje = (
        <>
          ¿Quieres añadir una nueva alarma para tus medicamentos?
          <br />
          <br />
          <br />
          ¡Se te enviará un recordatorio a la hora que indiques!
          <br />
          <br />
          <br />
          Es importante tomar la medicación diaria, por eso te ayudaré a recordar y registrar las tomas.
        </>
    ); 

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
                console.log("Medicacion registrada");
                window.location.reload();
            } else {
                console.log(data.error || "Error al registrar la medicacion");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
        }
    };

    const handleEliminarToma = async (e) => {
        e.preventDefault();

        console.log("ID de la toma a eliminar:", idToma); // Verifica el ID de la toma

        try {
            const response = await fetch("http://localhost:8801/deletetoma", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({idToma}),
            });
        
            const data = await response.json();
        
            if (response.ok) {
                console.log("Medicacion eliminada"); 
                window.location.reload();
            } else {
                console.log(data.error || "Error al registrar la medicacion"); 
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error); 
        }
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

        const getMedicamentos = async () => {
            try {
                const response = await fetch("http://localhost:8801/getmedicamentos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setLista(data.data);
                    setResultadosFiltrados(data.data);
                } else {
                    console.log(data.error || "Error al obtener datos");
                }
            } catch (error) {
                console.log("Error de conexión con el servidor", error);
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
                  console.log("Error de conexión ");
                }
              } catch (error) {
                  console.log("Error de conexión con el servidor", error);
            }
          
       };
    
        getMedicamentos();
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
        
        <div>
            <header>Medicación</header>

            <div className="cuerpo">
                <div className="container">
                    <div className="robothablando-container" style={{ marginBottom: "1000px" }}>
                        <img src={robot} alt="Robot" className="robotquieto" />
                        <div 
                        className="speech-bubble" 
                        style={{ 
                            marginTop: "-300px",
                            height: "auto", 
                            padding: "15px",  
                            boxSizing: "border-box",
                            minWidth: "170px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        >{mensaje}
                        </div>
                    </div>
                </div>

            <div className="barra" ></div>
            <div className="barra2"></div>
            <div className="barra3"></div>
            <div className="footer">
                
                {buttons.map((btn) => (
                    <div key={btn.label} className="button-container">
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
                            disabled={btn.path === "/frecuencia"}
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
                                <button onClick={() => handleOptionClick("/medicacion")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px", color: "#2fa831" }}>
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


    <div style={{
    marginTop: "20%",
    right: "5%",
    left: "20%",
    width: "78%",
    height: "650px",
    backgroundColor: "white",
    borderRadius: "20px",
    zIndex: 100,
    position: "relative"
}}>
    <h3 style={{marginBottom: "10px", width: "70%", left: "15%", top: "5%" }}>Crear Toma</h3>


    <form style={{ top: "-10%" }}onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre del medicamento:</label>
            <input
                id="nombre"
                type="text"
                placeholder="Buscar medicamentos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onClick={handleSearchClick}
                style={{
                    width: "100%",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    marginBottom: "8px"
                }}
            />

        {showMedicamentos && (
            <div style={{
                width: "100%",
                backgroundColor: "#f9f9f9",
                padding: "6px",
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "8px"
            }}>
                {resultadosFiltrados.length > 0 ? (
                    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                        {resultadosFiltrados.map((medicamento) => (
                           <li key={medicamento.id} style={{ listStyle: "none" }}>
                                <button
                                    onClick={() => handleMedicamentoSelect(medicamento)}
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleMedicamentoSelect(medicamento);
                                    }
                                    }}
                                    style={{
                                    padding: "4px",
                                    cursor: "pointer",
                                    backgroundColor: "black",
                                    borderRadius: "3px",
                                    border: "none",
                                    width: "100%",
                                    textAlign: "left",
                                    font: "inherit",
                                    }}
                                    type="button"
                                >
                                    {medicamento.nombre}
                                </button>
                                </li>

                        ))}
                    </ul>
                ) : (
                    <p style={{ margin: 0 }}>No se encontraron medicamentos.</p>
                )}
            </div>
        )}

        <label htmlFor="numero">Número de tomas:</label>
            <input
                id= "numero"
                type="number"
                value={tomas}
                onChange={(e) => setTomas(Number(e.target.value))}
                min="1"
                style={{
                    padding: "6px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    marginBottom: "10px"
                }}
            />

        <label>Horas de las tomas:
            {Array.from({ length: tomas }).map((_, index) => (
                <input
                    key={horas[index]}
                    type="time"
                    value={horas[index] || ""}
                    onChange={(e) => {
                        const updatedHoras = [...horas];
                        updatedHoras[index] = e.target.value;
                        setHoras(updatedHoras);
                    }}
                    style={{
                        padding: "6px",
                        marginBottom: "6px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        width: "60%",
                        display: "block"
                    }}
                />
            ))}

            <br />

            <button type="submit" style={{
                marginTop: "3px",
                padding: "8px 14px",
                backgroundColor: "#2fa831",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer"
            }}>
                Guardar
            </button>
        </label>
    </form>

    <div style={{ marginTop: "-180px" }}>
        <h4 style={{ marginBottom: "8px" }}>Lista de Medicación</h4>
        {listaTomas.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, left: "20%" }}>
                {Object.values(
                    listaTomas.reduce((acc, toma) => {
                        const { id, medicamento, hora } = toma;
                        if (!acc[id]) {
                        acc[id] = { id, medicamento, horas: [] };
                        }
                        acc[id].horas.push(hora);
                        return acc;
                    }, {})
                    ).map((tomaAgrupada) => (
                    <li key={tomaAgrupada.id} style={{ listStyle: "none", marginBottom: "6px" }}>
                        <button
                        onClick={() => {
                            setTomaSeleccionada(tomaAgrupada.id);
                            setIdToma(tomaAgrupada.id);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setTomaSeleccionada(tomaAgrupada.id);
                            setIdToma(tomaAgrupada.id);
                            }
                        }}
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: tomaSeleccionada === tomaAgrupada.id ? "#e6ffe6" : "#f5f5f5",
                            cursor: "pointer",
                            fontSize: "13px",
                            width: "100%",
                            textAlign: "left",
                            fontFamily: "inherit",
                            fontWeight: "normal",
                            outline: "none",
                        }}
                        type="button"
                        >
                        <strong>Medicamento:</strong> {tomaAgrupada.medicamento} <br />
                        <strong>Horas:</strong> {tomaAgrupada.horas.join(", ")}
                        </button>
                    </li>
                    ))}
            </ul>
        ) : (
            <p style={{ fontSize: "13px", marginLeft: "10%" }}>No hay medicación asociada al paciente.</p>
        )}

        <button
            onClick={handleEliminarToma}
            disabled={tomaSeleccionada === null}
            style={{
                marginLeft: "10%",
                padding: "8px 14px",
                marginTop: "8px",
                backgroundColor: tomaSeleccionada !== null ? "#dc3545" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: tomaSeleccionada !== null ? "pointer" : "not-allowed"
            }}
        >
            Eliminar toma
        </button>
    </div>

    </div>




            </div>
        </div>
    );
};

export default Medicacion;