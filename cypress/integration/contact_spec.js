import { faker } from "@faker-js/faker"

describe("Contact form", () => {
  it("Successfully submits form", () => {
    cy.visit("/")

    cy.findByRole("textbox", {
      name: /name: \*/i,
    }).type(faker.name.findName())
    cy.findByRole("textbox", {
      name: /email: \*/i,
    }).type(faker.internet.email())
    cy.findByRole("textbox", {
      name: /message: \*/i,
    }).type(faker.lorem.paragraphs())

    cy.findByRole("button", { name: /send/i }).click()
    cy.findByText(/server error occurred!/i).should("exist")
  })
})
