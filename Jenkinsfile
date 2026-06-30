pipeline {
    agent any

    environment {
        TF_DIR = '.'
        DOCKER_REGISTRY = 'vishnusai1/web'
        BACKEND_IMAGE = 'victus-backend'
        FRONTEND_IMAGE = 'victus-frontend'

    }

    stages {
        stage('Checkout') {
            steps {
                
                checkout scm
            }
        }

        stage('Terraform - fmt') {
            steps {
                sh "terraform fmt -recursive -check"
            }
        }

        stage('Terraform - validate') {
            steps {
                sh "terraform init -input=false -reconfigure"
                sh "terraform validate"
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
                    
                    
                    sh "docker stop victus-be-cont victus-fe-cont || true"
                    sh "docker rm victus-be-cont victus-fe-cont || true"

                    sh "docker image prune -f"

                    echo "Starting Victus Backend on port 5000..."
                    sh "docker run -d --name victus-be-cont --network host victus-backend"

                    echo "Starting Victus Frontend on port 3000..."
                    sh "docker run -d --name victus-fe-cont --network host victus-frontend"
                }
            }
        }
    }
}
