import * as React from "react"

import { render } from "@testing-library/react"
import SuccessCheckmark from "../success-checkmark"

test("renders", () => {
  render(<SuccessCheckmark isOpen={true} />)
})
