Feature: Getting orders of a user from DB

Scenario: A logged user wants to see its orders
  Given A logged user on the app
  When I go to orders tab on dashboard
  Then My orders from the DB are displayed