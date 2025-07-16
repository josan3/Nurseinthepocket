import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cara from "../assets/cara.png"; 

const Administracion = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [nombreSeleccionado, setNombreSeleccionado] = useState(null);
    const [medicamentoNombre, setMedicamentoNombre] = useState(null);
    const [lista, setLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
    const [vista, setVista] = useState(localStorage.getItem('vista') || 'pacientes');
    const [id, setId] = useState([]);
    const [crearNuevo, setCrearNuevo] = useState(false);
    const [antiguoCorreo, setAntiguoCorreo] = useState("");
    const [nuevoMedicamento, setNuevoMedicamento] = useState({ nombre: "" });
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        password: "",
        apellido1: "",
        apellido2: "",
        fecha_nacimiento: "",
        habitos_toxicos: "",
        genero: 1,
        centro: "",
        correo: "",
        cuerpo_medico: 0,
        altura: "",
        observaciones: ""
    });

    function sumarUnDia(fechaString) {
        const fecha = new Date(fechaString);
        fecha.setDate(fecha.getDate() + 1);
        return fecha.toISOString().split("T")[0]; // Devuelve en formato YYYY-MM-DD
    }

    const buttons = [
        { label: "Información usuarios", 
            key: "pacientes",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
         },
        { label: "Información medicamentos",
            key: "medicamentos",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
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
                </svg>
            )
        },
        { label: "Historial uso de pacientes",
            key: "historial",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <path d="M3 3v5h5" />
                    <path d="M3.05 13a9 9 0 1 0 .5-4.5L3 8" />
                    <path d="M12 7v5l3 3" />
                </svg>
            )
        }
    ];

    const handleOptionClick = (vistaSeleccionada) => {
        setVista(vistaSeleccionada);
        localStorage.setItem('vista', vistaSeleccionada);
    };

    const cancelar = () => {
        window.location.reload();
    }


    useEffect(() => {
        const getNombres = async () => {
            try {
                const response = await fetch("http://localhost:8801/getusernames", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data2 = await response.json();

                console.log(data2)

                if (response.ok) {
                    setLista(data2.data);
                    setResultadosFiltrados(data2.data);
                } else {
                    console.log(data2.error || "Error al obtener datos")
                }
            } catch (error) {
                console.log("Error de conexión con el servidor", error);
            }
        };

        const getMedicamentos = async () => {
            try {
                const response = await fetch("http://localhost:8801/getmedicamentos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data3 = await response.json();

                if (response.ok) {
                    setLista(data3.data);
                    setResultadosFiltrados(data3.data);
                } else {
                    console.log(data3.error || "Error al obtener datos");
                }
            } catch (error) {
                console.log("Error de conexión con el servidor", error);
            }
        };

        const getHistorial = async () => {
            try {
                const response = await fetch("http://localhost:8801/gethistorial", {
                method: "GET",
                });

                const data4 = await response.json();

                if (response.ok) {
                setLista(data4.data);
                setResultadosFiltrados(data4.data);
                } else {
                    console.log(data4.error || "Error al obtener datos")
                }
            } catch (error) {
                    console.log("Error de conexión con el servidor", error);
            }
        };

        if (vista === "medicamentos") {
            getMedicamentos();
        } else if (vista === "pacientes") {
            getNombres();
        }
        else {
            getHistorial();
        }
    }, [vista]);

    useEffect(() => {

        const id = localStorage.getItem("id");

        if (id !== "1") {
            navigate("/404");
        }
        else {
            navigate("/administracion");
        }

        if (vista === "medicamentos") {
            const resultados = Array.isArray(lista)
                ? lista.filter((medicamento) =>
                      `${medicamento.nombre}`
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                  )
                : [];

            setResultadosFiltrados(resultados);

            // Si el medicamento seleccionado no está en los resultados, deseleccionarlo
            if (medicamentoNombre && !resultados.some(m => m.nombre === medicamentoNombre)) {
                setMedicamentoNombre(null);
            }
        } else if (vista === "pacientes"){
            const resultados = Array.isArray(lista)
                ? lista.filter((paciente) =>
                      `${paciente.nombre} ${paciente.apellido1} ${paciente.apellido2}`
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                  )
                : [];

            setResultadosFiltrados(resultados);
        }else if (vista === "historial") {
        // Filtro específico para historial
        const resultados = Array.isArray(lista)
            ? lista.filter((item) =>
                `${item.nombre || ""} ${item.apellido1 || ""} ${item.apellido2 || ""} ${item.correo || ""} ${item.fecha || ""}`
                    .toLowerCase()
                    .includes(busqueda.toLowerCase())
            )
            : [];
        setResultadosFiltrados(resultados);
    }

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
            } else {
                console.log(data1.error || "Error al obtener los datos del paciente");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };


    
    function formatDate(dateString) {
        const date = new Date(dateString); // Convierte la fecha a un objeto Date
        const year = date.getFullYear(); // Obtiene el año
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (sumando 1 porque getMonth devuelve 0-11)
        const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día del mes
    
        return `${year}-${month}-${day}`; // Devuelve la fecha en formato "YYYY-MM-DD"
    }

    const handleCrearMedicamento = async () => {
        if (!nuevoMedicamento.nombre.trim()) {
            console.log("Por favor, introduce un medicamento");
            return;
        }

        try {
            const response = await fetch("http://localhost:8801/setmedicamentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nuevoMedicamento.nombre,
                }),
            });

            const data4 = await response.json();

            if (response.ok) {
                window.location.reload();
                setVista('medicamentos');
            } else {
                console.log(data4.error || "Error al crear el medicamento");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const handleEliminarMedicamento = async () => {
        if (!medicamentoNombre) {
            console.log("Por favor, introduce un medicamento");
            return;
        }

        try {
            const response = await fetch("http://localhost:8801/deletemedicamentos", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: medicamentoNombre,
                }),
            });

            const data4 = await response.json();

            if (response.ok) {
                console.log("Medicamento eliminado con éxito");
                window.location.reload();
                setVista('medicamentos');
            } else {
                console.log(data4.error || "Error al eliminar el medicamento");
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

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
            console.log("Error: ", error);
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
            console.log("Error: ", error);
        }
    };
    

    const handleEliminarUsuario = async () => {

    const correo = data?.usuario?.[0]?.correo;


    if (!id || !correo) {
        console.error("Faltan datos");
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
                id,
                correo
            }),
        });

        const resData = await response.json();

        if (response.ok) {
            console.log("Usuario eliminado con éxito");
            window.location.reload();
        } else {
            console.log(resData.error || "Error al eliminar el usuario");
        }

    } catch (error) {
        console.log("Error: ", error);
    }
};
    

    return (
        <div>
            <header>Administración</header>
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

            {/* Vista de Pacientes */}
            {vista === "pacientes" && (
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
                                                .sort((a, b) => {
                                                    const nombreA = a.nombre || "";
                                                    const nombreB = b.nombre || "";
                                                    return nombreA.localeCompare(nombreB);
                                                })
                                                .map((paciente, index) => (
                                                    <li key={index} style={{ margin: "10px 0" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNombreSeleccionado(paciente)}
                                                            onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                setNombreSeleccionado(paciente);
                                                            }
                                                            }}
                                                            style={{
                                                            all: 'unset', // Resetea estilos por defecto del botón
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
                                                            width: '98%', 
                                                            textAlign: 'left', // para que el texto quede alineado a la izquierda
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
                                                            <div style={{ flex: 1, textAlign: "right" }}>
                                                            {formatDate(paciente.fecha_nacimiento)}
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

                        {crearNuevo && (
                            <div className="confirmation-modal">
                                <div className="modal-content" style={{width: "90%"}}>
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
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} /></td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.apellido1} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido1: e.target.value })} /></td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.apellido2} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido2: e.target.value })} /></td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} /></td>
                                            <td><input type="date" style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.fecha_nacimiento} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, fecha_nacimiento: formatDate(e.target.value) })} /></td>
                                            <td>
                                                <select style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.genero} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, genero: parseInt(e.target.value) })}>
                                                    <option value={1}>Masculino</option>
                                                    <option value={2}>Femenino</option>
                                                    <option value={3}>Otro</option>
                                                </select>
                                            </td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} /></td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.centro} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, centro: e.target.value })} /></td>
                                            <td>
                                                <select style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.cuerpo_medico} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, cuerpo_medico: parseInt(e.target.value) })}>
                                                    <option value={1}>Sí</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.habitos_toxicos} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, habitos_toxicos: e.target.value })} /></td>
                                            <td><input style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.altura} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, altura: e.target.value })} /></td>
                                            <td><textarea style={{ width: "80%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} value={nuevoUsuario.observaciones} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, observaciones: e.target.value })} /></td>
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
                                <div className="modal-content" style={{width: "90%"}}>
                                <img src={cara} alt="Robot" className="robot" style={{ marginTop: "10px" ,width: "5%", height: "auto" }} />
                                <p></p>
                                <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px" }}>Datos del usuario</h3>
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-35px" }}
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
                                        style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-45px", position: "relative",  top: "5px" }}
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
                                        style={{width: "130%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "-20px"}}
                                    >
                                        <option value="1">Masculino</option>
                                        <option value="2">Femenino</option>
                                        <option value="3">Otro</option>
                                    </select>
                                    </td>
                                </tr>

                                {/* Fila de encabezado 2 */}
                                <tr style={{position: "relative",  top: "30px", left: "50px"}}>
                                    <th>Correo</th>
                                    <th>Cuerpo Médico</th>
                                    <th>Centro</th>
                                    <th>Altura</th>
                                    <th colSpan="2">Observaciones</th>
                                </tr>

                                {/* Fila de inputs 2 */}
                                <tr>
                                    <td>
                                        <span
                                        style={{
                                            display: "inline-block",
                                            width: "120%",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            marginLeft: "-10px",
                                            position: "relative",
                                            top: "30px",
                                            backgroundColor: "#f9f9f9",
                                            fontSize: "12px",
                                        }}
                                        >
                                        {data.usuario[0].correo}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={data.usuario[0].cuerpo_medico}
                                            onChange={(e) =>
                                            setData({
                                                ...data,
                                                usuario: [{ ...data.usuario[0], cuerpo_medico: parseInt(e.target.value) }],
                                            })
                                            }
                                            style={{
                                                display: "inline-block",
                                                width: "80%",
                                                padding: "4px",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                marginLeft: "60px",
                                                position: "relative",
                                                top: "30px",
                                                backgroundColor: "#f9f9f9",
                                                fontSize: "16px",
                                            }}
                                            >
                                            <option value="1">Sí</option>
                                            <option value="0">No</option>
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
                                            style={{width: "80%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "80px", position: "relative",top: "35px"}}
                                        />
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
                                        style={{width: "50%", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "60px", position: "relative", top: "30px"}}
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
                                        style={{width: "100%", height: "20px", padding: "4px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "10px", position: "relative", top: "30px"}}
                                    />
                                    </td>
                                    
                                </tr>
                                </tbody>
                            </table>

                                <button
                                        onClick={cancelar}
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
                                        Cancelar
                                    </button>
                                <button
                                    onClick={handleEditarUsuario}
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
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
                                >
                                    Guardar
                                </button>

                                {nombreSeleccionado && (
                                    <button
                                        onClick={handleEliminarUsuario}
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

                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
                                    >
                                        Eliminar usuario
                                    </button>
                                )}
                            </div>
                        </div>
                        )}

                    </div>
                )}

                {/* Vista de Medicamentos */}
                {vista === "medicamentos" && (
                    <div>
                        {/* Buscador */}
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
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Buscar medicamentos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
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
                            
                            <button
                                onClick={() => setCrearNuevo(!crearNuevo)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#2fa831",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                }}
                            >
                                Crear medicamento
                            </button>

                            {crearNuevo && (
                                <div className="confirmation-modal">
                                    <div className="modal-content" style={{width: "90%"}}>
                                        <img src={cara} alt="Robot" className="robot" style={{ marginTop: "10px" ,width: "5%", height: "auto" }} />
                                        <p></p>
                                        <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "-10px" }}>Nuevo medicamento</h3>
                                        <table
                                            style={{
                                                width: "100%",
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "8px",
                                                padding: "20px",
                                                marginBottom: "20px"
                                            }}
                                        >
                                            <thead>
                                                <tr style={{ backgroundColor: "#f1f1f1" }}>
                                                    <th style={{ padding: "10px", textAlign: "left" }}>Nombre del medicamento</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <input
                                                            style={{
                                                                width: "90%",
                                                                padding: "8px",
                                                                borderRadius: "4px",
                                                                border: "1px solid #ccc"
                                                            }}
                                                            value={nuevoMedicamento.nombre}
                                                            onChange={(e) =>
                                                                setNuevoMedicamento({
                                                                    ...nuevoMedicamento,
                                                                    nombre: e.target.value
                                                                })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <button
                                            onClick={handleCrearMedicamento}
                                            style={{
                                                backgroundColor: "#28a745",
                                                color: "white",
                                                padding: "12px 20px",
                                                borderRadius: "5px",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "16px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            Guardar medicamento
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
                                                fontSize: "16px"
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                    </div>
                                </div>
                            )}


                            <button
                                onClick={handleEliminarMedicamento}
                                disabled={!medicamentoNombre}
                                style={{
                                    padding: "10px 20px",
                                    marginLeft: "78.5%",
                                    backgroundColor: medicamentoNombre ? "#2fa831" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    cursor: medicamentoNombre ? "pointer" : "not-allowed",
                                }}
                            >
                                Eliminar medicamento
                            </button>

                            <div
                                style={{
                                    width: "95%",
                                    backgroundColor: "white",
                                    padding: "10px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                {resultadosFiltrados.length > 0 ? (
                                    <ul>
                                        {resultadosFiltrados
                                            .slice() // Para no modificar el array original
                                            .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Orden alfabético
                                            .map((medicamento, index) => (
                                                <li key={index} style={{ marginLeft: "20px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setMedicamentoNombre(medicamento.nombre)}
                                                        onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            setMedicamentoNombre(medicamento.nombre);
                                                        }
                                                        }}
                                                        style={{
                                                        all: 'unset',
                                                        cursor: "pointer",
                                                        color: medicamentoNombre === medicamento.nombre ? "green" : "black",
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        display: 'block',
                                                        }}
                                                    >
                                                        {medicamento.nombre}
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p>No se encontraron medicamentos</p>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                {/* Vista del historial */}
{vista === "historial" && (
    <div 
        style={{
            position: "absolute",
            top: "30%", 
            left: "20%",
            zIndex: 100,
            width: "75%",
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            paddingBottom: "30px",
            height: "55%",
        }}>
        <h3 style={{ textAlign: "center", color: "#2fa831", marginTop: "10px", marginBottom: "30px" }}>
            Historial de uso de pacientes
        </h3>

        {resultadosFiltrados.length > 0 ? (
            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#e0e0e0", zIndex: 1 }}>
                        <tr>
                            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Nombre</th>
                            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Primer Apellido</th>
                            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Segundo Apellido</th>
                            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Correo</th>
                            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosFiltrados.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.nombre || "-"}</td>
                                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.apellido1 || "-"}</td>
                                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.apellido2 || "-"}</td>
                                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.correo || "-"}</td>
                                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{item.hora || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p style={{ color: "#888" }}>No hay historial disponible.</p>
        )}
    </div>
)}


            </div>

                <div style={{height: "400px"}}></div>
        </div>
    );
};

export default Administracion;
