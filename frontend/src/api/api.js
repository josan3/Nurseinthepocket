const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Si la respuesta es exitosa, guardamos el token en localStorage
      const token = data.token;
      localStorage.setItem('token', token); // Guardamos el token en localStorage
      console.log('Token guardado en localStorage:', token); // Verifica que se guarde correctamente
    } else {
      console.log('Error en el login:', data.error); // Muestra el error si no es exitoso
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};

const register = async (id, nombre, password, apellido1, apellido2) => {
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, nombre, password, apellido1, apellido2 }),
    });

    const data = await response.json();

    if (response.ok) {
      // Si el registro fue exitoso, guardamos el token
      const token = data.token;
      localStorage.setItem('token', token);
      console.log('Token guardado en localStorage:', token);
    } else {
      console.log('Error en el registro:', data.error);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};

  
  export { login, register};
  