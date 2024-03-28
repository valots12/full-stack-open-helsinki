describe('blog app', function () {
  describe('5.17 login form is shown', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      cy.visit('')
    })

    it('check presence of login', function () {
      cy.contains('Login')
      cy.contains('username')
      cy.contains('password')
    })
  })

  describe('5.18 login', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
      cy.visit('')
    })

    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('logging in with mluukkai')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('not mluukkai')
      cy.get('#password').type('not salainen')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('5.19 when logged in', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
      cy.login({ username: user.username, password: user.password })
    })

    it('a blog can be created', function () {
      cy.get('#new-button').click()

      cy.get('#title').type('Test blog')
      cy.get('#author').type('Matti Luukkainen')
      cy.get('#url').type('test_blog.html')
      cy.get('#create-button').click()

      cy.contains('Test blog')
    })
  })

  describe('when a blog can be created', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
      cy.login({ username: user.username, password: user.password })
      cy.createBlog({
        title: 'Test blog',
        author: 'Matti Luukkainen',
        url: 'test_blog.html'
      })
    })

    it('5.20 a blog can be liked', function () {
      cy.get('#view-button').click()
      cy.get('#like-button').click()

      cy.contains('1')
    })

    it('5.21 a blog can be deleted', function () {
      cy.get('#view-button').click()
      cy.get('#delete-button').click()

      cy.contains('error deleting blog').should('not.exist')
    })

    it('5.22 ... but only by its creator', function () {
      const user = {
        name: 'John Doe',
        username: 'johndoe87',
        password: 'securePassword123'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
      cy.login({ username: user.username, password: user.password })

      cy.get('#view-button').click()
      cy.get('#delete-button').click()

      cy.contains('error deleting blog')
    })
  })

  describe('after creating the blogs', function () {
    beforeEach(function () {
      cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
      cy.login({ username: user.username, password: user.password })
      cy.createBlog({
        title: 'Test blog',
        author: 'Matti Luukkainen',
        url: 'test_blog.html'
      })

      cy.createBlog({
        title: 'Another test blog',
        author: 'Matti Luukkainen',
        url: 'another_test_blog.html'
      })
    })

    it('5.23 ... they are sorted by number of likes', function () {
      cy.get('.blog').eq(0).should('contain', 'Test blog')
      cy.get('.blog').eq(1).should('contain', 'Another test blog')

      cy.get('.blog')
        .eq(1)
        .within(() => {
          cy.get('#view-button').click()
          cy.get('#like-button').click()
        })

      cy.get('.blog').eq(0).should('contain', 'Another test blog')
      cy.get('.blog').eq(1).should('contain', 'Test blog')
    })
  })
})
