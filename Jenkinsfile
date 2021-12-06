pipeline {
    agent any
    tools {nodejs "NodeJS5"}

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

        stage("SonarQube"){
            def scannerHome = tool 'SonarScanner 4.0';
            withSonarQubeEnv('-Dsonar.host.url=https://aminsep.disi.unibo.it/sonarqube -Dsonar.login=c87ca362a38b9a6127143e2ca2aaa1a68b76edc7 -Dsonar.projectKey=jParrot2 -Dsonar.host.url=https://aminsep.disi.unibo.it/sonarqube -Dsonar.projectBaseDir=/var/jenkins_home/workspace/parrotTest') { // If you have configured more than one global server connection, you can specify its name
                  sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
    }
}