describe('The Example App - Courses', () => {
  context('Courses - non QA', () => {
    afterEach(() => {
      cy.title().should('match', / — The Example App$/, 'Title has contextual suffix (appname)')
    })

    it('renders course overview', () => {
      cy.visit('/courses')
      cy.get('.course-card').should('have.length.gte', 2, 'renders at least 2 courses')
      cy.get('.layout-sidebar__sidebar-header > h2').should('contain', 'Categories', 'Shows category title in sidebar')
      cy.get('.sidebar-menu__list > .sidebar-menu__item:first-child').should('contain', 'All courses', 'Shows all courses link')
      cy.get('.sidebar-menu__list > .sidebar-menu__item').should('have.length.gte', 2, 'renders at least one category selector')
      cy.get('.sidebar-menu__list > .sidebar-menu__item:first-child > a').should('have.class', 'active', 'All courses is selected by default')
    })

    it('can filter course overview', () => {
      cy.visit('/courses')

      cy.get('.sidebar-menu__list > .sidebar-menu__item:nth-child(2) > a').click()
      cy.get('.sidebar-menu__list > .sidebar-menu__item:nth-child(1) > a').should('not.have.class', 'active', 'All courses link is no more active')
      cy.get('.sidebar-menu__list > .sidebar-menu__item:nth-child(2) > a').should('have.class', 'active', 'First category filter link should be active')
      cy.get('main h1').invoke('text').then((text) => console.log('headline content:', text))

      cy.get('.sidebar-menu__list > .sidebar-menu__item:nth-child(2) > a').invoke('text').then((firstCategoryTitle) => {
        cy.get('main h1').invoke('text').then((headline) => {
          expect(headline).to.match(new RegExp(`^${firstCategoryTitle} \\([0-9]+\\)$`), 'Title now contains the category name with number of courses')
        })
      })
      cy.get('.course-card').should('have.length.gte', 1, 'filtered courses contain at least one course')
    })

    it('tracks the watched state of lessons', () => {
      // Home
      cy.visit('/')

      // Navigate to courses
      cy.get('header.header .main-navigation ul > li:last-child a').click()

      // Click title of course card to open it
      cy.get('.course-card .course-card__title a').first().click()

      // Check that overview link is visited and active
      cy.get('.table-of-contents .table-of-contents__list .table-of-contents__item:nth-child(1) a')
        .should('have.class', 'active')
        .should('have.class', 'visited')
      // Check that lesson link is neither visited nor active
      cy.get('.table-of-contents .table-of-contents__list .table-of-contents__item:nth-child(2) a')
        .should('not.have.class', 'active')
        .should('not.have.class', 'visited')

      // Start first lesson
      cy.get('.course__overview a.course__overview-cta').click()
      // Check that overview link is visited but not active
      cy.get('.table-of-contents .table-of-contents__list .table-of-contents__item:nth-child(1) a')
        .should('not.have.class', 'active')
        .should('have.class', 'visited')
      // Check that lesson link is visited and active
      cy.get('.table-of-contents .table-of-contents__list .table-of-contents__item:nth-child(2) a')
        .should('have.class', 'active')
        .should('have.class', 'visited')
    })
  })

  context('Courses - QA', () => {
    before(() => {
      // Switch to QA space via url parameters
      const getParams = [
        `space_id=${Cypress.env('CONTENTFUL_QA_SPACE_ID')}`,
        `delivery_token=${Cypress.env('CONTENTFUL_QA_DELIVERY_TOKEN')}`,
        `preview_token=${Cypress.env('CONTENTFUL_QA_PREVIEW_TOKEN')}`
      ]
      cy.visit(`/courses?${getParams.join('&')}`)
    })

    it('orders courses by creation date', () => {
      cy.get('.grid-list .grid-list__item .course-card__title')
        .then(($items) => {
          const titles = Cypress._.map($items, ($item) => $item.innerText)
          const posHowTo = titles.findIndex((title) => title === 'How the example app is built')
          const posHelloWorld = titles.findIndex((title) => title === 'Hello world')

          expect(posHowTo).lt(posHelloWorld, '"How to" course is displayed before "hello world" course')
        })
    })
  })
})
