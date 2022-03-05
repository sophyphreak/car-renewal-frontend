describe("Map", () => {
  it("Opens popup on click", () => {
    cy.visit("/")

    cy.findByRole("img", {
      name: /randalls #1773/i,
    }).should("exist")

    cy.findByRole("img", { name: /randalls #1773/i }).click()
    cy.findByRole("button", { name: /get directions/i }).click()
  })
})
