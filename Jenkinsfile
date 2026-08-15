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
      cucumber fileIncludePattern: 'reports/cucumber_report.json'
      archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
    }

    failure {
      script {
        def issue = [
          fields: [
            project: [key: 'YOUR_PROJECT_KEY'],
            summary: "Test Failure in ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            description: "Automated test run failed.\n\nBuild URL: ${env.BUILD_URL}\nEnvironment: ${params.ENV}\n\nCheck console output and Cucumber report for details.",
            issuetype: [name: 'Bug']
          ]
        ]
        def response = jiraNewIssue issue: issue, site: 'DemoProject'
        echo "Created Jira issue: ${response.data.key}"
      }
    }
  }
}