import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Scatter   } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";



const CuerpoMedico = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [nombreSeleccionado, setNombreSeleccionado] = useState(null);
    const [lista, setLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
    const [vista, setVista] = useState(localStorage.getItem('vista') || 'pacientes');
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState([]);
    const [graficaMostrada, setGraficaMostrada] = useState(null);
    const [id, setId] = useState([]);
    const [frecuencia, setFrecuencia] = useState([]);
    const [medicacion, setMedicacion] = useState([]);
    const [arritmia, setArritmia] = useState([]);
    const [tension, setTension] = useState([]);
    const [peso, setPeso] = useState([]);
    const [crearNuevo, setCrearNuevo] = useState(false);
    const centro = localStorage.getItem("centro");
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        password: "",
        apellido1: "",
        apellido2: "",
        fecha_nacimiento: "",
        habitos_toxicos: "",
        genero: 1,
        centro: centro,
        correo: "",
        cuerpo_medico: 0,
        altura: "",
        observaciones: ""
    });

    const icons = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="6" r="4" />
          <line x1="10" y1="6" x2="12" y2="4" />
          <path d="M10 10c0 4 0 6-6 6" />
          <rect x="2" y="14" width="8" height="4"  rx="1"/>
          <circle cx="16" cy="16" r="2" />
          <path d="M14 16c-3 0-3-2-3-4" />
        </svg>`,
    
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)" />
          <line x1="10" y1="10" x2="14" y2="15" />
          <rect x="8" y="12" width="7" height="8" rx="2" transform="rotate(45 12 12)" fill="currentColor"/>
        </svg>`,
    
        `<svg
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
                                        
        </svg>`,
    
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
        </svg>`,
    
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="12" cy="10" r="3"/>
            <path d="M12 10v2"/>
        </svg>`,
    ];
      
    const handleClick = async (index) => {
        if (index === 0) {
          try {
            await obtenerTension(id); // ← le pasas el id
            setGraficaMostrada("tension"); // ← mostramos esta gráfica
            setSuccess("Datos de tensión obtenidos");
            setError("");
          } catch (err) {
            console.error("Error al obtener tensión:", err);
            setError("No se pudieron obtener los datos");
            setSuccess("");
          }
        }

        if (index === 1) {
            try {
              await obtenerMedicacion(id); 
              setGraficaMostrada("medicacion"); 
              setSuccess("Datos de tensión obtenidos");
              setError("");
            } catch (err) {
              console.error("Error al obtener medicacion:", err);
              setError("No se pudieron obtener los datos");
              setSuccess("");
            }
          }
      
        if (index === 2) {
          try {
            await obtenerFrecuencia(id); // ← le pasas el id
            setGraficaMostrada("frecuencia"); // ← mostramos esta gráfica
            setSuccess("Datos de frecuencia obtenidos");
            setError("");
          } catch (err) {
            console.error("Error al obtener frecuencia:", err);
            setError("No se pudieron obtener los datos");
            setSuccess("");
          }
        }
        if (index === 3) {
            try {
              await obtenerArritmia(id); 
              setGraficaMostrada("arritmia"); 
              setSuccess("Datos de arritmia obtenidos");
              setError("");
            } catch (err) {
              console.error("Error al obtener arritmias:", err);
              setError("No se pudieron obtener los datos");
              setSuccess("");
            }
        }
        if (index === 4) {
            try {
              await obtenerPeso(id); 
              setGraficaMostrada("peso"); 
              setSuccess("Datos de peso obtenidos");
              setError("");
            } catch (err) {
              console.error("Error al obtener el peso:", err);
              setError("No se pudieron obtener los datos");
              setSuccess("");
            }
        }
      };
      

    const obtenerTension = async (id) => {

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

                setTension(updatedData); // Actualiza el estado con los datos modificados
                setSuccess("Datos obtenidos"); // Muestra mensaje de éxito
                setError(""); // Borra errores previos
            } else {
                setError(data.error || "Error al obtener datos"); // Muestra el error del backend
                setSuccess(""); // Borra mensaje de éxito
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };

    const obtenerMedicacion = async (id) => {

        try {
            const response = await fetch("http://localhost:8801/gettomas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_paciente: id }),
            });

            const data = await response.json();

            console.log("datos", data)

            if (response.ok) {
                setMedicacion(data.data); // Aquí se actualizan los datos
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

    const obtenerArritmia= async (id) => {

        try {
            const response = await fetch("http://localhost:8801/getarritmia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                setArritmia(data.data); // Aquí se actualizan los datos
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
      

    const obtenerFrecuencia = async (id) => {
        try {
          const response = await fetch("http://localhost:8801/getfrecuencia", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
      
          const data = await response.json();
          console.log("Datos recibidos:", data);
      
          if (response.ok) {
            setFrecuencia(data.data);
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

    const obtenerPeso = async (id) => {
        try {
            const response = await fetch("http://localhost:8801/getpeso", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                setPeso(data.data); // Aquí se actualizan los datos
                setSuccess("Datos obtenidos"); // Muestra mensaje de éxito
                setError(""); // Borra errores previos
            } else {
                setError(data.error || "Error al obtener datos"); // Muestra el error del backend
                setSuccess(""); // Borra mensaje de éxito
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };
      
    const buttons = [
        { label: "Información usuarios", key: "pacientes" },
    ];



    useEffect(() => {
        const getNombres = async () => {
            try {
                const response = await fetch("http://localhost:8801/getusuariocentro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },body: JSON.stringify({
                        centro: centro
                    })
                });

                const data2 = await response.json();

                console.log(data2)

                if (response.ok) {
                    setLista(data2.data);
                    setResultadosFiltrados(data2.data);
                    setSuccess("Datos obtenidos");
                    setError("");
                } else {
                    setError(data2.error || "Error al obtener datos");
                    setSuccess("");
                }
            } catch (error) {
                setError("Error de conexión con el servidor");
                setSuccess("");
            }
        };

            getNombres();
    }, [vista]);

    useEffect(() => {

        const cuerpo_medico = localStorage.getItem("cuerpo_medico");

        if (cuerpo_medico !== "1") {
            navigate("/404");
        }
    
        const resultados = Array.isArray(lista)
                ? lista.filter((paciente) =>
                      `${paciente.nombre} ${paciente.apellido1} ${paciente.apellido2}`
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                  )
                : [];

        setResultadosFiltrados(resultados);
    
    }, [busqueda, lista, vista]);

    const handleEnviarNombre = async () => {
        if (!nombreSeleccionado) {
            setError("Por favor, selecciona un paciente.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8801/getpaciente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombreSeleccionado.nombre,
                    apellido1: nombreSeleccionado.apellido1,
                    apellido2: nombreSeleccionado.apellido2,
                    fecha_nacimiento: formatDate(nombreSeleccionado.fecha_nacimiento),
                }),
            });

            const data1 = await response.json();
            setId(data1.id);
            console.log(data1)

            data1.data.paciente[0].nombre = nombreSeleccionado.nombre;
            data1.data.paciente[0].apellido1 = nombreSeleccionado.apellido1;
            data1.data.paciente[0].apellido2 = nombreSeleccionado.apellido2;

            if (response.ok) {
                setData(data1.data);
                setSuccess("Datos obtenidos con éxito");
                setError("");
            } else {
                setError(data1.error || "Error al obtener los datos del paciente");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };


    
    function formatDate(dateString) {
        const date = new Date(dateString); // Convierte la fecha a un objeto Date
        const year = date.getFullYear(); // Obtiene el año
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (sumando 1 porque getMonth devuelve 0-11)
        const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día del mes
    
        return `${year}-${month}-${day}`; // Devuelve la fecha en formato "YYYY-MM-DD"
    }

    const handleEditarUsuario = async () => {
        try {
            console.log("datos: ", id);
            const response = await fetch("http://localhost:8801/editarusuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id, 
                    updatedData: {
                        nombre: data.paciente[0].nombre,
                        apellido1: data.paciente[0].apellido1,
                        apellido2: data.paciente[0].apellido2,
                        fecha_nacimiento: new Date(data.paciente[0].fecha_nacimiento).toISOString().split("T")[0],
                        habitos_toxicos: data.paciente[0].habitos_toxicos,
                        genero: data.paciente[0].genero,
                        centro: data.usuario[0].centro,
                        correo: data.usuario[0].correo,
                        cuerpo_medico: data.usuario[0].cuerpo_medico,
                        altura: data.paciente[0].altura,
                        exploraciones: data.paciente[0].exploraciones || null,
                    }
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setSuccess("Usuario editado con éxito");
                setError("");
                window.location.reload();
            } else {
                setError(result.error || "Error al editar el usuario");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };

    const handleCrearUsuario = async () => {
        if (!nuevoUsuario) {
            setError("Por favor, introduce un nombre de usuario");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8801/setusuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    datos: nuevoUsuario,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccess("Usuario creado con éxito");
                setError("");
                setCrearNuevo(false);
                window.location.reload();
            } else {
                setError(result.error || "No se pudo crear el usuario");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };
    

    const handleEliminarUsuario = async () => {
        if (!id) {
            setError("Por favor, introduce el correo del usuario");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8801/eliminar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccess("Usuario eliminado con éxito");
                setError("");
                window.location.reload();
            } else {
                setError(data.error || "Error al eliminar el usuario");
                setSuccess("");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            setSuccess("");
        }
    };
    

    return (
        <div>
            <header>Cuerpo Médico</header>

            <div
                style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginBottom: "100px",
                    position: "relative",
                    zIndex: "100",
                }}
            >
                    <div>
                        {/* Buscador */}
                        <div
                            style={{
                                padding: "10px",
                                width: "98.4%",
                                marginTop: "20px",
                                backgroundColor: "white",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    width: "96%",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                }}
                            />


                            <button
                                onClick={() => setCrearNuevo(!crearNuevo)}
                                style={{
                                    padding: "12px 24px",
                                    marginLeft: "30%",
                                    backgroundColor: "#2fa831",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "background-color 0.3s ease, transform 0.2s ease",
                                    outline: "none",
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#2fa831"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#2fa831"}
                            >
                                {crearNuevo ? "Cancelar" : "Crear usuario"}
                            </button>

                            <button
                                onClick={handleEnviarNombre}
                                disabled={!nombreSeleccionado}
                                style={{
                                    padding: "12px 24px",
                                    marginLeft: "100px",
                                    backgroundColor: nombreSeleccionado ? "#2fa831" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: nombreSeleccionado ? "pointer" : "not-allowed",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "background-color 0.3s ease, transform 0.2s ease",
                                    outline: "none",
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = nombreSeleccionado ? "#218838" : "#ccc"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = nombreSeleccionado ? "#2fa831" : "#ccc"}
                            >
                                Obtener información
                            </button>
                                    

                            <div
                                style={{
                                    width: "95%",
                                    backgroundColor: "#f9f9f9",
                                    padding: "15px",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                {resultadosFiltrados.length > 0 ? (
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontWeight: "bold",
                                                paddingBottom: "10px",
                                                borderBottom: "2px solid #ddd",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>Nombre</div>
                                            <div style={{ flex: 2 }}>Apellidos</div>
                                            <div style={{ flex: 3 }}>Cuerpo Médico</div>
                                            <div style={{ flex: 1, textAlign: "right" }}>Fecha de Nacimiento</div>
                                        </div>
                                        <ul
                                            style={{
                                                listStyleType: "none",
                                                padding: 0,
                                                margin: 0,
                                            }}
                                        >
                                            {resultadosFiltrados
                                                .slice()
                                                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                                .map((paciente, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => setNombreSeleccionado(paciente)}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            margin: "10px 0",
                                                            padding: "10px",
                                                            cursor: "pointer",
                                                            color:
                                                              nombreSeleccionado &&
                                                                nombreSeleccionado.nombre === paciente.nombre &&
                                                                nombreSeleccionado.apellido1 === paciente.apellido1 && 
                                                                nombreSeleccionado.apellido2 === paciente.apellido2 && 
                                                                nombreSeleccionado.fecha_nacimiento === paciente.fecha_nacimiento

                                                                    ? "#28a745" // Verde
                                                                    : "#333", // Negro
                                                            backgroundColor:
                                                                nombreSeleccionado &&
                                                                nombreSeleccionado.nombre === paciente.nombre &&
                                                                nombreSeleccionado.apellido1 === paciente.apellido1 && 
                                                                nombreSeleccionado.apellido2 === paciente.apellido2 && 
                                                                nombreSeleccionado.fecha_nacimiento === paciente.fecha_nacimiento

                                                                    ? "#e8f5e9" // Fondo verde suave
                                                                    : "#fff", // Fondo blanco
                                                            borderRadius: "5px",
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    >
                                                        <div style={{ flex: 1, fontWeight: "bold" }}>
                                                            {paciente.nombre}
                                                        </div>
                                                        <div style={{ flex: 2 }}>
                                                            {paciente.apellido1} {paciente.apellido2}
                                                        </div>
                                                        <div style={{ flex: 3 }}>
                                                            {paciente.cuerpo_medico === 1 ? 'Sí' : 'No'}
                                                        </div>
                                                        <div style={{ flex: 1, textAlign: "right"}}>
                                                            {formatDate(paciente.fecha_nacimiento)}
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p style={{ color: "#888", fontStyle: "italic" }}>
                                        No se encontraron usuarios.
                                    </p>
                                )}
                            </div>
                        </div>

                        {crearNuevo && (
    <div style={{ marginTop: "20px", fontFamily: "'Arial', sans-serif" }}>
        <h3 style={{ textAlign: "center", color: "#333" }}>Nuevo usuario</h3>
        <table
            style={{
                width: "100%",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "20px"
            }}
        >
            <thead>
                <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Apellido 1</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Apellido 2</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Contraseña</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Fecha Nac.</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Género</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Correo</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Centro</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Cuerpo Médico</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Hábitos</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Altura</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Observaciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} /></td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.apellido1} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido1: e.target.value })} /></td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.apellido2} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido2: e.target.value })} /></td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} /></td>
                    <td><input type="date" style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.fecha_nacimiento} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, fecha_nacimiento: formatDate(e.target.value) })} /></td>
                    <td>
                        <select style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.genero} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, genero: parseInt(e.target.value) })}>
                            <option value={1}>Masculino</option>
                            <option value={2}>Femenino</option>
                            <option value={3}>Otro</option>
                        </select>
                    </td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} /></td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.centro}/></td>
                    <td>
                        <select style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.cuerpo_medico}>
                            <option value={0}>No</option>
                        </select>
                    </td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.habitos_toxicos} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, habitos_toxicos: e.target.value })} /></td>
                    <td><input style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.altura} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, altura: e.target.value })} /></td>
                    <td><textarea style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.observaciones} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, observaciones: e.target.value })} /></td>
                </tr>
            </tbody>
        </table>

        <div style={{ textAlign: "center" }}>
            <button
                onClick={handleCrearUsuario}
                style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
            >
                Guardar usuario
            </button>
        </div>
    </div>
)}



                        {/* Tabla de Pacientes */}
                        {data && (
                            <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                                <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "20px" }}>Datos del usuario</h3>
                                <table
                                    border="1"
                                    style={{
                                        backgroundColor: "white",
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        fontFamily: "'Arial', sans-serif",
                                    }}
                                >
                                    <thead>
                                        <tr
                                            style={{
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                textAlign: "center",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <th>Nombre</th>
                                            <th>Primer apellido</th>
                                            <th>Segundo apellido</th>
                                            <th>F. Nacimiento</th>
                                            <th>H. tóxicos</th>
                                            <th>Género</th>
                                            <th>Centro</th>
                                            <th>Correo</th>
                                            <th>Cuerpo Médico</th>
                                            <th>Altura</th>
                                            <th>Observaciones</th>
                                            <th>Parámetros médicos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            style={{
                                                textAlign: "center",
                                                borderBottom: "1px solid #ddd",
                                                transition: "background-color 0.3s ease",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f1f1"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                        >
                                        <td>
                                                <input
                                                    type="text"
                                                    value={data.paciente[0].nombre}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], nombre: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    value={data.paciente[0].apellido1}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], apellido1: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={data.paciente[0].apellido2}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], apellido2: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="date"
                                                    value={formatDate(data.paciente[0].fecha_nacimiento) }
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], fecha_nacimiento: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "80%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                                                />
                                            </td>


                                            <td>
                                                <input
                                                    type="text"
                                                    value={data.paciente[0].habitos_toxicos}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], habitos_toxicos: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>

                                            <td>
                                                <select
                                                    value={data.paciente[0].genero}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], genero: parseInt(e.target.value) }],
                                                        })
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        padding: "5px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                >
                                                    <option value="1">Masculino</option>
                                                    <option value="2">Femenino</option>
                                                    <option value="3">Otro</option>
                                                </select>
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    value={data.usuario[0].centro}
                                                    style={{ width: "60%" }}
                                                />
                                        </td>

                                            <td>
                                                <input
                                                    type="email"
                                                    value={data.usuario[0].correo}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            usuario: [{ ...data.usuario[0], correo: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>

                                            <td>
                                            <select
                                                value={data.usuario[0].cuerpo_medico}
                                                style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                                            >
                                                <option value="1">Sí</option>
                                                <option value="0">No</option>
                                            </select>
                                        </td>


                                            <td>
                                                <input
                                                    type="number"
                                                    value={data.paciente[0].altura}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], altura: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>

                                            <td>
                                                <textarea
                                                    value={data.paciente[0].exploraciones}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            paciente: [{ ...data.paciente[0], exploraciones: e.target.value }],
                                                        })
                                                    }
                                                    style={{ width: "60%" }}
                                                />
                                            </td>
                                            <td>
                                                <div className="grid grid-cols-1 gap-4 p-4 max-w-md mx-auto">
                                                    {icons.map((icon, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleClick(i)}
                                                        className="flex gap-2 items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-xl shadow-md transition"
                                                    >
                                                        <span
                                                        className="text-blue-700"
                                                        dangerouslySetInnerHTML={{ __html: icon }}
                                                        />
                                                        <span className="ml-auto text-sm font-medium">Botón {i + 1}</span>
                                                    </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {graficaMostrada === "frecuencia" && (
                                        <div className="graficas" style={{ marginBottom: "60px" }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={frecuencia}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                stroke="#FFFFFF"
                                                dataKey="fecha"
                                                tick={{ fontSize: 16, fontWeight: "bold" }}
                                            />
                                            <YAxis
                                                domain={["auto", "auto"]}
                                                tick={{ fontSize: 16, fontWeight: "bold" }}
                                                stroke="#FFFFFF"
                                            />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="frecuencia"
                                                stroke="#4A90E2"
                                                strokeWidth={4}
                                                dot={{ r: 6 }}
                                                name="Frecuencia"
                                            />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {graficaMostrada === "medicacion" && (
                                <div
                                    className="calendar-container"
                                    style={{ marginBottom: "100px", position: "relative", zIndex: "100" }}
                                >
                                    <Calendar
                                    tileClassName={({ date }) =>
                                        medicacion.some((m) => new Date(m.fecha).toDateString() === date.toDateString())
                                        ? "marked-date"
                                        : null
                                    }
                                    tileContent={({ date }) =>
                                        medicacion.some((m) => new Date(m.fecha).toDateString() === date.toDateString()) ? (
                                        <div
                                            className="calendar-note"
                                            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                        >
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            >
                                            <rect
                                                x="3"
                                                y="8"
                                                width="18"
                                                height="8"
                                                rx="4"
                                                transform="rotate(-45 12 12)"
                                            />
                                            <line x1="10" y1="10" x2="14" y2="15" />
                                            <rect
                                                x="8"
                                                y="12"
                                                width="7"
                                                height="8"
                                                rx="2"
                                                transform="rotate(45 12 12)"
                                                fill="currentColor"
                                            />
                                            </svg>
                                        </div>
                                        ) : null
                                    }
                                    selectRange={false}
                                    />
                                </div>
                                )}


                                {graficaMostrada === "tension" && (
                                    <div className="graficas" style={{ marginBottom: "100px" }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <ComposedChart data={tension}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis stroke="#FFFFFF" dataKey="fecha" tick={{ fontSize: 16, fontWeight: 'bold' }} />
                                                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 16, fontWeight: 'bold' }} stroke="#FFFFFF" />
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
                                )}

                            {graficaMostrada === "arritmia" && (
                                
                                <div
                                    className="calendar-container"
                                    style={{ marginBottom: "100px", position: "relative", zIndex: "100" }}
                                >
                                    <Calendar
                                    tileClassName={({ date }) =>
                                        arritmia.some((a) => new Date(a.fecha).toDateString() === date.toDateString())
                                        ? "marked-date"
                                        : null
                                    }
                                    tileContent={({ date }) =>
                                        arritmia.some((a) => new Date(a.fecha).toDateString() === date.toDateString()) ? (
                                        <div
                                            className="calendar-note"
                                            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                        >
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            >
                                            <rect
                                                x="3"
                                                y="8"
                                                width="18"
                                                height="8"
                                                rx="4"
                                                transform="rotate(-45 12 12)"
                                            />
                                            <line x1="10" y1="10" x2="14" y2="15" />
                                            <rect
                                                x="8"
                                                y="12"
                                                width="7"
                                                height="8"
                                                rx="2"
                                                transform="rotate(45 12 12)"
                                                fill="currentColor"
                                            />
                                            </svg>
                                        </div>
                                        ) : null
                                    }
                                    selectRange={false}
                                    />
                                </div>
                                )}

                                {graficaMostrada === "peso" && (
                                    <div className="graficas" style={{ marginBottom: "60px" }}> 
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={peso}> 
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis 
                                                    stroke="#FFFFFF"
                                                    dataKey="fecha" 
                                                    tick={{ fontSize: 16, fontWeight: 'bold' }} 
                                                />
                                                <YAxis 
                                                    domain={["auto", "auto"]} 
                                                    tick={{ fontSize: 16, fontWeight: 'bold' }}  
                                                    stroke="#FFFFFF"
                                                />
                                                <Tooltip />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="peso" 
                                                    stroke="#4A90E2" 
                                                    strokeWidth={4}  
                                                    dot={{ r: 6 }} 
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleEditarUsuario}
                                    style={{
                                        backgroundColor: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "12px 18px",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        transition: "background-color 0.3s ease, transform 0.2s ease",
                                        marginTop: "20px", // Ajustado para un mejor espaciado
                                        marginLeft: "40%",
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                >
                                    Guardar
                                </button>

                                {nombreSeleccionado && (
                                    <button
                                        onClick={handleEliminarUsuario}
                                        style={{
                                            marginLeft: "15px",
                                            padding: "12px 20px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            transition: "background-color 0.3s ease, transform 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
                                    >
                                        Eliminar usuario
                                    </button>
                                )}

                               

                            </div>
                        )}

                    </div>
                
            </div>
        </div>
    );
};

export default CuerpoMedico;
