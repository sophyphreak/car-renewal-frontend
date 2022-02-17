import * as React from "react"
import { TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Box, Button } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import Location from "../types"

const generateGooglePlaceUrl = ({
  address,
  city,
  zip,
  latitude,
  longitude,
}: Omit<Location, "store" | "telephone">): string =>
  `https://www.google.com/maps/place/${encodeURIComponent(
    `${address}, ${city} ${zip}`
  )}/@${latitude},${longitude}`

interface UserLocation {
  userLocation: [number, number]
}

interface GenerateGoogleDirectionsUrlArgs
  extends UserLocation,
    Omit<Location, "store" | "telephone"> {}

const generateGoogleDirectionsUrl = ({
  address,
  city,
  zip,
  latitude,
  longitude,
  userLocation: [userLatitude, userLongitude],
}: GenerateGoogleDirectionsUrlArgs) =>
  `https://www.google.com/maps/dir/${userLatitude},${userLongitude}/${encodeURIComponent(
    `${address}, ${city} ${zip}`
  )}/@${latitude},${longitude}`

interface SendUserToDirections
  extends UserLocation,
    Omit<Location, "store" | "telephone"> {
  defaultUserLocation: [number, number]
}

const sendUserToDirections = ({
  userLocation,
  defaultUserLocation,
  ...args
}: SendUserToDirections) => {
  let targetUrl
  if (
    userLocation[0] === defaultUserLocation[0] &&
    userLocation[1] === defaultUserLocation[1]
  ) {
    targetUrl = generateGoogleDirectionsUrl({
      userLocation,
      ...args,
    })
  } else {
    targetUrl = generateGooglePlaceUrl({
      ...args,
    })
  }
  window.open(targetUrl, "_blank")
}

interface houstonPositionType {
  houstonPosition: [number, number]
}

interface userOutsideHoustonAreaType extends houstonPositionType {
  userLatitude: number
  userLongitude: number
}

const userOutsideHoustonArea = ({
  userLatitude,
  userLongitude,
  houstonPosition: [houstonLatitude, houstonLongitude],
}: userOutsideHoustonAreaType): boolean => {
  if (userLatitude > houstonLatitude + 0.5) {
    return true
  }
  if (userLatitude < houstonLatitude - 0.5) {
    return true
  }
  if (userLongitude > houstonLongitude + 0.5) {
    return true
  }
  if (userLongitude < houstonLongitude - 0.5) {
    return true
  }
  return false
}

interface Position {
  coords: {
    latitude: number
    longitude: number
  }
}

const Map = ({ houstonPosition }: houstonPositionType) => {
  const defaultUserLocation = houstonPosition
  const [userLocation, setUserLocation] = React.useState(defaultUserLocation)
  const [locations, setLocations] = React.useState([])
  const map = useMap()
  const success = (position: Position): void => {
    const {
      coords: { latitude, longitude },
    } = position
    if (
      userOutsideHoustonArea({
        userLatitude: latitude,
        userLongitude: longitude,
        houstonPosition,
      })
    ) {
      return
    }
    map.flyTo([latitude, longitude])
    map.setZoom(12)
    setUserLocation([latitude, longitude])
  }

  React.useEffect(() => {
    fetch(
      "https://car-renewal.andrew-horn-portfolio.life/api/v1/renewal-locations"
    )
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error(err))
    global.navigator.geolocation.getCurrentPosition(success)
    return () => setLocations([]) // prevents memory leak
    // silenced because adding `success` causes infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map(
        ({ store, address, city, zip, telephone, latitude, longitude }) => (
          <Marker
            position={[latitude, longitude]}
            key={`${store} ${address} ${city} ${zip} ${telephone} ${latitude} ${longitude}`}
          >
            <Popup>
              <Box fontWeight="semibold" mb={1}>
                {store}
              </Box>
              <Box>{address}</Box>
              <Box>
                {city} {zip}
              </Box>
              <Box>{telephone}</Box>
              <Button
                variant="link"
                size="sm"
                color="teal.500"
                mt={1}
                onClick={() =>
                  sendUserToDirections({
                    address,
                    city,
                    zip,
                    latitude,
                    longitude,
                    userLocation,
                    defaultUserLocation,
                  })
                }
              >
                Get Directions <ExternalLinkIcon />
              </Button>
            </Popup>
          </Marker>
        )
      )}
    </>
  )
}

export default Map
