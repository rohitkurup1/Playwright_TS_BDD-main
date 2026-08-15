pipeline {
  agent any

  parameters {
    choice(
      name: 'ENV',
      choices: ['test', 'uat', 'rsdev1'],
      description: 'Select the environment to run tests against'
    )
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/rohitkurup1/Playwright_TS_BDD-main.git'
      }
    }
stage('Install Playwright Browsers') {
  steps {
    bat 'npx playwright install'
  }
}
    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        script {
          if (params.ENV == 'test') {
            bat 'npm run test'
          } else if (params.ENV == 'uat') {
            bat 'npm run test:uat'
          } else if (params.ENV == 'rsdev1') {
            bat 'npm run test:rsdev1'
          } else {
            error "Unsupported ENV value: ${params.ENV}"
          }
        }
      }
    }
  }
   post {
    always {
      // Publish Cucumber HTML/JSON report (Cucumber reports plugin)
      cucumber fileIncludePattern: 'reports/cucumber_report.json'

      // Archive raw report files (json + html) so they're downloadable from the build page
      archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
    }
  }
}