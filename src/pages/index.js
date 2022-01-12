import * as React from "react"
import { MapContainer } from "react-leaflet"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Map from "../components/map"
import Contact from "../components/contact"

const IndexPage = () => {
  const houstonPosition = [29.7604, -95.3698]
  return (
    <Layout>
      <Seo title="Home" />
      {typeof window !== "undefined" && (
        <MapContainer
          center={houstonPosition}
          zoom={10}
          style={{ height: "50em" }}
        >
          <Map houstonPosition={houstonPosition} />
        </MapContainer>
      )}
      <br />
      <p>
        This page was created in order to more easily find locations to renew
        your car registration on the same day. All data comes from the&nbsp;
        <a href="https://www.hctax.net/Auto/RenewalLocations">
          Houston Tax Assessor-Collector's office
        </a>
        .
      </p>
      <p>Additional information from the original website:</p>
      <blockquote style={{ backgroundColor: "lightgrey", padding: "1em" }}>
        <p>
          There are approximately 200 vehicle license renewal locations in
          Harris County that sell registration stickers for passenger cars,
          motorcycles, and trucks{" "}
          <b>with a gross weight of 54,999 lbs. or less</b>. Most of these
          service partners are grocery stores and participating AAA offices.
          These locations can help you with registration renewals as long as:
        </p>
        <ul>
          <li>Your vehicle registration is not more than 9 months expired.</li>
          <li>
            You have current proof of insurance for the vehicle being renewed.
          </li>
          <li>
            You have a current, passing Vehicle Inspection Report (Effective
            with March, 2016 registration expirations, this report must be{" "}
            <b>no earlier than 90 days</b> prior to the vehicle registration
            expiration)
          </li>
          <li>You have your current renewal notice.</li>
        </ul>
        <p>
          If you have questions concerning motor vehicle registration or license
          plates, go to our{" "}
          <a href="https://www.hctax.net/Auto/AutoFAQ">
            Frequently Asked Questions Page.
          </a>
        </p>
      </blockquote>
      <Contact />
    </Layout>
  )
}

export default IndexPage
