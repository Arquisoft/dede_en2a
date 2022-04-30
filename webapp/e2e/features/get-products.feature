Feature: Getting products from DB

Scenario: A user enters the webpage
  Given A user on home page
  When I go to shop section
  Then Products from the DB are displayed