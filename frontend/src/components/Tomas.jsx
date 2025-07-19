import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png"; 
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import cara from "../assets/cara.png"; 

const Tomas = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showEditOptions, setShowEditOptions] = useState(false);
    const [selectedMeds, setSelectedMeds] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const markedDates = data.map((item) => new Date(item.fecha));
    const [listaTomas, setlistaTomas] = useState([]);

    
    const mensaje = (
        <>
          Este es tu diario para registrar tu toma de medicacion.
          <br />
          <br />
          Acuerdate que si pulsas las notificaciones que te salen por pantalla sobre los recordatorios de las tomas, se te guardará automaticamente la toma de hoy en el calendario.
          <br />
          <br />
          ¡Recuerda que el consumo de los medicamentos es primordial para tu salud!
        </>
    ); 

    const renderTileContent = useCallback(({ date }) => {
    const isMarked = markedDates.some(d => d.toDateString() === date.toDateString());
    if (!isMarked) return null;

    return (
      <div className="calendar-note" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
          <rect x="8" y="12" width="7" height="8" rx="2" transform="rotate(45 12 12)" fill="currentColor" />
        </svg>
      </div>
    );
  }, [markedDates]);
    
    const handleDateClick = (date) => {
        const meds = data.filter(
          (item) => new Date(item.fecha).toDateString() === date.toDateString()
        );
      
        setSelectedDate(date);
        setSelectedMeds(meds); // puede estar vacío
        setShowModal(true);     // siempre mostramos el modal
        getListaToma();         // carga los posibles medicamentos diarios
    };
      
    
    const closeModal = () => {
        setShowModal(false);
        setSelectedDate(null);
        setSelectedMeds([]);
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

    

    const eliminarToma = async (id_paciente, medicamento, fecha, hora) => {
      console.log("datos", id_paciente, medicamento, fecha, hora)
        try {
          const response = await fetch("http://localhost:8801/eliminartoma", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_paciente,
              medicamento,
              fecha,
              hora
            }),
          });
      
          if (response.ok) {
            window.location.reload();
          } else {
            console.log("Error de conexión")
          }
        } catch (error) {
            console.log("Error de conexión con el servidor", error)
        }
    };

    const setToma = async (id_paciente, medicamento, fecha, hora) => {
        console.log("HOra", hora);
        try {
          // PRIMER FETCH → obtener id_toma
          const response1 = await fetch("http://localhost:8801/settomaapaciente", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_paciente,
              medicamento,
              hora
            }),
          });
      
          const data1 = await response1.json();
      
          if (!response1.ok) {
            console.log("Error al obtener id_toma");
            return;
          }

          // Convierte la fecha al formato YYYY-MM-DD
          const formattedFecha = formatFecha(fecha);
      
    
          const response2 = await fetch("http://localhost:8801/toma", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_toma:  data1.data[0].id_toma, 
                fecha: formattedFecha,
                hora: hora
            }),
          });

      
          if (response2.ok) {
            window.location.reload(); // actualizar vista
          } else {
            console.log("Error al guardar toma");
          }
      
        } catch (error) {
          console.log("Error de conexión con el servidor", error);
        }
      };
      
      const formatFecha = (fecha) => {
        const [day, month, year] = fecha.split('/');  // Split en base al '/'
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;  // Devuelve en formato YYYY-MM-DD
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
          console.log ("Hola:", data2)
      
          if (response.ok) {
            setlistaTomas(data2.data)
          } else {
            console.log("Error de conexión ");
          }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
        }
    };

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch("http://localhost:8801/gettomas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id_paciente: id }),
                    });
    
                    const data = await response.json();
                    console.log("Datos recibidos44:", data);
    
                    if (response.ok) {
                        setData(data.data); // Aquí se actualizan los datos
                        console.log("Datos obtenidos");
                    } else {
                        console.log(data.error || "Error al obtener datos"); 
                    }
                } catch (error) {
                    console.log("Error de conexión con el servidor", error); 
                }
            };
    
            fetchData();
        }, []);
    

    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); 
    };

    const handleOptionClick = (path) => {
        navigate(path); 
    };

  return (
  <div>
      <header>Calendario de Tomas</header>

      <div className="cuerpo">
        <div className="container">
            <div className="robothablando-container" style={{ marginBottom: "600px" }}>
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
                >{mensaje}</div>
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
                            disabled={btn.path === "/tomas"}
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
                                <button onClick={() => handleOptionClick("/tomas")} style={{ display: "block", marginBottom: "5px", marginLeft: "15px", fontSize: "13px", color: "#2fa831" }}>
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
              <div className="calendar-container">
                <Calendar
                onClickDay={handleDateClick}
                tileClassName={({ date }) =>
                  markedDates.some((d) => d.toDateString() === date.toDateString())
                    ? "marked-date"
                    : null
                }
                tileContent={renderTileContent}
                  selectRange={false}
            />
            </div>            
                    {showModal && (
                <div className="confirmation-modal">
                  <div
                    className="modal-content"
                    style={{
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
                    <img
                      src={cara}
                      alt="Robot"
                      className="robot"
                      style={{ width: "10%", height: "auto" }}
                    />
                    <p>
                      Medicación tomada el <strong>{selectedDate.toLocaleDateString()}</strong>:
                    </p>

                    {/* Contenedor en dos columnas */}
                    <div style={{ display: "flex", gap: "40px"}}>
                      {/* Columna izquierda - Tomados */}
                      <div style={{ flex: 1 }}>
                        <h4>Tomas realizadas hoy:</h4>
                        <ul style={{ listStyleType: "none" }}>
                          {selectedMeds.map((med) => (
                            <li
                              key={`${med.medicamento}-${med.hora}`}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "5px",
                              }}
                            >
                              <span>{med.medicamento} | {med.hora}</span>
                              <button
                                onClick={() =>
                                  eliminarToma(id, med.medicamento, formatFecha(selectedDate.toLocaleDateString()), med.hora)
                                }
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  padding: "5px 10px",
                                }}
                              >
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Columna derecha - Para añadir */}
                      <div style={{ flex: 1 }}>
                        <h4>Lista de tomas diarias</h4>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {listaTomas.map((lt) => (
                            <li
                              key={`${lt.medicamento}-${lt.hora}`}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "8px",
                              }}
                            >
                              <span>{lt.medicamento} | {lt.hora}</span>
                              <button
                                onClick={() =>
                                  setToma(id, lt.medicamento, selectedDate.toLocaleDateString(), lt.hora)
                                }
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  padding: "5px 10px",
                                }}
                              >
                                Añadir
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button onClick={closeModal} style={{ marginTop: "20px" }}>
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

            </div>
        </div>
    );
};

export default Tomas;