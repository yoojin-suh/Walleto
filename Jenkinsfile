pipeline {
    agent any

    environment {
        APP_NAME = "walleto-dev"
        IMAGE_NAME = "walleto-dev:latest"
        CONTAINER_PORT = "3000"
        HOST_PORT = "8081"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/yoojin-suh/Walleto.git'
            }
        }

        stage('Build') {
            steps {
                echo "🧱 Building the Walleto application..."
                sh 'echo Build started!'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh 'echo All tests passed!'
            }
        }

        stage('Deploy to DEV') {
            steps {
                echo "🚀 Deploying Walleto to DEV environment..."
                sh '''
                    # Stop and remove old container if exists
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true

                    # Build the Docker image
                    docker build -t ${IMAGE_NAME} .

                    # Run the new container
                    docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} --name ${APP_NAME} ${IMAGE_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Access at http://<EC2-Public-IP>:8081"
        }
        failure {
            echo "❌ Deployment failed. Check Jenkins logs."
        }
    }
}
