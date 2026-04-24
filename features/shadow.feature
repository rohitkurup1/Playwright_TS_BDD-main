Feature: Shadow elements
    Test shadow elements with playwright

  @smoke
  Scenario: Validating Shadow elements on https://selectorshub.com/shadow-dom-in-iframe/
    Given I am on url "https://selectorshub.com/shadow-dom-in-iframe/"
    When I enter "yes, i like some snacks" in Snacks field
    And I enter text in Lunch Time and Coffee Time fields
      | Lunch Time | Coffee Time |
      |   12:00 PM |     3:00 PM |
      |    1:00 PM |     4:00 PM |
      |    2:00 PM |     5:00 PM |
    Then I see "yes, i like some snacks!" in the Snacks field

  @regression
  Scenario Outline: Validating Shadow elements for <Snacks>
    Given I am on url "https://selectorshub.com/shadow-dom-in-iframe/"
    When I enter "<Snacks>" in Snacks field
    Then I see "<Snacks>" in the Snacks field

    Examples:
      | Snacks                       |
      | yes, i like some snacks      |
      | no, i don't like some snacks |
