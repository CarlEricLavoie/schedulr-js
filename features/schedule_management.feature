Feature: Schedulr allows to properly manage and display the schedule for a day
  As a user of Schedulr
  I want to be able to retrieve my schedulr properly
  So that I can visualize the time spent on given activities

  Background:
    Given Schedulr is initialized
    And current time of day is 9:00

  Scenario: Retrieving schedule for a day with 1 activity
    When I add an activity called "test-activity"
    And I set current activity as "test-activity"
    And I start the timer
    And I wait for 30 minutes
    Then the daily schedule should have 1 activity
    And the daily schedule activity 0 should have 30 minutes spent

  Scenario: Activity spanning over multiple days
    When I add an activity called "test-activity"
    And I set current activity as "test-activity"
    And I start the timer
    And I wait for 1440 minutes
    Then the daily schedule from 0 day ago should have 1 activity
    And the daily schedule from 1 day ago should have 1 activity