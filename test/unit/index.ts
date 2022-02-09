/* eslint-disable functional/functional-parameters */

// On testing the outcome of randomness: Assuming even distribution, there's a
// `(1 / x) ** y` chance of not getting a particular member, where `x` is the
// number of members and `y` is the number of runs. Thus, given say 50 runs,
// it's exceptionally unlikely not to get at least one value for each member
// for any reasonably-sized sum type.
//
// This isn't much different to how fast-check itself tests distribution:
// https://github.com/dubzzz/fast-check/blob/main/test/e2e/RandomEnough.spec.ts

// Beware that `toEqual` and friends don't play very nicely with sum types as
// they use `Proxy` under the hood, thus we should instead test against
// their serialized forms.

import fc from "fast-check"
import * as Sum from "@unsplash/sum-types"
import { getArb, nullaryArb } from "../../src/index"

describe("index", () => {
  const tag = <A>(x: readonly [A, unknown]): A => x[0]
  const val = <A>(x: readonly [unknown, A]): A => x[1]

  describe("getArb", () => {
    type Weather = Sum.Member<"Sun"> | Sum.Member<"Rain", number>
    const Weather = Sum.create<Weather>()
    const weatherArb = getArb<Weather>({
      Sun: nullaryArb,
      Rain: fc.integer(),
    })
    const sums = fc.sample(weatherArb).map(Sum.serialize)

    it("generates nullary values using nullary arbitrary", () => {
      expect(sums).toContainEqual(["Sun", null])
    })

    it("generates non-nullary values using provided arbitrary", () => {
      const rains = sums.filter(sum => tag(sum) === "Rain")
      expect(rains.length).toBeGreaterThan(0)

      const isNumber = (x: unknown): boolean => typeof x === "number"
      expect(rains.map(val).every(isNumber)).toBe(true)
    })
  })
})
