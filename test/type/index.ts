/* eslint-disable functional/no-expression-statement */

import * as Sum from "@unsplash/sum-types"
import fc from "fast-check"
import { getArb, nullaryArb } from "../../src/index"

type A = Sum.Member<"A1"> | Sum.Member<"A2", number>

//# getArg requires correct arbs for all members
getArb<A>({ A1: nullaryArb, A2: fc.integer() }) // $ExpectType Arbitrary<A>
getArb<A>({}) // $ExpectError
getArb<A>({ A1: nullaryArb }) // $ExpectError
getArb<A>({ A2: fc.integer() }) // $ExpectError
getArb<A>({ A1: nullaryArb, A2: fc.string() }) // $ExpectError
getArb<A>({ A1: fc.string(), A2: fc.integer() }) // $ExpectError
getArb<A>({ A1: fc.constant(undefined), A2: fc.integer() }) // $ExpectError
