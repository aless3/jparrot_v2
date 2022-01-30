pipeline {
    agent any
    tools {nodejs "NodeJS5"}

    options {
        timeout(time: 1, unit: 'HOURS')   // timeout on whole pipeline job
    }

    stages {
        stage("npm install --- install necessary libraries"){
            steps {
                dir("client"){
                    sh "npm install"
                }
                dir("server"){
                    sh "npm install"
                }
            }
        }

        stage("Client tests") {
            agent any
            steps {
                dir("client"){
                    sh "npm install jest"
                    sh "npm test"
                }
            }
        }
    }
}