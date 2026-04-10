pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls the latest code from your Git repo
                checkout scm
            }
        }

        stage('Build Backend (Flask)') {
            steps {
                dir('Backend') {
                    script {
                        echo "Building Victus Backend..."
                        sh "docker build -t victus-backend ."
                    }
                }
            }
        }

        stage('Build Frontend (Node/Express)') {
            steps {
                dir('Frontend') {
                    script {
                        echo "Building Victus Frontend..."
                        sh "docker build -t victus-frontend ."
                    }
                }
            }
        }

        stage('Deploy Victus Stack') {
            steps {
                script {
                    
                    // Stop and remove old containers if they are already running
                    sh "docker stop victus-be-cont victus-fe-cont || true"
                    sh "docker rm victus-be-cont victus-fe-cont || true"
                    sh "docker image prune -f"

                    echo "Starting Victus Backend on port 5000..."
                    sh "docker run -d --name victus-be-cont --network host -p 5000:5000 victus-backend"

                    echo "Starting Victus Frontend on port 3000..."
                    sh "docker run -d --name victus-fe-cont --network host -p 3000:3000 victus-frontend"
                }
            }
        }
    }
}
