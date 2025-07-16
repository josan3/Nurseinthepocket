import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Scatter   } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import cara from "../assets/cara.png"; 

const CuerpoMedico = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [nombreSeleccionado, setNombreSeleccionado] = useState(null);
    const [lista, setLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
    const [vista] = useState(localStorage.getItem('vista') || 'pacientes');
    const [paciente, setPaciente] = useState([]);
    const [graficaMostrada, setGraficaMostrada] = useState(null);
    const [id, setId] = useState([]);
    const [frecuencia, setFrecuencia] = useState([]);
    const [medicacion, setMedicacion] = useState([]);
    const [arritmia, setArritmia] = useState([]);
    const [tension, setTension] = useState([]);
    const [peso, setPeso] = useState([]);
    const [antiguoCorreo, setAntiguoCorreo] = useState("");
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

    const cancelar = () => {
        window.location.reload();
    }

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

    function sumarUnDia(fechaString) {
        const fecha = new Date(fechaString);
        fecha.setDate(fecha.getDate() + 1);
        return fecha.toISOString().split("T")[0]; // Devuelve en formato YYYY-MM-DD
    }

      
    const handleClick = async (index, nombre) => {
        setPaciente(nombre)
        if (index === 0) {
          try {
            await obtenerTension(id); // ← le pasas el id
            setGraficaMostrada("tension"); // ← mostramos esta gráfica
            console.log("Datos de tensión obtenidos");
          } catch (err) {
            console.error("Error al obtener tensión:", err);
          }
        }

        if (index === 1) {
            try {
              await obtenerMedicacion(id); 
              setGraficaMostrada("medicacion"); 
              console.log("Datos de tensión obtenidos");
            } catch (err) {
              console.error("Error al obtener medicacion:", err);
            }
          }
      
        if (index === 2) {
          try {
            await obtenerFrecuencia(id); // ← le pasas el id
            setGraficaMostrada("frecuencia"); // ← mostramos esta gráfica
            console.log("Datos de frecuencia obtenidos");
          } catch (err) {
            console.error("Error al obtener frecuencia:", err);
          }
        }
        if (index === 3) {
            try {
              await obtenerArritmia(id); 
              setGraficaMostrada("arritmia"); 
              console.log("Datos de arritmia obtenidos");
            } catch (err) {
              console.error("Error al obtener arritmias:", err);
            }
        }
        if (index === 4) {
            try {
              await obtenerPeso(id); 
              setGraficaMostrada("peso"); 
              console.log("Datos de peso obtenidos");
            } catch (err) {
              console.error("Error al obtener el peso:", err);
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
                console.log("Datos obtenidos"); 
            } else {
                console.log(data.error || "Error al obtener datos"); 
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
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
                console.log("Datos obtenidos");
            } else {
                console.log(data.error || "Error al obtener datos");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
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
                console.log("Datos obtenidos");
            } else {
                console.log(data.error || "Error al obtener datos");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
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
      
          if (response.ok) {
            setFrecuencia(data.data);
            console.log("Datos obtenidos");
          } else {
            console.log(data.error || "Error al obtener datos");
          }
        } catch (error) {
          console.log("Error de conexión con el servidor", error);
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
                console.log("Datos obtenidos"); 
            } else {
                console.log(data.error || "Error al obtener datos");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
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

                if (response.ok) {
                    
                    const usuariosFiltrados = data2.data.filter(
                    (usuario) => usuario.nombre !== "Nurse" && usuario.apellido1 !== "inthe" && usuario.apellido2 !== "Pocket"
                );

                setLista(usuariosFiltrados);
                setResultadosFiltrados(usuariosFiltrados);
                    console.log("Datos obtenidos");
                } else {
                    console.log(data2.error || "Error al obtener datos");
                }
            } catch (error) {
                console.log("Error de conexión con el servidor", error);
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
            console.log("Por favor, selecciona un paciente.");
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
            setAntiguoCorreo(data1.data.usuario[0].correo);

            data1.data.paciente[0].nombre = nombreSeleccionado.nombre;
            data1.data.paciente[0].apellido1 = nombreSeleccionado.apellido1;
            data1.data.paciente[0].apellido2 = nombreSeleccionado.apellido2;

            if (response.ok) {
                setData(data1.data);
                console.log("Datos obtenidos con éxito");
            } else {
                console.log(data1.error || "Error al obtener los datos del paciente");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
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
            const response = await fetch("http://localhost:8801/editarusuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id, 
                    antiguocorreo: antiguoCorreo,
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
                console.log("Usuario editado con éxito");
                window.location.reload();
            } else {
                console.log(result.error || "Error al editar el usuario");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
        }
    };

    const handleCrearUsuario = async () => {
        if (!nuevoUsuario) {
            console.log("Por favor, introduce un nombre de usuario");
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
    
    
            if (response.ok) {
                console.log("Usuario creado con éxito");
                setCrearNuevo(false);
                window.location.reload();
            } else {
                console.log(result.error || "No se pudo crear el usuario");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
        }
    };
    

    const handleEliminarUsuario = async () => {
        if (!id) {
            console.log("Por favor, introduce el correo del usuario");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8801/eliminar", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Usuario eliminado con éxito");
                window.location.reload();
            } else {
                console.log(data.error || "Error al eliminar el usuario");
            }
        } catch (error) {
            console.log("Error de conexión con el servidor", error);
        }
    };
    

    return (
        <div>
            <header>Cuerpo Médico</header>

            <div className="cuerpo">

            <div className="barra" style={{top: "400px"}} ></div>
            <div className="barra2" style={{top: "400px"}}></div>
            <div className="barra3" style={{top: "426px"}}></div>
            <div className="footer">
                {buttons.map((btn) => (
                    <button
                        key={btn.key} 
                        className="button-container"
                        onClick={() => handleOptionClick(btn.key)}
                        style={{

                                display: "inline-block",
                                padding: "20px",
                                position: "relative",
                                transition: "transform 0.5s"
 
                            }}
                    >
                         <div style={{ display: "flex", alignItems: "center"}}>
                                {btn.icon}
                                <span className="button-label" style={
                                    btn.label === "" 
                                    ? { color: "#2fa831", fontWeight: "bold" }
                                    : {}
                                }>{btn.label}</span>
                            </div>
                    </button>
                ))}
            </div>

            {crearNuevo && (
                             <div className="confirmation-modal">
                                    <div className="modal-content" style={{width: "90%", zIndex: "100000"}}>
                                    <img src={cara} alt="Robot" className="robot" style={{ marginTop: "10px" ,width: "5%", height: "auto" }} />
                                    <p></p>
                                    <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px" }}>Nuevo usuario</h3>
                                    <table
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            marginBottom: "20px"
                                    }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f1f1f1" }}>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Apellido 1</th>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Apellido 2</th>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Contraseña</th>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Fecha Nac.</th>
                                            <th style={{ padding: "10px", textAlign: "left" }}>Género</th>
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
                                        Crear usuario
                                    </button>
                                    <button
                                        onClick={() => setCrearNuevo(false)}
                                        style={{
                                            backgroundColor: "#cf0606ff",
                                            color: "white",
                                            padding: "12px 20px",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                            </div>
                        )}

                        {/* Tabla de Pacientes */}
                        {data && (
                        <div className="confirmation-modal">
                            <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px" }}>
                            <img src={cara} alt="Robot" className="robot" style={{ width: "5%", height: "auto", marginTop: "5px" }} />
                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "5px" }}>Editar paciente</h3>

                            <table
                                style={{
                                width: "100%",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                padding: "20px",
                                marginBottom: "20px",
                                }}
                            >
                                {/* Fila de encabezado 1 */}
                                <thead>
                                <tr style={{ textAlign: "left" }}>
                                    <th>Nombre</th>
                                    <th>Primer apellido</th>
                                    <th>Segundo apellido</th>
                                    <th>F. Nacimiento</th>
                                    <th>H. tóxicos</th>
                                    <th>Género</th>
                                    <th>Centro</th>
                                </tr>
                                </thead>

                                {/* Fila de inputs 1 */}
                                <tbody>
                                <tr>
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative",  top: "5px" }}
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative",  top: "5px" }}
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative",  top: "5px" }}
                                    />
                                    </td>
                                    <td>
                                    <input
                                        type="date"
                                        value={sumarUnDia(formatDate(data.paciente[0].fecha_nacimiento))}
                                        onChange={(e) =>
                                        setData({
                                            ...data,
                                            paciente: [{ ...data.paciente[0], fecha_nacimiento: e.target.value }],
                                        })
                                        }
                                        style={{width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px" }}
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative",  top: "5px" }}
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
                                        style={{width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px"}}
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
                                        onChange={(e) =>
                                        setData({
                                            ...data,
                                            usuario: [{ ...data.usuario[0], centro: e.target.value }],
                                        })
                                        }
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative",  top: "5px"}}
                                    />
                                    </td>
                                </tr>

                                {/* Fila de encabezado 2 */}
                                <tr style={{position: "relative",  top: "30px"}}>
                                    <th>Correo</th>
                                    <th>Cuerpo Médico</th>
                                    <th colSpan="3">Parámetros médicos</th>
                                    <th>Altura</th>
                                    <th colSpan="2">Observaciones</th>
                                </tr>

                                {/* Fila de inputs 2 */}
                                <tr>
                                    <td>
                                        <span
                                        style={{
                                            display: "inline-block",
                                            width: "100%",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            marginLeft: "-10px",
                                            position: "relative",
                                            top: "-30px",
                                            backgroundColor: "#f9f9f9",
                                            fontSize: "12px",
                                        }}
                                        >
                                        {data.usuario[0].correo}
                                        </span>
                                    </td>
                                    <td>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "80%",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            marginLeft: "10px",
                                            position: "relative",
                                            top: "-30px",
                                            backgroundColor: "#f9f9f9",
                                            fontSize: "16px",
                                            color: "grey"
                                        }}
                                        >
                                        {data.usuario[0].cuerpo_medico === 1 ? "Sí" : "No"}
                                    </span>
                                    </td>
                                    <td colSpan="3">
                                        <div style={{ height: "20px" }}></div>
                                        <div
                                            className="grid grid-cols-3 gap-4 p-4"
                                            style={{ marginBottom: "10px", width: "100%" }}
                                        >
                                            {["Tensión", "Medicación", "Frecuencia", "Arritmia", "Peso"].map((texto, i) => (
                                            <button
                                                key={texto}
                                                type="button"
                                                onClick={() =>
                                                handleClick(
                                                    i,
                                                    `${data.paciente[0].nombre} ${data.paciente[0].apellido1} ${data.paciente[0].apellido2}`
                                                )
                                                }
                                                className="flex flex-col items-center p-3 bg-blue-100 hover:bg-blue-200 rounded-xl shadow-md transition"
                                                style={{ minWidth: "80px" }}
                                            >
                                                <span
                                                className="text-blue-700 mb-1"
                                                dangerouslySetInnerHTML={{ __html: icons[i] || "" }}
                                                />
                                                <span className="text-sm font-medium text-center">{texto}</span>
                                            </button>
                                            ))}
                                        </div>
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative", top: "-30px"}}
                                    />
                                    </td>
                                    <td colSpan="2">
                                    <textarea
                                        value={data.paciente[0].exploraciones}
                                        onChange={(e) =>
                                        setData({
                                            ...data,
                                            paciente: [{ ...data.paciente[0], exploraciones: e.target.value }],
                                        })
                                        }
                                        style={{width: "100%", height: "20px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-15px", position: "relative", top: "-30px"}}
                                    />
                                    </td>
                                    
                                </tr>
                                </tbody>
                            </table>

                                {graficaMostrada === "frecuencia" && (
                                    <div className="confirmation-modal">
                                        <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px"}}>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px", fontSize: "40px" }}>Frecuencia Cardiaca</h3>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px" }}>{paciente}</h3>
                                            <div className="graficas" style={{ marginBottom: "60px" }}>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={frecuencia}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        stroke="#2fa831"
                                                        dataKey="fecha"
                                                        tick={{ fontSize: 16, fontWeight: "bold" }}
                                                    />
                                                    <YAxis
                                                        domain={["auto", "auto"]}
                                                        tick={{ fontSize: 16, fontWeight: "bold" }}
                                                        stroke="#2fa831"
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
                                             <button
                                                onClick={() => setGraficaMostrada(null)}
                                                style={{
                                                        position: "relative",
                                                        top: "-80px", 
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "12px 20px",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                            >
                                                Volver 
                                            </button>
                                         </div>
                                    </div>
                                )}

                                {graficaMostrada === "medicacion" && (
                                <div className="confirmation-modal">
                                        <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px"}}>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px", fontSize: "40px" }}>Tomas medicación</h3>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px" }}>{paciente}</h3>
                                            <div
                                                className="calendar-container"
                                                style={{ marginBottom: "100px", position: "relative", zIndex: "100", marginTop: "-10px", transform: "scale(0.9)",  }}
                                            >
                                                <Calendar
                                                tileDisabled={() => true}
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
                                                    </div>
                                                    ) : null
                                                }
                                                selectRange={false}
                                                />
                                            </div>
                                            <button
                                                onClick={() => setGraficaMostrada(null)}
                                                style={{
                                                        position: "relative",
                                                        top: "-125px", 
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "12px 20px",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                            >
                                                Volver 
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {graficaMostrada === "tension" && (
                                    <div className="confirmation-modal">
                                        <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px"}}>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px", fontSize: "40px" }}>Tensión Cardiaca</h3>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px" }}>{paciente}</h3>
                                                <div className="graficas" style={{ marginBottom: "100px" }}>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <ComposedChart data={tension}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis stroke="#28a745" dataKey="fecha" tick={{ fontSize: 16, fontWeight: 'bold' }} />
                                                            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 16, fontWeight: 'bold' }} stroke="#28a745" />
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
                                    
                                            <button
                                                onClick={() => setGraficaMostrada(null)}
                                                style={{
                                                        position: "relative",
                                                        top: "-120px", 
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "12px 20px",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                            >
                                                Volver 
                                            </button>
                                         </div>
                                    </div>
                                )}

                                {graficaMostrada === "arritmia" && (
                                <div className="confirmation-modal">
                                        <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px"}}>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px", fontSize: "40px" }}>Arritmias</h3>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px" }}>{paciente}</h3>
                                            <div
                                                className="calendar-container"
                                                style={{ marginBottom: "100px", position: "relative", zIndex: "100", marginTop: "-10px", transform: "scale(0.9)",  }}
                                            >
                                    <Calendar
                                    tileDisabled={() => true}
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                                            </svg>
                                        </div>
                                        ) : null
                                    }
                                    selectRange={false}
                                    />
                                </div>
                                            <button
                                                onClick={() => setGraficaMostrada(null)}
                                                style={{
                                                        position: "relative",
                                                        top: "-125px", 
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "12px 20px",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                            >
                                                Volver 
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {graficaMostrada === "peso" && (
                                    <div className="confirmation-modal">
                                        <div className="modal-content" style={{ width: "90%", height: "70%", marginTop: "105px"}}>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px", fontSize: "40px" }}>Tensión Cardiaca</h3>
                                            <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px" }}>{paciente}</h3>
                                                <div className="graficas" style={{ marginBottom: "60px" }}> 
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart data={peso}> 
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis 
                                                                stroke="#28a745"
                                                                dataKey="fecha" 
                                                                tick={{ fontSize: 16, fontWeight: 'bold' }} 
                                                            />
                                                            <YAxis 
                                                                domain={["auto", "auto"]} 
                                                                tick={{ fontSize: 16, fontWeight: 'bold' }}  
                                                                stroke="#28a745"
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
                                            <button
                                                onClick={() => setGraficaMostrada(null)}
                                                style={{
                                                        position: "relative",
                                                        top: "-80px", 
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        padding: "12px 20px",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                            >
                                                Volver 
                                            </button>
                                         </div>
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleEditarUsuario}
                                    style={{
                                            position: "relative",
                                            top: "-60px", 
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            padding: "12px 20px",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                        }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                >
                                    Guardar 
                                </button>

                                <button
                                    onClick={cancelar}
                                    style={{
                                            position: "relative",
                                            top: "-60px", 
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            padding: "12px 20px",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                        }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                >
                                    Cancelar 
                                </button>

                                {nombreSeleccionado && (
                                    <button
                                        onClick={handleEliminarUsuario}
                                        style={{
                                            position: "relative",
                                            top: "-60px", 
                                            backgroundColor: "#f80000ff",
                                            color: "white",
                                            padding: "12px 20px",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
                                    >
                                        Eliminar usuario
                                    </button>
                                )}
                                </div>
                            </div>
                        )}
            
            <div
                style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginBottom: "100px",
                    position: "relative",
                    zIndex: "100",
                }}
            >
                    <div 
                        style={{
                            position: "absolute",
                            top: "30%", 
                            left: "20%",
                            zIndex: 1000000,
                            width: "75%",
                            borderRadius: "20px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            padding: "10px"
                        }}>
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
                                                .map((paciente) => (
                                                    <li key={paciente} style={{ listStyle: "none", margin: "10px 0", padding: 0 }}>
                                                        <button
                                                            onClick={() => setNombreSeleccionado(paciente)}
                                                            onKeyDown={(e) => {
                                                            if (e.key === "Enter" || e.key === " ") {
                                                                e.preventDefault();
                                                                setNombreSeleccionado(paciente);
                                                            }
                                                            }}
                                                            style={{
                                                            all: "unset", // Resetea estilos del botón
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "10px",
                                                            cursor: "pointer",
                                                            color:
                                                                nombreSeleccionado &&
                                                                nombreSeleccionado.nombre === paciente.nombre &&
                                                                nombreSeleccionado.apellido1 === paciente.apellido1 &&
                                                                nombreSeleccionado.apellido2 === paciente.apellido2 &&
                                                                nombreSeleccionado.fecha_nacimiento === paciente.fecha_nacimiento
                                                                ? "#28a745"
                                                                : "#333",
                                                            backgroundColor:
                                                                nombreSeleccionado &&
                                                                nombreSeleccionado.nombre === paciente.nombre &&
                                                                nombreSeleccionado.apellido1 === paciente.apellido1 &&
                                                                nombreSeleccionado.apellido2 === paciente.apellido2 &&
                                                                nombreSeleccionado.fecha_nacimiento === paciente.fecha_nacimiento
                                                                ? "#e8f5e9"
                                                                : "#fff",
                                                            borderRadius: "5px",
                                                            transition: "all 0.3s ease",
                                                            width: "98%",
                                                            textAlign: "left",
                                                            }}
                                                        >
                                                            <div style={{ flex: 1, fontWeight: "bold" }}>
                                                            {paciente.nombre}
                                                            </div>
                                                            <div style={{ flex: 2 }}>
                                                            {paciente.apellido1} {paciente.apellido2}
                                                            </div>
                                                            <div style={{ flex: 3 }}>
                                                            {paciente.cuerpo_medico === 1 ? "Sí" : "No"}
                                                            </div>
                                                            <div style={{ flex: 1, textAlign: "right" }}>
                                                            {sumarUnDia(formatDate(paciente.fecha_nacimiento))}
                                                            </div>
                                                        </button>
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


                        

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CuerpoMedico;
