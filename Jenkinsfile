pipeline {
    agent any
    tools {nodejs "NodeJS5"}

    stages {
        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv ("https://aminsep.disi.unibo.it/sonarqube"){
                }
                script {
                    def scannerHome = tool 'sonarScanner';
                    withSonarQubeEnv('sonarqube') {
                        sh "${tool("sonar-scanner")}/bin/sonar-scanner -Dsonar.projectKey=reactapp -Dsonar.projectName=reactapp"
                    }
                }
            }
        }
    }
}