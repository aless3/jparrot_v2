pipeline {
    agent any
    tools {nodejs "NodeJS5"}
    stages {
        stage("npm install"){
            steps {
                dir("client"){
                    sh "npm install"
                }
                dir("server"){
                    sh "npm install"
                }
            }
        }

        stage("client test") {
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
