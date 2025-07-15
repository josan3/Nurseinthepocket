import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"
import { auth } from "../firebase.js";
import google from "../assets/google.png"; 

const Registro = () => {
  const [id, setId] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [centro, setCentro] = useState("");
  const [centrosDisponibles, setCentrosDisponibles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8801/getcentros", {
        method: "GET",
      });

      const data4 = await response.json();
      console.log("obtenido", data4);

      if (response.ok) {
        setCentrosDisponibles(data4.data);
        setSuccess("Datos obtenidos");
        setError("");
      } else {
        setError(data4.error || "Error al obtener datos");
        setSuccess("");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
      setSuccess("");
      }
  };

  fetchData();
}, []);

    


  const handleGoogleSignIn = async (e) => {
    e.preventDefault(); // Evita recargar la página
  
    const provider = new GoogleAuthProvider();
  
    try {
      const userCredential = await signInWithPopup(auth, provider)
  
      const user = userCredential.user;
      const token = await user.getIdToken();
      console.log("token", token);
      console.log("user", user);
      
      console.log("correo", user.email);

      try {
        const response = await fetch("http://localhost:8801/registergoogle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        console.log ("data", data);

        if (response.ok) {
          setId(data.result)
          setSuccess("Registro exitoso");
          setError("");
          setTimeout(() => {
            localStorage.setItem("id", data.result.id);
            localStorage.setItem("token", token);
            navigate(`/bienvenida`); // Redirige con el ID del usuario
          }, 1000); // Espera 1s antes de redirigir
        } else {
          setError(data.error || "Error al registrarse");
          setSuccess("");
        }
      } catch (error) {
        setError("Error de conexión con el servidor");
        setSuccess("");
      }
    }catch (error) {
      setError("Datos no aportados correctamente, por favor introduzca un correo y contraseña de 6 caracteres mínimo");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password)
      const user = userCredential.user;
      const token = await user.getIdToken();


      try {
        const response = await fetch("http://localhost:8801/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({password, nombre, apellido1, apellido2, centro }),
        });

        const data = await response.json();

        console.log ("data", data.result.id);

        if (response.ok) {
          setId(data.result)
          setSuccess("Registro exitoso");
          setError("");
          setTimeout(() => {
            localStorage.setItem("username", nombre);
            localStorage.setItem("id", data.result.id);
            localStorage.setItem("token", token);
            navigate(`/welcome`); // Redirige con el ID del usuario
          }, 1000); // Espera 1s antes de redirigir
        } else {
          setError(data.error || "Error al registrarse");
          setSuccess("");
        }
      } catch (error) {
        setError("Error de conexión con el servidor");
        setSuccess("");
      }
    }catch (error) {
      setError("Datos no aportados correctamente, por favor introduzca un correo y contraseña de 6 caracteres mínimo");
      setSuccess("");
    }
  };

  return (
    <div>
      <div>
        <header>Registrarse</header>
        <form onSubmit={handleSubmit} style={{top: '-120px'}}>
          <div >
            <label>Correo:</label><br />
            <input
              type="text"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <label>Contraseña:</label><br />
            <input
              type="password"
              placeholder="Cree una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Nombre:</label><br />
            <input
              type="text"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label>Primer apellido:</label><br />
            <input
              type="text"
              placeholder="Ingrese su primer apellido"
              value={apellido1}
              onChange={(e) => setApellido1(e.target.value)}
            />
          </div>
          <div>
            <label>Segundo apellido:</label><br />
            <input
              type="text"
              placeholder="Ingrese su segundo apellido"
              value={apellido2}
              onChange={(e) => setApellido2(e.target.value)}
            />
          </div>
          <div>
            <label>Hospital:</label><br />
            <select
              value={centro}
              onChange={(e) => setCentro(e.target.value)}
              style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            >
              <option value="">Seleccione un hospital</option>
              {centrosDisponibles.map((c, index) => (
                <option key={index} value={c.centro}>
                  {c.centro}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" style={{marginRight: '10px' }}>Registrarse</button>
          <button onClick={handleGoogleSignIn}>
            <img 
              src={google} 
              alt="Google logo" 
              style={{ width: '15px', height: '15px', marginRight: '10px' }}
            />
            Registro con Google</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

          <p className="mt-4 text-center text-gray-600">
            ¿Tienes ya cuenta? <Link to="/">Iniciar sesion</Link>
          </p>
          
        </form>
      </div>
    </div>
  );
};

export default Registro;
