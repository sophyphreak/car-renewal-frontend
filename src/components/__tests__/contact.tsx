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

const delay = process.env.NODE_ENV === "test" ? 0 : 1500

const handlers = [
  rest.post("/", async (req, res, ctx) => {
    return res(ctx.delay(delay), ctx.json(req))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())

afterEach(() => server.resetHandlers())
afterEach(() => jest.clearAllMocks())

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

  await waitForElementToBeRemoved(checkmark)

  expect(fetchUtil.postContact).toHaveBeenCalledWith({
    name,
    email,
    message,
  })
})

test("react-hook-form correctly handles invalid data inputs", async () => {
  const { name, email, message } = buildContactForm()

  jest.spyOn(fetchUtil, "postContact")

  render(<Contact />)

  expect(screen.queryByText(/name is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/email is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/message is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/must be a valid email\./i)).not.toBeInTheDocument()
  expect(
    screen.queryByText(/message must be at least 5 characters long\./i)
  ).not.toBeInTheDocument()
  expect(
    screen.queryByText(/message must be 10,000 characters long or shorter\./i)
  ).not.toBeInTheDocument()

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

  // none filled in
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.getByText(/name is required\./i)).toBeInTheDocument()
  expect(screen.getByText(/email is required\./i)).toBeInTheDocument()
  expect(screen.getByText(/message is required\./i)).toBeInTheDocument()

  // only name filled in
  fireEvent.input(nameInput, { target: { value: name } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/name is required\./i)).not.toBeInTheDocument()
  expect(screen.getByText(/email is required\./i)).toBeInTheDocument()
  expect(screen.getByText(/message is required\./i)).toBeInTheDocument()

  // only email filled in
  fireEvent.input(nameInput, { target: { value: "" } })
  fireEvent.input(emailInput, { target: { value: email } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/email is required\./i)).not.toBeInTheDocument()
  expect(screen.getByText(/name is required\./i)).toBeInTheDocument()
  expect(screen.getByText(/message is required\./i)).toBeInTheDocument()

  // only message filled in
  fireEvent.input(emailInput, { target: { value: "" } })
  fireEvent.input(messageTextBox, { target: { value: message } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/message is required\./i)).not.toBeInTheDocument()
  expect(screen.getByText(/name is required\./i)).toBeInTheDocument()
  expect(screen.getByText(/email is required\./i)).toBeInTheDocument()

  // message too short
  fireEvent.input(nameInput, { target: { value: name } })
  fireEvent.input(emailInput, { target: { value: email } })
  fireEvent.input(messageTextBox, { target: { value: message.slice(0, 1) } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/name is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/email is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/message is required\./i)).not.toBeInTheDocument()
  expect(
    screen.getByText(/message must be at least 5 characters long\./i)
  ).toBeInTheDocument()

  // message is too long
  fireEvent.input(messageTextBox, { target: { value: message.repeat(1000) } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/name is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/email is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/message is required\./i)).not.toBeInTheDocument()
  expect(
    screen.getByText(/message must be 10,000 characters long or shorter\./i)
  ).toBeInTheDocument()

  // invalid email
  fireEvent.input(messageTextBox, { target: { value: message } })
  fireEvent.input(emailInput, { target: { value: name } })
  await act(async () => {
    userEvent.click(sendButton)
  })
  expect(screen.queryByText(/name is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/email is required\./i)).not.toBeInTheDocument()
  expect(screen.queryByText(/message is required\./i)).not.toBeInTheDocument()
  expect(screen.getByText(/must be a valid email\./i)).toBeInTheDocument()

  expect(fetchUtil.postContact).toHaveBeenCalledTimes(0)
})

test("handles server error, displays error message", async () => {
  server.use(
    rest.post("/", (_, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ message: "Internal server error" })
      )
    })
  )

  const { name, email, message } = buildContactForm()

  jest.spyOn(fetchUtil, "postContact")
  const originalConsoleError = console.error
  console.error = jest.fn()

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

  expect(screen.queryByText(/server error occurred!/i)).not.toBeInTheDocument()

  fireEvent.input(nameInput, { target: { value: name } })
  fireEvent.input(emailInput, { target: { value: email } })
  fireEvent.input(messageTextBox, { target: { value: message } })

  await act(async () => {
    userEvent.click(sendButton)
  })

  expect(await screen.findByText(/submitting/i)).toBeInTheDocument()
  expect(await screen.findByText(/server error occurred!/i)).toBeInTheDocument()
  expect(fetchUtil.postContact).toHaveBeenCalledWith({
    name,
    email,
    message,
  })
  expect(console.error).toHaveBeenCalledWith(
    `HTTP request failed with status 500`
  )
  console.error = originalConsoleError
})
