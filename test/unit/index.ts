/* eslint-disable functional/functional-parameters */

// On testing the outcome of randomness: Assuming even distribution, there's a
// `(1 / x) ** y` chance of not getting a particular member, where `x` is the
// number of members and `y` is the number of runs. Thus, given say 50 runs,
// it's exceptionally unlikely not to get at least one value for each member
// for any reasonably-sized sum type.
//
// This isn't much different to how fast-check itself tests distribution:
// https://github.com/dubzzz/fast-check/blob/main/test/e2e/RandomEnough.spec.ts

import fc from "fast-check"
import * as Sum from "@unsplash/sum-types"
import { getArb, nullaryArb } from "../../src/index"

describe("index", () => {
  const tag = <A extends string>(x: Sum.Member<A, unknown>): string =>
    Sum.serialize(x)[0]
  const val = <A>(x: Sum.Member<string, A>): A => Sum.serialize(x)[1]

  describe("getArb", () => {
    type Weather = Sum.Member<"Sun"> | Sum.Member<"Rain", number>
    const Weather = Sum.create<Weather>()
    const weatherArb = getArb(Weather)({
      Sun: nullaryArb,
      Rain: fc.integer(),
    })
    const sums = fc.sample(weatherArb)

    it("generates nullary values using nullary arbitrary", () => {
      expect(sums).toContainEqual(Weather.mk.Sun)
    })

    it("generates non-nullary values using provided arbitrary", () => {
      const rains = sums.filter(sum => tag(sum) === "Rain")
      expect(rains.length).toBeGreaterThan(0)

      const isNumber = (x: unknown): boolean => typeof x === "number"
      expect(rains.map(val).every(isNumber)).toBe(true)
    })

    it("generates reference-equal members", () => {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const sun = sums.find(sum => tag(sum) === "Sun")!
      const rain = sums.find(sum => tag(sum) === "Rain")!
      /* eslint-enable @typescript-eslint/no-non-null-assertion */

      expect(sun).toEqual(sun)
      expect(rain).toEqual(rain)
      expect(sun).not.toEqual(rain)
    })
  })
})
