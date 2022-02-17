import { rest } from "msw"
import locations from "./fixtures/locations"

const delay = process.env.NODE_ENV === "test" ? 0 : 1500

const handlers = [
  rest.get(
    "https://car-renewal.andrew-horn-portfolio.life/api/v1/renewal-locations",
    async (_, res, ctx) => {
      return res(ctx.delay(delay), ctx.json(locations))
    }
  ),
]

export { handlers }
