/* eslint-disable testing-library/no-container */
import * as React from "react"
import { MapContainer } from "react-leaflet"
import { render as rtlRender, waitFor, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import Map from "../map"
import houstonPosition from "../fixtures/houstonPosition"
import "whatwg-fetch"
import "@testing-library/jest-dom"
import { rest } from "msw"
import locations from "../fixtures/locations"

const delay = process.env.NODE_ENV === "test" ? 0 : 1500

const handlers = [
  rest.get(
    "https://car-renewal.andrew-horn-portfolio.life/api/v1/renewal-locations",
    async (_, res, ctx) => {
      return res(ctx.delay(delay), ctx.json(locations))
    }
  ),
]

const [houstonLatitude, houstonLongitude] = houstonPosition

Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true }) // resolve scrollTo error

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
afterEach(() => jest.clearAllMocks())

function render(ui: React.ReactElement) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MapContainer center={houstonPosition} zoom={10} css={{ height: "50em" }}>
        {children}
      </MapContainer>
    )
  }
  return rtlRender(ui, {
    wrapper: Wrapper,
  })
}

interface Coords {
  latitude: Number
  longitude: Number
}

const mockGetCurrentPosition = (coords?: Coords): void => {
  if (typeof coords === "undefined") {
    // @ts-expect-error because I get errors when I try to do something more complicated
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation(() => {}),
    }
    return
  }
  // @ts-expect-error because I get errors when I try to do something more complicated
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((fn) =>
      fn({
        coords,
      })
    ),
  }
}

test("renders when location in Houston is shared", () => {
  mockGetCurrentPosition({
    latitude: houstonLatitude,
    longitude: houstonLongitude,
  })
  render(<Map houstonPosition={houstonPosition} />)
  expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(
    1
  )
})

test("renders when location outside Houston is shared", () => {
  mockGetCurrentPosition({
    latitude: 0,
    longitude: 0,
  })
  render(<Map houstonPosition={houstonPosition} />)
  expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(
    1
  )
})

test("user can correctly interact with markers", async () => {
  mockGetCurrentPosition()
  const { container } = render(<Map houstonPosition={houstonPosition} />)
  await waitFor(() => {
    expect(
      container.getElementsByClassName("leaflet-marker-icon").length
    ).toBeGreaterThan(1)
  })
  const markers = container.getElementsByClassName("leaflet-marker-icon")
  userEvent.click(markers[0])
  expect(screen.getByText(/randalls #1773/i)).toBeInTheDocument()
  expect(screen.getByText(/2225 louisiana/i)).toBeInTheDocument()
  expect(screen.getByText(/houston/i)).toBeInTheDocument()
  expect(screen.getByText(/77002/i)).toBeInTheDocument()
  expect(screen.getByText(/\(713\) 331-1042/i)).toBeInTheDocument()
  expect(screen.getByText(/get directions/i)).toBeInTheDocument()

  window.open = jest.fn()
  userEvent.click(screen.getByText(/get directions/i))
  expect(window.open).toHaveBeenCalledWith(
    "https://www.google.com/maps/dir/29.7604,-95.3698/2225%20LOUISIANA%2C%20HOUSTON%2077002/@29.74887,-95.3743957",
    "_blank"
  )
})
