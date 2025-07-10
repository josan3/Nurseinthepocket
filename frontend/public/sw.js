import logo from '../src/assets/logo.png';
self.addEventListener("push", function (event) {
    const data = event.data.json();
  
    const options = {
      body: data.body,
      icon: logo, 
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
});