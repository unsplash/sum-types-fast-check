---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [getArb](#getarb)
  - [nullaryArb](#nullaryarb)

---

# utils

## getArb

Given an `Arbitrary` instance for each member of `A`, returns an `Arbitrary`
instance for all `A`.

**Signature**

```ts
export declare const getArb: <A extends Sum.AnyMember>(arbs: Arbs<A>) => fc.Arbitrary<A>
```

**Example**

```ts
import { Member, create } from '@unsplash/sum-types'
import { getArb, nullaryArb } from '@unsplash/sum-types-fast-check'
import fc from 'fast-check'

type Weather = Member<'Sun'> | Member<'Rain', number>

const {
  mk: { Sun, Rain },
  match,
} = create<Weather>()

const arbWeather = getArb<Weather>({
  Sun: nullaryArb,
  Rain: fc.integer(),
})
```

Added in v0.1.0

## nullaryArb

An `Arbitrary` for nullary member constructors.

**Signature**

```ts
export declare const nullaryArb: fc.Arbitrary<null>
```

Added in v0.1.0
