/* eslint-disable testing-library/prefer-user-event */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable testing-library/no-unnecessary-act */
// ^ all to silence errors related to react-hook-library https://react-hook-form.com/advanced-usage/#TestingForm

import * as React from "react"
import {
  render,
  screen,
  act,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { build, fake } from "@jackfranklin/test-data-bot"
import Contact from "../contact"
import { rest } from "msw"
import { setupServer } from "msw/node"
import "whatwg-fetch"
import "@testing-library/jest-dom"
import * as fetchUtil from "../contact/postContact"

const handlers = [
  rest.post("/", async (req, res, ctx) => {
    return res(ctx.json(req))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

interface ContactMessage {
  name: string
  email: string
  message: string
}

const buildContactForm = build<ContactMessage>({
  fields: {
    name: fake((f) => `${f.name.firstName()} ${f.name.lastName()}`),
    email: fake((f) => f.internet.email()),
    message: fake((f) => f.lorem.paragraph()),
  },
})

test("can successfully submit valid name, email, and messsage", async () => {
  const { name, email, message } = buildContactForm()

  jest.spyOn(fetchUtil, "postContact")

  render(<Contact />)

  const nameInput = screen.getByRole("textbox", {
    name: /name: \*/i,
  })
  const emailInput = screen.getByRole("textbox", {
    name: /email: \*/i,
  })
  const messageTextBox = screen.getByRole("textbox", {
    name: /message: \*/i,
  })
  const sendButton = screen.getByRole("button", {
    name: /send/i,
  })

  fireEvent.input(nameInput, { target: { value: name } })
  fireEvent.input(emailInput, { target: { value: email } })
  fireEvent.input(messageTextBox, { target: { value: message } })

  expect(screen.queryByLabelText(/success/i)).not.toBeInTheDocument()

  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(await screen.findByText(/submitting/i)).toBeInTheDocument()

  const checkmark = await screen.findByLabelText(/success/i)
  expect(checkmark).toBeInTheDocument()

  await waitForElementToBeRemoved(checkmark, {
    timeout: 2500,
  })

  expect(fetchUtil.postContact).toHaveBeenCalledWith({
    name,
    email,
    message,
  })
})
