Feature: Schedulr allows to properly manage timer
  As a user of Schedulr
  I want to be able to start/stop the timer properly
  So that I can track my time

  Background:
    Given Schedulr is initialized

  Scenario: Start the timer
    When I start the timer
    Then The timer should be running

  Scenario: Start the timer twice
    When I start the timer
    And I start the timer
    Then The timer should be running

  Scenario: Stop the timer
    When I stop the timer
    Then The timer should not be running

  Scenario: Stop the timer twice
    When I stop the timer
    When I stop the timer
    Then The timer should not be running

