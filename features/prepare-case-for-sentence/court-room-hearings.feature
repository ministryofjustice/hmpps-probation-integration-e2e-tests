Feature: select a court

Scenario: I select a court
  Given I am logged in
  When I select court "Sheffield Magistrates' Court"
  Then I see the court room hearings page with defendant name "Hope Heathcote"