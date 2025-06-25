import logo from '../src/assets/logo.png'; // Asegúrate de que la ruta sea correcta

self.addEventListener("push", function (event) {
    const data = event.data.json();
  
    const options = {
      body: data.body,
      icon: logo, // o la ruta a tu icono, como '/logo.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
});