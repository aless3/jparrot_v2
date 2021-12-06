pipeline {
    agent any
    tools {
        SonarScanner "sonar"
    }

    stages {

        stage("SonarScanner"){
            steps {
                 dir(".") {
                    sh "sonar-scanner -Dsonar.host.url=https://aminsep.disi.unibo.it/sonarqube -Dsonar.login=c87ca362a38b9a6127143e2ca2aaa1a68b76edc7 -Dsonar.projectKey=jParrot2 -Dsonar.host.url=https://aminsep.disi.unibo.it/sonarqube -Dsonar.projectBaseDir=/var/jenkins_home/workspace/parrotTest"
                 }
            }
        }
    }
}