pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['test', 'uat', 'rsdev1'],
      description: 'Select the environment to run tests against'
    )
  }

  tools {
    nodejs 'Node21'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/rohitkurup1/Playwright_TS_BDD-main.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        script {
          if (params.ENV == 'test') {
            sh 'npm run test'
          } else if (params.ENV == 'uat') {
            sh 'npm run test:uat'
          } else if (params.ENV == 'rsdev1') {
            sh 'npm run test:rsdev1'
          } else {
            error "Unsupported ENV value: ${params.ENV}"
          }
        }
      }
    }
  }
}
