pipeline {
  agent any
  tools { nodejs 'NodeJS_20' }

  environment {
    NODE_OPTIONS = "--max_old_space_size=2048"
  }

  stages {
    stage('Checkout') {
      steps {
        echo '🔹 Cloning repository...'
        git branch: 'main', url: 'https://github.com/yoojin-suh/Walleto.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        dir('Code/walleto') {
          echo '🔹 Installing npm dependencies...'
          sh 'npm ci --legacy-peer-deps'
        }
      }
    }

    stage('Build') {
      steps {
        dir('Code/walleto') {
          echo '🔹 Building the Next.js app...'
          sh 'npm run build || echo "Build skipped or not defined"'
        }
      }
    }

    stage('Deploy') {
      steps {
        dir('Code/walleto') {
          echo 'Starting the app using PM2 (if installed)...'
          sh '''
          if ! command -v pm2 &> /dev/null; then
            npm install -g pm2
          fi
          pm2 stop all || true
          pm2 start npm --name "walleto" -- start
          pm2 save
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed. Check Jenkins logs.'
    }
  }
}
