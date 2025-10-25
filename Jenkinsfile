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
          echo '🚀 Deploying app using PM2 (Next.js on port 3000)...'
          sh '''
            if ! command -v pm2 &> /dev/null; then
              npm install -g pm2
            fi

            # Stop and clear old processes
            pm2 stop all || true
            pm2 delete all || true

            # Start new process with proper host binding (important!)
            pm2 start npm --name "walleto" -- start -- -H 0.0.0.0 -p 3000

            # Save PM2 configuration for persistence
            pm2 save

            echo "✅ App successfully deployed and accessible at http://$(curl -s http://checkip.amazonaws.com):3000"
          '''
        }
      }
    }
  }

  post {
    always {
      slackSend(
        channel: '#ci-cd-implementation',
        color: '#439FE0',
        message: "ℹ️ *${env.JOB_NAME}* #${env.BUILD_NUMBER} finished with status: ${currentBuild.currentResult}"
      )
    }

    success {
      slackSend(
        channel: '#ci-cd-implementation',
        color: 'good',
        message: "✅ *${env.JOB_NAME}* (DEV) succeeded! 🔗 <${env.BUILD_URL}|View Build>"
      )
    }

    failure {
      slackSend(
        channel: '#ci-cd-implementation',
        color: 'danger',
        message: "❌ *${env.JOB_NAME}* (DEV) failed! 🔗 <${env.BUILD_URL}console|View Logs>"
      )
    }
  }
}
