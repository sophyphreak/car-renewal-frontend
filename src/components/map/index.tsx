import * as React from "react"
import { TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Box, Button } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import {
  userOutsideHoustonArea,
  Position,
  houstonPositionType,
  sendUserToDirections,
} from "./utils"

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
            alt={store}
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
