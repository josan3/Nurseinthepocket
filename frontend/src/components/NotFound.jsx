
const NotFound = () => {
    return (
        <div>
            <header style={styles.header}>ERROR 404</header>
            <div style={styles.subHeader}>Página no encontrada</div>
            <div style={styles.message}>Lo siento, no hemos encontrado esta página.</div>
            <a href="/" style={styles.button}>Volver al inicio</a>
        </div>
    );
};

const styles = {
    header: {
        fontSize: '5em',
        color: 'white',
        position: 'relative',  
        zIndex: 100,       
    },
    subHeader: {
        fontSize: '2em',
        zIndex: 1000,       
        position: 'relative',  
        textAlign: 'center',   
        color: 'white',
    },
    message: {
        fontSize: '1.2em',
        position: 'relative',  
        zIndex: 10000,      
        textAlign: 'center',  
        color: 'white',
    },
    button: {
        display: 'block',   
        width: '100px',
        margin: '20px auto',          
        padding: '10px 20px',
        backgroundColor: 'white',
        color: '#2fa831',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '1em',
        position: 'relative',
        zIndex: 10000,
        textAlign: 'center',           
    }
}

export default NotFound;
