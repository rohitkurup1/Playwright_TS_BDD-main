Feature: Compose an email in Gmail
  Verify that a user can open Gmail compose and populate the subject and body

  Scenario: Compose a message in Gmail inbox
    Given I am on Gmail inbox "https://mail.google.com/mail/u/1/#inbox"
    When I click the compose button
    And I enter the email subject "QA: Playwright/Selenium-Immediate Joiner"
    And I enter the email body in the compose window
    Then I should see the compose window with the filled subject and body
