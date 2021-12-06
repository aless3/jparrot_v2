pipeline {
    agent any
    tools {nodejs "NodeJS5"}

    stages {
        stage('SonarQube analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonarscan';
                        withSonarQubeEnv('sonarqube') {
                            sh "${tool("sonarscan ")}/bin/sonar-scanner -Dsonar.projectKey=reactapp -Dsonar.projectName=reactapp"
                        }
                    }
                }
            }
        }
    }
}