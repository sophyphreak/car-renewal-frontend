import * as React from "react"

import { render } from "@testing-library/react"
import Header from "../header"

test("renders", () => {
  const { container } = render(<Header siteTitle="Default Starter" />)
  expect(container.firstChild).toMatchInlineSnapshot(`
      <header
        style="background: rebeccapurple; margin-bottom: 1.45rem;"
      >
        <div
          style="margin: 0px auto; max-width: 960px; padding: 1.45rem 1.0875rem;"
        >
          <h1
            class="chakra-heading css-dpoqzr"
          >
            <a
              href="/"
              style="color: white; text-decoration: none;"
            >
              Default Starter
            </a>
          </h1>
        </div>
      </header>
    `)
})
