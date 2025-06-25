import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import robot from "../assets/normal.png"; 

const Informacion = () => {
    const navigate = useNavigate();
    const [showEditOptions, setShowEditOptions] = useState(false);
    const mensaje = `Aquí tienes informacion sobre la fibrilación auricular. ¡Recuerda que puedes mandarle un correo a la asociación Trebol de Corazones con tus dudas!`;

    const handleEditClick = () => {
        setShowEditOptions(!showEditOptions); // Alterna la visibilidad de las opciones de editar
    };

    const handleOptionClick = (path) => {
        navigate(path); // Redirige a la ruta seleccionada
    };

    const buttons = [
        { path: "/informacion", label: "Obtener información", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
        ) },
        { path: "/correo", label: "Correo asociación", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <path d="M22 6l-10 7L2 6" />
            </svg>
        ) },
        { path: "/home", label: "Inicio", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
                <path d="M21 22H3" />
            </svg>
        ) },
        { label: "Editar parámetros", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ) },
        { path: "/configuracion", label: "Ajustes de usuario", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a2 2 0 0 0 .5 2.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.1-.5 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.5a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .5-2.1 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.5-2.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.1.5 2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.5 2.1 2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.5a2 2 0 0 0-1.8 1.2z" />
            </svg>

        ) }
    ];

    const datos = [
        {
            titulo: "¿Qué es la fibrilación auricular?",
            descripcion: "Como podemos ver en la Fundación Española del Corazón, cuando el ritmo cardiaco normal (sinusal) se pierde, se produce un aleteo de la aurícula llevando a una aritmia cardiaca. La fibrilación auricular (FA) es la arritmia más frecuente y se produce cuando en condiciones normales ",
            texto: "La fibrilación auricular es una enfermedad grave, ya que puede producir coágulos de sangre que pueden viajar desde el corazón hasta el cerebro y causarle un infarto cerebral. Gracias a los recientes avances de la medicina, existen distintos tratamientos para esta enfermedad. La mayoría de los pacientes pueden llevar una vida sana y productiva depués del tratamiento de la fibrilación auricular, aunque es importante visitar al médico regularmente.",
            dato1: "- La frecuencia cardiaca se eleva o baja. La frecuencia cardiaca es la velocidad a la que late el corazón; es decir, es el número de veces que se contrae por minuto. Lo normal es que la frecuencia esté entre 60 y 100 latidos por minuto. Se produce una arritmia cuando, en condiciones normales, la frecuencia cardiaca baja (braquicardia) o se eleva (taquicardia).",
            dato2: "-El ritmo cardiaco deja de ser regular. El ritmo cardiaco se refiere a cómo se producen los latidos del corazón; si son regulares o irregulares. El ritmo cardiaco se adapta a las necesidades del organismo en cada momento. Por eso se acelera al hacer ejercicio y va más lento cuando dormimos. Pero, en condiciones normales, debe ser regular.", 
            enlace: "https://fundaciondelcorazon.com/informacion-para-pacientes/enfermedades-cardiovasculares/fibrilacion-auricular.html",
        },
        {
            titulo: "La importancia de la comida y la nutrición",
            descripcion: "El seguimiento de una dieta equilibrada constituye un pilar fundamental para la rehabilitación cardiaca. Concretamente, se ha demostrado que esta medida mejora más de un 15% la supervivencia de los pacientes cardiovasculares sin sufrir un segundo evento, descrito como infarto, angina inestable, lesión coronaria o ictus.",
            texto: "El estudio ha analizado a 399 pacientes de la Unidad de Rehabilitación Cardiaca de este centro comarcal entre los años 2008 y 2018. Todos ellos habían sufrido un evento cardiovascular y, además, el 54% padecía hipertensión arterial, el 31% tenía diabetes, el 62% dislipemia y el 51,4% fumaba. Se evaluó durante una media de 4,57 años la adopción por parte de los pacientes de una dieta saludable, práctica de ejercicio físico y adhesión al tratamiento farmacológico.",
            indicaciones: "La dieta saludable, según explica la Dra. Carmen Rus Mansilla, primera firmante de estudio, “consistió en un predominio de verduras y frutas, aceite de oliva como grasa fundamental, más pescado que carne, cereales con fibra y la eliminación total de los azúcares, la bollería industrial y los productos procesados. También se insistió en reducir la ingesta de sal a menos de 5 gr al día”. En cuanto al ejercicio físico, las recomendaciones que se dieron fueron: al menos 30 minutos al día de ejercicio moderado o bien 15 minutos al día de ejercicio vigoroso entre 5 y 7 días a la semana.",
            dato1: "La mitad de aquellos que cumplieron la dieta adecuada no sufrió ningún evento cardiovascular en 3.206 días, mientras que en el grupo de “no cumplimiento” la cifra se redujo a 2.712 días, lo que supone un 15,4% más de supervivencia sin eventos. En el caso del desempeño de ejercicio físico de manera regular, no existieron diferencias estadísticamente significativas entre ambos grupos. La adherencia al tratamiento mejoró la supervivencia libre de eventos en la mitad de los pacientes durante 3.058 días versus 2.687 (un 12% menos).",
            dato2: "“Las conclusiones de esta investigación refuerzan el papel fundamental que juega el paciente y su autocuidado en el desarrollo de la enfermedad isquémica”, apunta la Dra. Rus Mansilla. “",
            enlace: "https://secardiologia.es/comunicacion/noticias-sec/9943-la-dieta-saludable-salva-mas-vidas-que-la-adherencia-al-tratamiento-y-el-ejercicio-regular#:~:text=Concretamente%2C%20se%20ha%20demostrado%20que,inestable%2C%20lesi%C3%B3n%20coronaria%20o%20ictus",
        },
        {
            titulo: "Ejercicio y actividad física",
            descripcion: "La práctica de ejercicio de forma regular tiene innumerables beneficios sobre nuestra salud física y mental; ha demostrado mejorar todos los factores de riesgo cardiovascular.  En los pacientes afectos de FA adrenérgica la realización de ejercicio de forma regular y controlada ha demostrado disminuir el número de episodios y la tolerancia a estos. Sin embargo, para que la práctica de ejercicio físico en pacientes con FA sea segura se deberían tener en cuenta las siguientes recomendaciones:  ",
            dato1: "Si lleva tiempo sin hacer deporte, deberá iniciar su rutina de ejercicio de forma progresiva, siguiendo las indicaciones de su médico de referencia. A modo de ejemplo y suponiendo que su estado de forma física es bajo (aunque siempre se deben individualizar los casos), un protocolo de entrenamiento sencillo y progresivo podría ser: 15-20 min de ejercicio aeróbico a una intensidad baja-moderada como caminar, nadar a ritmo suave o montar en bicicleta de paseo al menos 3 días a la semana.  Si ha tolerado la rutina previa, en la tercera semana podrá aumentar de forma progresiva la duración del entrenamiento aeróbico y la intensidad y añadir a este una rutina de fuerza de baja-moderada intensidad. La intensidad del entrenamiento en el caso de pacientes con FA permanente y que por tanto presentan un ritmo cardiaco irregular no podrá realizarse a través de la frecuencia cardiaca por lo cual se recomienda basarse en sensaciones de ejercicio. Lo ideal sería realizar un trabajo un aeróbico y/o de fuerza que conlleve una sensación de ejercicio “algo duro” no extenuante.",
            dato2: "Si durante la práctica de ejercicio presenta algunos de estos síntomas: disnea, mareo, dolor torácico o palpitaciones fuertes y/o rápidas deberá parar la actividad física hasta su recuperación completa.",
            dato3: "Evite tomar bebidas estimulantes que contengan cafeína, teína o taurina, así como alcohol.",
            dato4: "Intente controlar el estrés emocional de la manera que sea más conveniente para usted, además de la práctica de ejercicio físico clásico puede introducir en su rutina ejercicios holísticos como el yoga o la meditación si eso le relaja.",
            dato5: "Acompañe este cambio de estilo de vida de ejercicio con una dieta saludable. No olvide hidratarse antes y durante la práctica de ejercicio.",
            enlace: "https://fundaciondelcorazon.com/ejercicio/ejercicio-fisico/3185-ejercicio-fisico-en-pacientes-con-fibrilacion-auricular.html",
        },
        {
            titulo: "La importancia de tomarse la medicación",
            descripcion: "La estrategia de tratamiento cubre distintos elementos así los fármacos antiarrítmicos intentan evitar la aparición de la arritmia, otros fármacos empleados lo que buscan es controlar la frecuencia cardiaca cuando la arritmia aparece y el tercer elemento de mayor importancia son los fármacos que intentan reducir una de las complicaciones más serias que son las embolias (que se explican en el apartado siguiente-Anticoagulación). Hay medicamentos, diseñados, en principio, como tratamiento de la hipertensión, que pueden reducir el número de episodios de fibrilación auricular.",
            texto: "No existe una pauta única, cada persona precisa una combinación de fármacos distinta. De hecho, en las primeras etapas del tratamiento es normal modificarlo, hasta encontrar la mejor pauta. Además, cuando las crisis son muy poco frecuentes o los síntomas muy leves, no siempre se recetan fármacos. En otros casos, sólo se toman cuando tiene lugar una crisis de fibrilación auricular.",
            indicaciones: "La mayor complicación que puede derivarse de la fibrilación auricular es la embolia. Se trata de la formación de coágulos en las aurículas, que pueden obstruir las arterias de cualquier parte del cuerpo (las piernas, el cerebro…). Para prevenir el riesgo de embolia, se recetan medicamentos anticoagulantes. Su función es hacer la sangre más líquida.",
            enlace: "https://fundaciondelcorazon.com/informacion-para-pacientes/enfermedades-cardiovasculares/fibrilacion-auricular/tratamiento-fibrilacion-auricular.html",
        },
        {
            titulo: "Cuidados personales",
            descripcion: "La frecuencia cardiaca es el número de veces que se contrae el corazón durante un minuto (latidos por minuto). Para el correcto funcionamiento del organismo es necesario que el corazón actúe bombeando la sangre hacia todos los órganos, pero además lo debe hacer a una determinada presión (presión arterial) y a una determinada frecuencia. Dada la importancia de este proceso, es normal que el corazón necesite en cada latido un alto consumo de energía.",
            texto: "Por regla general, la frecuencia normal en reposo oscila entre 50 y 100 latidos por minuto (lpm). Sin embargo hay que detallar algunos aspectos que alteran su estado",
            dato1: "-Cuando nacemos tenemos una frecuencia cardiaca elevada porque la actividad del organismo es muy intensa. A partir del primer mes de vida, va disminuyendo hasta llegar a la edad adulta, manteniéndose estable después de los 20 años.",
            dato2: "-Varía a lo largo del día y la noche y en respuesta a diversos estímulos, por lo que su medición tiene gran variabilidad.",
            dato3: "-Al realizar ejercicio físico el corazón produce una respuesta normal que es la taquicardia (la frecuencia cardiaca en reposo está por encima de 100 latidos por minuto -lpm-).",
            dato4: "-También puede producirse bradicardia (la frecuencia cardiaca está por debajo de 50 lpm).",
            texto2: "Algunos estudios realizados en poblaciones sanas, así como en pacientes hipertensos, con cardiopatía isquémica o con insuficiencia cardiaca, demuestran una asociación entre la frecuencia cardiaca y el riesgo de muerte. Según esto, cuanto mayor es la frecuencia cardiaca, menor es la expectativa de vida.",
            enlace: "https://fundaciondelcorazon.com/prevencion/marcadores-de-riesgo/frecuencia-cardiaca.html",
        },
    ];

  return (
    <div >
        <header>Información sobre la fibrilación auricular</header>

    <div className="cardcontainer" >
    {datos.map((item, index) => (
        <React.Fragment key={index}>
            {/* Renderizar la primera tarjeta */}
            <div className="card">
                <h5>{item.titulo}</h5>
                <div className="card-content">
                    <p>{item.descripcion}</p>
                    <p>{item.texto}</p>
                    <p>{item.indicaciones}</p>
                    <p>{item.dato1}</p>
                    <p>{item.dato2}</p>
                    <p>{item.dato3}</p>
                    <p>{item.dato4}</p>
                    <p>{item.dato5}</p>
                    <p>{item.dato6}</p>
                </div>
                <a href={item.enlace} target="_blank" rel="noopener noreferrer">
                    Leer más
                </a>
            </div>

            {/* Insertar la imagen solo entre la 1ª y la 2ª tarjeta */}
            {index === 0 && (
                 <div className="cardimagespeech" >
                    <img src={robot} alt="Robot" className="cardimage"  />
                    <div className="cardspeech-bubble" >{mensaje}</div>
                </div>
            )}
        </React.Fragment>
    ))}
</div>



        <div className="footer">
                {buttons.map((btn, index) => (
                    <div key={index} className="button-container">
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
                                color: btn.path === "/informacion" ? "#2fa831" : "black",
                                cursor: btn.path === "/informacion" ? "default" : "pointer",
                            }}
                            disabled={btn.path === "/informacion"}
                        >
                            {btn.icon}
                        </button>
                        {btn.label === "Editar parámetros" && showEditOptions && (
                            <div
                                className="edit-options"
                                style={{
                                    position: "absolute",
                                    width: "200px",
                                    bottom: "60px", // Ajusta la distancia desde el botón hacia arriba
                                    left: "70%", // Centra el contenedor respecto al botón
                                    transform: "translateX(-50%)", // Ajusta para que quede centrado
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Añade sombra para mejor visibilidad
                                    zIndex: 10, // Asegúrate de que esté encima de otros elementos
                                }}
                            >
                                <button onClick={() => handleOptionClick("/frecuencia")} style={{ display: "block", marginBottom: "5px" }}>
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
                                        <path d="M2 12h4l3 6 5-12 3 6h5" />
                                        <circle cx="20" cy="12" r="2" />
                                    </svg>
                                    &nbsp; &nbsp; Frecuencia
                                </button>

                                <button onClick={() => handleOptionClick("/peso")} style={{ display: "block", marginBottom: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="12" cy="10" r="3"/>
                                    <path d="M12 10v2"/>
                                    </svg>
                                    &nbsp; &nbsp; Peso
                                </button>
                                <button onClick={() => handleOptionClick("/arritmia")} style={{ display: "block", marginBottom: "5px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                                    </svg>
                                    &nbsp; &nbsp; Arritmia
                                </button>
                                <button onClick={() => handleOptionClick("/tension")} style={{ display: "block" }}>
                                <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
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
                                <button onClick={() => handleOptionClick("/medicacion")} style={{ display: "block", marginBottom: "5px" }}>
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
                                &nbsp; &nbsp; Medicación
                                </button>
                                <button onClick={() => handleOptionClick("/tomas")} style={{ display: "block", marginBottom: "5px" }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
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
    </div>
  );
};

export default Informacion;
