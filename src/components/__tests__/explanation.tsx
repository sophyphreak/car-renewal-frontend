import * as React from "react"

import { render, screen } from "@testing-library/react"
import Explanation from "../explanation"
import "@testing-library/jest-dom"

test("links have correct href attributes", () => {
  render(<Explanation />)

  expect(
    screen.getByRole("link", {
      name: /houston tax assessor-collector's office/i,
    })
  ).toHaveAttribute("href", "https://www.hctax.net/Auto/RenewalLocations")

  expect(
    screen.getByRole("link", {
      name: /frequently asked questions page/i,
    })
  ).toHaveAttribute("href", "https://www.hctax.net/Auto/AutoFAQ")
})
