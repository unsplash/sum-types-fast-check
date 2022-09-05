/**
 * @since 0.1.0
 */

import * as Sum from "@unsplash/sum-types"
import fc from "fast-check"
import type { Arbitrary } from "fast-check"

// We must add the `any` type argument or it won't distribute over unions for
// some reason.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Tag<A> = A extends Sum.Member<infer B, any> ? B : never
type Value<A> = A extends Sum.Member<any, infer B> ? B : never
/* eslint-enable @typescript-eslint/no-explicit-any */

type Arbs<A extends Sum.AnyMember> = {
  readonly [B in A as Tag<B>]: Arbitrary<Value<B>>
}

/**
 * An `Arbitrary` for nullary member constructors.
 *
 * @since 0.1.0
 */
export const nullaryArb: Arbitrary<null> = fc.constant(null)

/**
 * Given an `Arbitrary` instance for each member of `A`, returns an `Arbitrary`
 * instance for all `A`.
 *
 * @example
 * import { Member, create } from '@unsplash/sum-types'
 * import { getArb, nullaryArb } from '@unsplash/sum-types-fast-check'
 * import fc from 'fast-check'
 *
 * type Weather
 *   = Member<'Sun'>
 *   | Member<'Rain', number>
 *
 * const { mk: { Sun, Rain }, match } = create<Weather>()
 *
 * const arbWeather = getArb<Weather>({
 *   Sun: nullaryArb,
 *   Rain: fc.integer(),
 * })
 *
 * @since 0.1.0
 */
export const getArb = <A extends Sum.AnyMember>(
  arbs: Arbs<A>,
): Arbitrary<A> => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const tags = Object.keys(arbs) as Array<Tag<A>>
  const tagArb = fc.constantFrom(...tags)

  return (
    tagArb
      .chain(tag =>
        arbs[tag as unknown as keyof typeof arbs].map(
          val => [tag, val] as const,
        ),
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore We need a universal interface as we can't distinguish a
      // nullary constructor from a constructor that holds `null`. We happen to
      // know that the internal implementation of sum-types has the function
      // constructor always available even if the types don't say that.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map(([tag, val]): A => Sum.create<A>().mk[tag](val as unknown))
  )
}
