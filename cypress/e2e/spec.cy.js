// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })
describe('SignUp Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/signup')
  })

  it('signup button', () => {

    cy.get('#singupbutton').should('exist')

    cy.get('#singupbutton').should('contain.text', 'Sign Up')

    cy.wait(2000);
    cy.get('#singupbutton').click()

  })
  it("entering something valid",()=>{
    const firstName=cy.get('input[name=firstName]')
    firstName.type("sujan");
    cy.wait(2000);
    cy.get('#singupbutton').click();
  })
  it("entering something valid",()=>{
    const lastName=cy.get('input[name=lastName]')
    lastName.type("R");
    cy.wait(2000);
    cy.get('#singupbutton').click();
  })
  it("entering something valid",()=>{
    const email=cy.get('input[name=email]')
    email.type("sujan@gmail.com");
    cy.wait(2000);
    cy.get('#singupbutton').click();
  })
  it("entering something valid",()=>{
    const password=cy.get('input[name=password]')
    password.type("sujan@19");
    cy.wait(2000);
    cy.get('#singupbutton').click();
  })
  // it("entering all correct",()=>{
  //   const firstName=cy.get('input[name=firstName]');
  //   firstName.type("sujan");
  //   const lastName=cy.get('input[name=lastName]');
  //   lastName.type("r");
  //   const email=cy.get('input[name=email]');
  //   email.type("sujan@gmail.com");
  //   const password=cy.get('input[name=password]');
  //   password.type("sujan@19");
  //   cy.wait(3000);
  //   cy.get('#singupbutton').click()
  // })
  it('mocks signup request', () => {
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 200,
      body: {
        message: 'Signup successful',
        user: {
          id: 1,
          firstName: 'sujan',
          lastName: 'r',
          email: 'sujan@gmail.com'
        }
      }
    }).as('mockSignup')


    cy.get('input[name=firstName]').type('sujan')
    cy.get('input[name=lastName]').type('r')
    cy.get('input[name=email]').type('sujan@gmail.com')
    cy.get('input[name=password]').type('sujan@19')

  
    cy.get('#singupbutton').click()

    
    cy.wait('@mockSignup')
  })

})
