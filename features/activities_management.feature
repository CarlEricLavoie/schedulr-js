Feature: Schedulr allows to properly manage activities
  As a user of Schedulr
  I want to be able to manage my activities
  So that I can track them

  Background:
    Given Schedulr is initialized

  Scenario: Adding an activity
    When I add an activity called "test-activity"
    Then Schedulr should have 1 activity

  Scenario: Adding multiple activities
    When I add an activity called "test-activity"
    And I add an activity called "test-activity2"
    Then Schedulr should have 2 activities

  Scenario: Cannot add multiple activities with same name
    When I add an activity called "test-activity"
    And I add an activity called "test-activity"
    Then Schedulr should have 1 activity

  Scenario: Removing an existing activity
    When I add an activity called "test-activity"
    And I remove an activity called "test-activity"
    Then Schedulr should have 0 activities

  Scenario: Removing an activity that does not exist
    And I remove an activity called "test-activity"
    Then Schedulr should have 0 activities

  Scenario: Retrieving activity by name
    When I add an activity called "test-activity"
    Then Schedulr should have an activity named "test-activity"

  Scenario: Retrieving the current activity
    When I add an activity called "test-activity"
    And I set current activity as "test-activity"
    Then The current activity should be named "test-activity"

  Scenario: I add 2 activities
    When I add an activity called "test-activity"
    And I add an activity called "test-activity2"
    Then Schedulr should have 2 activities