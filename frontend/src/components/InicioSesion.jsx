import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"
import { auth } from "../firebase.js";
import google from "../assets/google.png"; 

const InicioSesion = () => {
  const [id, setId] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetCorreo, setResetCorreo] = useState("");
  const navigate = useNavigate(); 

const handleGoogleSignIn = async (e) => {
  e.preventDefault(); // Evita recargar la página

     const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(auth, provider)

    const user = userCredential.user;
    const token = await user.getIdToken();
    console.log("token", token);
    console.log("user", user);

    const response = await fetch("http://localhost:8801/logingoogle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Puedes enviar el token en headers
      },
      body: JSON.stringify({}), // Si el backend lo requiere
    });

    const data = await response.json();
    console.log("obtenido ", data.result);

    if (response.ok) {
      // Guarda datos útiles
      setId(data.result.id);
      setSuccess("Login exitoso");
      setError("");

      localStorage.setItem("id", data.result.id);
      localStorage.setItem("centro", data.result.centro);
      localStorage.setItem("cuerpo_medico", data.result.cuerpo_medico);
      localStorage.setItem("token", token); 

      // Navegación según el rol
      if (user.email === "nurseinthepocket@gmail.com") {
        setTimeout(() => navigate(`/administracion`), 1000);
      } else if (data.result.cuerpo_medico === 1) {
        setTimeout(() => navigate(`/cuerpomedico`), 1000);
      } else {
        setTimeout(() => navigate(`/home`), 1000);
      }
    } else {
      setError(data.error || "Error al iniciar sesión");
      setSuccess("");
    }
  } catch (error) {
    console.error(error);
    setError("Error en autenticación o cuenta no registrada");
    setSuccess("");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault(); // Evita recargar la página

  try {
    const userCredential = await signInWithEmailAndPassword(auth, correo, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    // 🧠 2. Enviar el token al backend si necesitas validar o usarlo allá
    const response = await fetch("http://localhost:8801/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Puedes enviar el token en headers
      },
      body: JSON.stringify({}), // Si el backend lo requiere
    });

    const data = await response.json();
    console.log("obtenido ", data.result);

    if (response.ok) {
      // Guarda datos útiles
      setId(data.result.id);
      setSuccess("Login exitoso");
      setError("");

      localStorage.setItem("id", data.result.id);
      localStorage.setItem("centro", data.result.centro);
      localStorage.setItem("cuerpo_medico", data.result.cuerpo_medico);
      localStorage.setItem("token", token); 

      // Navegación según el rol
      if (correo === "nurseinthepocket@gmail.com") {
        setTimeout(() => navigate(`/administracion`), 1000);
      } else if (data.result.cuerpo_medico === 1) {
        setTimeout(() => navigate(`/cuerpomedico`), 1000);
      } else {
        setTimeout(() => navigate(`/home`), 1000);
      }
    } else {
      setError(data.error || "Error al iniciar sesión");
      setSuccess("");
    }
  } catch (error) {
    console.error(error);
    setError("Contraseña o correo incorrecto");
    setSuccess("");
  }
};

const handleResetPassword = async () => {
    if (!resetCorreo) {
      setError("Introduce tu correo electrónico");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetCorreo);
      setSuccess("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
      setError("");
      setShowModal(false);
      setResetCorreo("");
    } catch (error) {
      setError("No se pudo enviar el correo de recuperación. ¿El correo está registrado?");
      setSuccess("");
    }
  };

  return (
    <div>
      <div>
        
          <header>
          Iniciar Sesión
          </header>
       
        <form onSubmit={handleSubmit}>
          <div>
            <label>Correo:</label> <br></br>
            <input
              type="text"
              placeholder="Escriba su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <label>Contraseña:</label><br></br>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
          <button type="submit" style={{marginRight: '10px' }}>Iniciar sesion</button>
         <button 
            onClick={handleGoogleSignIn}
          >
            <img 
              src={google} 
              alt="Google logo" 
              style={{ width: '15px', height: '15px', marginRight: '10px' }}
            />
            Iniciar sesión con Google
          </button>
          </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
          
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
          <p
            onClick={() => setShowModal(true)}
            style={{ color: 'blue', cursor: 'pointer' }}>
            Recuperar contraseña
          </p>

        </form>

        {/* Modal para recuperación de contraseña */}
{showModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      width: "400px", // tamaño fijo o usa "minWidth", "maxWidth"
      background: "white",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      <h3 style={{ margin: 0 }}>Recuperar contraseña</h3>
      <input
        type="email"
        placeholder="Introduce tu correo"
        value={resetCorreo}
        onChange={e => setResetCorreo(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button onClick={handleResetPassword}>
          Enviar
        </button>
        <button
          onClick={() => { setShowModal(false); setResetCorreo(""); }}
          style={{ background: "#ccc" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


        
        
      </div>
    </div>
  );
};

export default InicioSesion;
