import React from "react"

import {
  Box,
  Text,
  Stack,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

const Explanation = () => (
  <Stack spacing={3} mt={7}>
    <Text>
      This page was created in order to more easily find locations to renew your
      car registration on the same day. All data comes from the{" "}
      <Link
        href="https://www.hctax.net/Auto/RenewalLocations"
        color="teal.500"
        isExternal
      >
        Houston Tax Assessor-Collector's office <ExternalLinkIcon />
      </Link>
      .
    </Text>
    <Text>Additional information from the original website:</Text>
    <Box
      p={5}
      bg="#f8efff"
      as="blockquote"
      borderLeft="10px solid #c1a0e2"
      _before={{
        color: "#ccc",
        content: "open-quote",
        fontSize: "5em",
        lineHeight: "0.1em",
        marginRight: "0.25em",
        verticalAlign: "-0.4em",
      }}
    >
      <Text as="i">
        There are approximately 200 vehicle license renewal locations in Harris
        County that sell registration stickers for passenger cars, motorcycles,
        and trucks <b>with a gross weight of 54,999 lbs. or less</b>. Most of
        these service partners are grocery stores and participating AAA offices.
        These locations can help you with registration renewals as long as:
      </Text>
      <UnorderedList spacing={3} pl={10} my={3}>
        <ListItem>
          <Text as="i">
            Your vehicle registration is not more than 9 months expired.
          </Text>
        </ListItem>
        <ListItem>
          <Text as="i">
            You have current proof of insurance for the vehicle being renewed.
          </Text>
        </ListItem>
        <ListItem>
          <Text as="i">
            You have a current, passing Vehicle Inspection Report (Effective
            with March, 2016 registration expirations, this report must be{" "}
            <b>no earlier than 90 days</b> prior to the vehicle registration
            expiration)
          </Text>
        </ListItem>
        <ListItem>
          <Text as="i">You have your current renewal notice.</Text>
        </ListItem>
      </UnorderedList>
      <Text as="i">
        If you have questions concerning motor vehicle registration or license
        plates, go to our{" "}
        <Link
          href="https://www.hctax.net/Auto/AutoFAQ"
          color="teal.500"
          isExternal
        >
          Frequently Asked Questions Page <ExternalLinkIcon mx="2px" />
        </Link>
        .
      </Text>
    </Box>
  </Stack>
)

export default Explanation
