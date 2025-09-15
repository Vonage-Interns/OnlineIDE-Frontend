

describe('SignUp Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/signup')
  })

  it('mocks signup request', () => {
    cy.intercept('POST', '**/api/auth/signup', {
      statusCode: 200,
      body: {
        message: 'Signup successful',
        data: {
          id: 1,
          firstName: 'sujan',
          lastName: 'r',
          email: 'sujan@gmail.com',
          password: 'sujan@19'
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

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/login')
  })

  it('mocks login, projects and terminal run request', () => {
    // Mock login
    cy.intercept('POST', '**/api/auth/signin', {
      statusCode: 200,
      body: {
        message: 'Login successful',
        data: {
          firstName: 'sujan',
          token: 'fake-jwt-token'
        }
      }
    }).as('mockLogin')


    cy.intercept('GET', '**/api/projects', {
      statusCode: 200,
      body: {
        data: [{ id: 1, projectName: 'Demo Project' }]
      }
    }).as('mockProjects')

    cy.intercept('POST', '**/api/code/run', {
      statusCode: 200,
      body: {
        output: "Hello World\nThis is mock terminal output"
      }
    }).as('mockTerminalRun')

    cy.intercept('POST', '**/api/projects', {
        statusCode: 200,
        body: {
            data: {
            "id":5,
            "name":"NewProj"
            }
        }
    }).as('mockCreateProject');

    cy.intercept('POST', '**/api/files', {
        statusCode: 200,
        body: {
            data: {
            "id":5,
            "name":"index.js",
            "content":'{\"1\":\"\"}'
            }
        }
    }).as('mockAddFile');


    cy.intercept('GET', '**/api/files/**', {
        statusCode: 200,
        body: {
            data: {
            "id":5,
            "name":"index.js",
            "content":'{\"1\":\"\"}'
            }
        }
    }).as('mockgetFileContent');

    cy.intercept('PUT', '**/api/files/**/content', {
        statusCode: 200,
        body: {
            data: {
            "id":5,
            "name":"index.js",
            }
        }
    }).as('mockSaveContent');


    cy.intercept('POST', '**/api/code/run', {
    statusCode: 200,
    body: {
        data: {
        output: "hello world",
        error: ""
        }
    }
    }).as('mockOutput')

   
    cy.get('input[name=email]').type('sujan@gmail.com')
    cy.get('input[name=password]').type('sujan@19')

    cy.get('#singupbutton').click()

    cy.wait('@mockLogin')
    cy.wait('@mockProjects')

    cy.url().should('include', '/compiler')

    cy.get('#project').click();
    // cy.wait(1000);
    cy.get('[data-cy="projectName"]').type("newproj{enter}");
    cy.wait('@mockCreateProject')
    
    

    // ✅ Now test sending input to terminal
    // cy.get('.input-terminal').type('node index.js{enter}')  // or whatever file you mock
    // cy.wait('@mockTerminalRun')
    // cy.contains('Hello World').should('exist')


    cy.get('.input-terminal').type('fooBar{enter}')
    // cy.wait(1000);
    // cy.contains('command not found: fooBar').should('exist')
    // cy.get('.oldInput').contains("");
    cy.get('.input-terminal').type('node index.js{enter}') 
    // cy.get('.oldInput').invoke('text').should('match', /path incorrect/i)
    // cy.wait(1000);




    

    cy.get('.input-terminal').type('clear{enter}')
    // cy.wait(1000);
    cy.get('[data-cy="wholediv"]').should('exist')
    // cy.wait(500) 
    cy.get('[data-cy="hider"]').click()
    cy.get('[data-cy="wholediv"]').should('not.exist') 
    // cy.wait(1000)
    cy.get('.folderbutton').click();
    cy.get('[data-cy="addFile"]').click()
    cy.get('[data-cy="addFileInput"]').type("index.html{enter}");
    // cy.get('[data-cy="addFileInput"]').invoke('text').should('match',/index.html/i);
    // cy.wait(1000);
    cy.get('[data-cy="addFileInput"]').clear();
    cy.get('[data-cy="addFileInput"]').type("index.js{enter}")
    cy.wait('@mockgetFileContent');
    cy.wait('@mockAddFile');
    cy.wait('@mockSaveContent');

    cy.get('[data-cy="contentInEditor"]').find('.ace_text-input').type('console.log("hello world");', { force: true })

    cy.get('.input-terminal').type('node index.js{enter}')


    cy.wait('@mockOutput')

    
    cy.get('.output-display')
      .should('contain.text', 'hello world')

    cy.get('.input-terminal').type('clear{enter}')
    cy.get('.folderbutton').click();
    cy.get('[data-cy="hider"]').click()
    cy.get('[data-cy="wholediv"]').should('not.exist') 
  })
})

