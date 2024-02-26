describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('5.17 Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })
})