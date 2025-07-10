pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18' 
    }

    environment {
        COLLECTION_URL = credentials('POSTMAN_COLLECTION_URL')
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git 'https://github.com/tu-usuario/tu-repo.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
                sh 'npm install -g newman' 
            }
        }

        stage('Descargar colección Postman') {
            steps {
                sh 'curl -o collection.json "$COLLECTION_URL"'
            }
        }

        stage('Ejecutar pruebas con Newman') {
            steps {
                sh 'newman run collection.json' 
            }
        }
    }

    post {
        success {
            echo 'Pruebas Postman completadas con éxito.'
        }
        failure {
            echo 'Fallaron las pruebas Postman.'
        }
    }
}
