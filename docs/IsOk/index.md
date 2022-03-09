---
layout: default
title: "IsOk"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / IsOk

# Interface: IsOk<T\>

Represents an successful outcome. Use [Result.isOk](../Result/index.md#isok) to
assert that an result implements this interface.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [[OkSymbol]](index.md#[oksymbol])

### Methods

- [intoOk](index.md#intook)

## Properties

### [OkSymbol]

• **[OkSymbol]**: ``true``

Static property. Used to discriminate between `Ok` and `Err`.

#### Defined in

[src/result/result.ts:585](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L585)

## Methods

### intoOk

▸ **intoOk**(): `T`

Identical to [Result.unwrap](../Result/index.md#unwrap) but will never throw an
error. We can provide this guarantee because this method only
exists on results that are ok.

```typescript
Result.ok(1).intoOk();
// returns 1

function realisticExample(result: Result<number, Error>) {
  if (result.isOk()) {
     const value = result.intoSome();
     // do other things...
  }
}
```

**`since`** 0.1.0

#### Returns

`T`

#### Defined in

[src/result/result.ts:605](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L605)
