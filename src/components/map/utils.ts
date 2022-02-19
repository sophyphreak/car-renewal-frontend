import Location from "../../types"

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

export const sendUserToDirections = ({
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

export interface houstonPositionType {
  houstonPosition: [number, number]
}

interface userOutsideHoustonAreaType extends houstonPositionType {
  userLatitude: number
  userLongitude: number
}

export const userOutsideHoustonArea = ({
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

export interface Position {
  coords: {
    latitude: number
    longitude: number
  }
}
