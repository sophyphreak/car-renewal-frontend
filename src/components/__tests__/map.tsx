import * as React from "react"
import { MapContainer } from "react-leaflet"
import { render, waitFor } from "@testing-library/react"
import { setupServer } from "msw/node"
import { handlers } from "../../../test/server-handlers"
import Map from "../map"
import houstonPosition from "../fixtures/houstonPosition"
import "whatwg-fetch"

const [houstonLatitude, houstonLongitude] = houstonPosition

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
afterEach(() => jest.clearAllMocks())

test("renders when location in Houston is shared", () => {
  // @ts-expect-error because I get errors when I try to do something more complicated
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((fn) =>
      fn({
        coords: {
          latitude: houstonLatitude,
          longitude: houstonLongitude,
        },
      })
    ),
  }
  render(
    <MapContainer center={houstonPosition} zoom={10} css={{ height: "50em" }}>
      <Map houstonPosition={houstonPosition} />
    </MapContainer>
  )
  expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(
    1
  )
})

test("renders when location outside Houston is shared", () => {
  // @ts-expect-error because I get errors when I try to do something more complicated
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((fn) =>
      fn({
        coords: {
          latitude: 0,
          longitude: 0,
        },
      })
    ),
  }
  render(
    <MapContainer center={houstonPosition} zoom={10} css={{ height: "50em" }}>
      <Map houstonPosition={houstonPosition} />
    </MapContainer>
  )
  expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(
    1
  )
})

test("renders markers", async () => {
  // @ts-expect-error because I get errors when I try to do something more complicated
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation(() => {}),
  }
  const { container } = render(
    <MapContainer center={houstonPosition} zoom={10} css={{ height: "50em" }}>
      <Map houstonPosition={houstonPosition} />
    </MapContainer>
  )
  await waitFor(() => {
    expect(
      container.getElementsByClassName("leaflet-marker-icon").length
    ).toBeGreaterThan(1)
  })
})
