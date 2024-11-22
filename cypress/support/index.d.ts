declare namespace Cypress {
  interface Chainable {
    getByCy(selector: string | RegExp): Chainable<JQuery<HTMLElement>>
  }
}