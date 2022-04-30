Feature: Getting reviews from DB

Scenario: A user enters a product info and sees the reviews
  Given A user on shop
  When I enter on a product page
  Then Info and reviews of the product are requested and displayed