const API_URL = Cypress.env('BURGER_API_URL');
const BASE_URL = 'http://localhost:4000';

describe('Приложение Конструктор Бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', `${API_URL}/orders/all`, { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');

    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'testRefreshToken');
    });
    
    cy.setCookie('accessToken', 'testAccessToken');

    cy.visit(BASE_URL);
    cy.wait('@getIngredients');
  });

  it('должно быть доступно по адресу localhost:4000', () => {
    cy.url().should('include', BASE_URL);
  });

  it('должно позволять добавлять булку и ингредиенты', () => {
    cy.getByCy('empty-bun-message').should('contain', 'Выберите булки');
    cy.getByCy('empty-ingredients-message').should('contain', 'Выберите начинку');

    cy.getByCy('^bun-').first().find('button').click();
    cy.getByCy('^ingredient-').first().find('button').click();

    cy.getByCy('burger-constructor').should('contain', 'булка');
    cy.getByCy('ingredient-item').should('exist');
  });

  it('должно открывать и закрывать модальное окно ингредиента', () => {
    cy.getByCy('^bun-').first().click();
    
    cy.getByCy('ingredient-details-modal').should('be.visible');
    cy.getByCy('modal-close-button').click();
    cy.getByCy('ingredient-details-modal').should('not.exist');
  });

  it('должно создавать новый заказ', () => {
    cy.getByCy('^bun-').first().find('button').click();
    cy.getByCy('^ingredient-').first().find('button').click();

    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept('POST', `${API_URL}/orders`, newOrder).as('newOrder');

      cy.getByCy('order-submit-button').find('button').click();
      cy.wait('@newOrder');

      cy.getByCy('order-number').should('contain', newOrder.order.number);
      cy.getByCy('modal-close-button').click();

      cy.getByCy('empty-bun-message').should('contain', 'Выберите булки');
      cy.getByCy('empty-ingredients-message').should('contain', 'Выберите начинку');
    });
  });
});

Cypress.Commands.add('getByCy', (selector: string | RegExp, ...args) => {
  if (typeof selector === 'string' && selector.startsWith('^')) {
    return cy.get(`[data-cy^="${selector.slice(1)}"]`, ...args);
  }
  if (selector instanceof RegExp) {
    return cy.get('[data-cy]').filter((index, element) => selector.test(element.getAttribute('data-cy') || ''));
  }
  return cy.get(`[data-cy="${selector}"]`, ...args);
});