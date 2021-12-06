pipeline {
    agent any
    tools {nodejs "NodeJS5"}

    stages {
        stage('SonarQube analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonarScanner5';
                    withSonarQubeEnv('sonarqube') {
                        sh "${tool("sonar-scanner")}/bin/sonar-scanner -Dsonar.projectKey=reactapp -Dsonar.projectName=reactapp"
                    }
                }
            }
        }
    }
}