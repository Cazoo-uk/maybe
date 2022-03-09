---
layout: default
title: "IsErr"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / IsErr

# Interface: IsErr<T\>

Represents an error outcome. Use [Result.isErr](../Result/index.md#iserr) to assert
that an result implements this interface.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [[OkSymbol]](index.md#[oksymbol])

### Methods

- [intoErr](index.md#intoerr)

## Properties

### [OkSymbol]

• **[OkSymbol]**: ``false``

Static property. Used to discriminate between `Ok` and `Err`.

#### Defined in

[src/result/result.ts:554](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L554)

## Methods

### intoErr

▸ **intoErr**(): `T`

Identical to [Result.unwrapErr](../Result/index.md#unwraperr) but will never throw an
error. We can provide this guarantee because this method only
exists on results that are ok.

```typescript
Result.err(someError).intoErr();
// returns someError

function realisticExample(result: Result<number, Error>) {
  if (result.isErr()) {
     const error = result.intoErr();
     // do other things...
  }
}
```

**`since`** 0.1.0

#### Returns

`T`

#### Defined in

[src/result/result.ts:574](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L574)
