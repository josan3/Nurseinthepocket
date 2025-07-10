pipeline {
    agent any

    tools {
        nodejs 'NodeJS_18' 
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/josan3/Nurseinthepocket.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
                sh 'npm install -g newman'
            }
        }

        stage('Ejecutar pruebas con Newman') {
            steps {
                sh 'newman run NurseinthePocket.postman_collection.json'
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
