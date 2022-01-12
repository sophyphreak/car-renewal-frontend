import * as React from "react"
import { TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Box, Button } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

const Map = ({ houstonPosition }) => {
  const [userLocation, setUserLocation] = React.useState([])
  const [locations, setLocations] = React.useState([])
  const map = useMap()
  const success = position => {
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
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error(err))
    navigator.geolocation.getCurrentPosition(success)
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

const sendUserToDirections = ({ userLocation, ...args }) => {
  let targetUrl
  if (userLocation.length) {
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

const generateGooglePlaceUrl = ({ address, city, zip, latitude, longitude }) =>
  `https://www.google.com/maps/place/${encodeURIComponent(
    `${address}, ${city} ${zip}`
  )}/@${latitude},${longitude}`

const generateGoogleDirectionsUrl = ({
  address,
  city,
  zip,
  latitude,
  longitude,
  userLocation: [userLatitude, userLongitude],
}) =>
  `https://www.google.com/maps/dir/${userLatitude},${userLongitude}/${encodeURIComponent(
    `${address}, ${city} ${zip}`
  )}/@${latitude},${longitude}`

const userOutsideHoustonArea = ({
  userLatitude,
  userLongitude,
  houstonPosition: [houstonLatitude, houstonLongitude],
}) => {
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

export default Map
