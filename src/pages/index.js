import * as React from "react"
import { MapContainer } from "react-leaflet"
import { Box } from "@chakra-ui/react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Map from "../components/map"
import Explanation from "../components/explanation"
import Contact from "../components/contact"

const IndexPage = () => {
  const houstonPosition = [29.7604, -95.3698]
  return (
    <Layout>
      <Seo title="Home" />
      {typeof window !== "undefined" && (
        <Box>
          <MapContainer
            center={houstonPosition}
            zoom={10}
            css={{ height: "50em" }}
          >
            <Map houstonPosition={houstonPosition} />
          </MapContainer>
        </Box>
      )}
      <Explanation />
      <Contact />
    </Layout>
  )
}

export default IndexPage
