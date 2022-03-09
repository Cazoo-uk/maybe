---
layout: default
title: "IsSome"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / IsSome

# Interface: IsSome<T\>

Represents an option that contains a value. Use
[Option.isSome](../Option/index.md#issome) to assert that an option implements this
interface.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [[SomeSymbol]](index.md#[somesymbol])

### Methods

- [intoSome](index.md#intosome)

## Properties

### [SomeSymbol]

• **[SomeSymbol]**: ``true``

Static property. Used to discriminate between `Some` and `None`.

#### Defined in

[src/option/option.ts:583](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L583)

## Methods

### intoSome

▸ **intoSome**(): `T`

Identical to [Option.unwrap](../Option/index.md#unwrap) but will never throw an
error. We can provide this guarantee because this method only
exists on options that contain values.

```typescript
Option.some(1).intoSome();
// returns 1

function realisticExample(option: OptionLike<number>) {
  if (option.isSome()) {
     const value = option.intoSome();
     // do other things...
  }
}
```

**`since`** 0.1.0

#### Returns

`T`

#### Defined in

[src/option/option.ts:603](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L603)
