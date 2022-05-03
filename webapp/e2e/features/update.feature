Feature: Trying to update a product

Scenario: An admin user enters the webpage
  Given An user on home page
  When I go to update products (on dashboard for admins)
  Then Update view is shown