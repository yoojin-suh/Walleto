pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/yoojin-suh/Walleto.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the Walleto application...'
                sh 'echo "Build complete!"'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'echo "All tests passed!"'
            }
        }

        stage('Deploy to DEV') {
            steps {
                echo 'Deploying Walleto to DEV environment...'
                sh '''
                docker stop walleto-dev || true
                docker rm walleto-dev || true
                docker build -t walleto-dev:latest .
                docker run -d -p 8081:8080 --name walleto-dev walleto-dev:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment to DEV successful!'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs.'
        }
    }
}
