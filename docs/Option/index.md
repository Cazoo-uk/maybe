---
layout: default
title: "Option"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / Option

# Interface: Option<T\>

Type `Option` represents an optional value: every Option is either
`Some` and contains a value, or `None`, and does not.

**Note**: when exported, this interface is merged with the namespace
([https://docs/modules/Option.html](https://docs/modules/Option.html)), which contains helper methods for
creating and working with options.

`Some` and `None` are modelled as standalone classes but note these
are not exposed. You can create options using the helpers methods
exposed by `Option`.

This class is heavily inspired by Rust's Option type. This option type
is immutable, which is the main difference from the Rust original.

The following methods are present in Rust but not included in this
implementation:
- `as_deref` (no pointers in JS)
- `as_deref_mut` (no pointers in JS)
- `as_mut` (no pointers in JS)
- `as_pin_mut` (no pointers in JS)
- `as_pin_ref` (no pointers in JS)
- `as_ref` (no pointers in JS)
- `clone` (no reliable object cloning in JS)
- `cloned` (no reliable object cloning in JS)
- `copied` (no pointers in JS)
- `get_or_insert` (mutates option)
- `get_or_insert_with` (mutates option)
- `get_or_insert_default` (no defaults in JS)
- `insert` (mutates option)
- `iter_mut` (no such thing as immutable iterator)
- `replace` (mutates option)
- `take` (no pointers in JS)
- `unwrap_or_default` (no defaults in JS)

Differences compared to Rust implementation:
- [filter](index.md#filter) (can use predicate function)
- [or](index.md#or) (other option need not be of same type)
- [orElse](index.md#orelse) (other option need not be the same type)
- [unwrapOr](index.md#unwrapor) (can default to differing type)
- [unwrapOrElse](index.md#unwraporelse) (can default to differing type)
- [xor](index.md#xor) (other option need not be the same type)

Extensions from Rust implementation:
- [apply](index.md#apply) (added to facilitate type constraints)
- [IsSome.intoSome](../IsSome/index.md#intosome) (added to mirror [IsOk.intoOk](../IsOk/index.md#intook))

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of wrapped value (if present) |

## Table of contents

### Methods

- [and](index.md#and)
- [andThen](index.md#andthen)
- [apply](index.md#apply)
- [contains](index.md#contains)
- [expect](index.md#expect)
- [filter](index.md#filter)
- [isNone](index.md#isnone)
- [isSome](index.md#issome)
- [iter](index.md#iter)
- [map](index.md#map)
- [mapOr](index.md#mapor)
- [mapOrElse](index.md#maporelse)
- [okOr](index.md#okor)
- [okOrElse](index.md#okorelse)
- [or](index.md#or)
- [orElse](index.md#orelse)
- [unwrap](index.md#unwrap)
- [unwrapOr](index.md#unwrapor)
- [unwrapOrElse](index.md#unwraporelse)
- [xor](index.md#xor)
- [zip](index.md#zip)
- [zipWith](index.md#zipwith)

## Methods

### and

▸ **and**<`U`\>(`option`): [`Option`](index.md)<`U`\>

Returns None if the option is None, otherwise returns `option`.

```typescript
Option.some(1).and(Option.some(2));
// returns Option.some(2)

Option.none().and(Option.some(2));
// returns Option.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of `option` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](index.md)<`U`\> | Returns this if option is not None |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:77](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L77)

___

### andThen

▸ **andThen**<`U`\>(`fn`): [`Option`](index.md)<`U`\>

Returns None if the option is None, otherwise calls `fn` with the
wrapped value and returns the result. Some languages call this
operation flatmap.

```typescript
function toString(value: number): OptionLike<string> {
    return value.toString();
}

Option.some(1).andThen(toString);
// returns Option.some("1")
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of option returned by `fn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => [`Option`](index.md)<`U`\> | Call this with wrapped value |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:96](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L96)

___

### apply

▸ **apply**<`U`\>(`fn`): `U`

Calls `fn` with this option and returns the result.

Intended to be used alongside Option methods that only work with
specific wrapped types. This method does not exist in Rust because
Rust can specify implementations that only apply for certain type
constraints.

```typescript
Option.some(Option.some(1)).apply(Option.flatten);
// returns Option.some(1)

Option.some(1).apply(Option.flatten);
// compile error! Option<number> is not an option of an option
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Return type of `fn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`option`: [`Option`](index.md)<`T`\>) => `U` | Passes the option to this callback |

#### Returns

`U`

#### Defined in

[src/option/option.ts:117](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L117)

___

### contains

▸ **contains**(`value`): `boolean`

Returns true if the option is `Some` and contains the given value.
Compares using strict equality.

```typescript
Option.some(1).contains(1);
// true

Option.some(1).contains(2);
// false

const a = { prop: 1 };
const b = { prop: 1 };
Option.some(a).contains(b);
// false, because objects compare by identity
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | Compares against this value |

#### Returns

`boolean`

#### Defined in

[src/option/option.ts:138](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L138)

___

### expect

▸ **expect**(`message`): `T`

Returns the wrapped value. Throws an [UnwrapNoneError](../UnwrapNoneError/index.md) with
the given message if called on `None`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to:
- use one of [unwrapOr](index.md#unwrapor) and [unwrapOrElse](index.md#unwraporelse)
- narrow the option type using [isSome](index.md#issome) in tandem with
[IsSome.intoSome](../IsSome/index.md#intosome)

```typescript
Option.some(1).expect("It exists");
// returns 1

Option.none().expect("It exists");
// throws error
```

**`since`** 0.1.0

**`throws`** {@link EmptyOptionError}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Use this in the error |

#### Returns

`T`

#### Defined in

[src/option/option.ts:161](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L161)

___

### filter

▸ **filter**<`U`\>(`fn`): [`Option`](index.md)<`U`\>

Returns `None` if the option is `None`, otherwise calls the
predicate `fn` with the wrapped value and returns:
- `Some(t)` if `fn` returns true (where `t` is the wrapped value)
- `None` if `fn` returns false

The predicate function is a type guard that narrows `T` to `U`.
The resulting option is of type `U`.

```typescript
Option.some(1).filter(value => value === 1);
// returns Option.some(1);

Option.some(1).filter(value => value === 2);
// returns Option.none();

// this predicate narrows a string to a specific literal type
const predicate = (value: string): value is "hello" => {
    return value === "hello";
}

Option.some("hello").filter(predicate);
// returns option narrowed to OptionLike<"hello">

Option.none().filter(value => value === 2);
// returns Option.none()

```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Narrow wrapped value to this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => value is U | Predicate function |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:195](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L195)

▸ **filter**(`fn`): [`Option`](index.md)<`T`\>

Returns `None` if the option is `None`, otherwise calls the
predicate `fn` with the wrapped value and returns:
- `Some(t)` if `fn` returns true (where `t` is the wrapped value)
- `None` if `fn` returns false

```typescript
Option.some(1).filter(value => value === 1);
// returns Option.some(1)

Option.some(1).filter(value => value === 2);
// returns Option.none()

Option.none().filter(value => value === 2);
// returns Option.none()
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => `boolean` | Predicate function |

#### Returns

[`Option`](index.md)<`T`\>

#### Defined in

[src/option/option.ts:216](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L216)

___

### isNone

▸ **isNone**(): this is IsNone

Returns true if the option is a `None` value. This function acts
as a type predicate.

```typescript
Option.some(1).isNone();
// returns false

Option.none().isNone();
// returns true
```

**`since`** 0.1.0

#### Returns

this is IsNone

#### Defined in

[src/option/option.ts:231](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L231)

___

### isSome

▸ **isSome**(): this is IsSome<T\>

Returns true if the option is a `Some` value. This function acts
as a type predicate.

```typescript
Option.some(1).isNone();
// returns true

function usingPredicate(option: OptionLike<number>) {
    if (option.isSome()) {
        // compiler understands that option is `Some`
        option.intoSome();
    }
}

Option.none().isNone();
// returns false
```

**`since`** 0.1.0

#### Returns

this is IsSome<T\>

#### Defined in

[src/option/option.ts:253](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L253)

___

### iter

▸ **iter**(): `IterableIterator`<`T`\>

Returns an iterator over the possible value within. The iterator
contains one item if the option is `Some`, or none if `None`.

```typescript
const iterator = Option.some(1).iter()
iterator.next();
// returns iterator result of 1

iterator.next();
// returns done

Option.none().iter().next();
// returns done
```

**`todo`** It's not clear why this might be useful in JavaScript.
Should we remove this?

**`since`** 0.1.0

#### Returns

`IterableIterator`<`T`\>

#### Defined in

[src/option/option.ts:274](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L274)

___

### map

▸ **map**<`U`\>(`fn`): [`Option`](index.md)<`U`\>

Maps an `OptionLike<T>` to `OptionLike<U>` by applying a function
to the contained value.

The provided function `fn` is called if and only if the option is
non-empty.

```typescript
Option.some(1).map(value => value + 1);
// returns Option.some(2)

Option.some(1).map(value => value.toString());
// returns Option.some("1")

Option.none().map(value => value + 1);
// returns Option.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to option of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:297](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L297)

___

### mapOr

▸ **mapOr**<`U`\>(`or`, `fn`): [`Option`](index.md)<`U`\>

Returns the provided default result (if `None`), or applies a
function to the contained value (if `Some`).

Arguments passed to `mapOr` are eagerly evaluated; if you are
passing the result of a function call, it is recommended to use
[mapOrElse](index.md#maporelse), which is lazily evaluated.

The provided function `fn` is called if and only if the option is
non-empty.

```typescript
Option.some(1).mapOr(0, value => value + 1);
// returns Option.some(2)

Option.some(1).mapOr("0", value => value.toString());
// returns Option.some("1")

Option.none().mapOr(0, value => value + 1);
// returns Option.some(0)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to option of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | `U` | Use this value if option is empty |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if non-empty |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:325](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L325)

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`or`, `fn`): [`Option`](index.md)<`U`\>

Computes a default function result (if `None`), or applies a
different function to the contained value (if `Some`).

The function `fn` is called if and only if the option is non-empty.
The function `or` is only called if the option *is* empty.

```typescript
Option.some(1).mapOrElse(() => 0, value => value + 1);
// returns Option.some(2)

Option.some(1).mapOrElse(() => "0", value => value.toString());
// returns Option.some("1")

Option.none().mapOrElse(() => 0, value => value + 1);
// returns Option.some(0)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to option of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | () => `U` | Use this callback if option is empty |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if non-empty |

#### Returns

[`Option`](index.md)<`U`\>

#### Defined in

[src/option/option.ts:349](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L349)

___

### okOr

▸ **okOr**<`E`\>(`error`): [`Result`](../Result/index.md)<`T`, `E`\>

Transforms the `OptionLike<T>` into a `ResultLike<T, E>`, mapping
`Some(value)` to `Ok(value)` and `None` to `Err(error)`.

Arguments passed to `okOr` are eagerly evaluated; if you are
passing the result of a function call, it is recommended to use
[okOrElse](index.md#okorelse), which is lazily evaluated.

```typescript
const error = new Error("empty");

Option.some(1).okOr(error);
// returns Result.ok(1)

Option.none().okOr(error);
// returns Result.err(error)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `E` | Error type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `E` | Use this error value when the option is empty |

#### Returns

[`Result`](../Result/index.md)<`T`, `E`\>

#### Defined in

[src/option/option.ts:372](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L372)

___

### okOrElse

▸ **okOrElse**<`E`\>(`fn`): [`Result`](../Result/index.md)<`T`, `E`\>

Transforms the `OptionLike<T>` into a `ResultLike<T, E>`, mapping
`Some(value)` to `Ok(value)` and `None` to `Err(err())`.

The function `fn` is not called if the option is not empty.

```typescript
const error = new Error("empty");

Option.some(1).okOrElse(() => error);
// returns Result.ok(1)

Option.none().okOrElse(() => error);
// returns Result.err(error)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `E` | Error type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `E` | Use result of this callback when the option is empty |

#### Returns

[`Result`](../Result/index.md)<`T`, `E`\>

#### Defined in

[src/option/option.ts:393](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L393)

___

### or

▸ **or**<`U`\>(`option`): [`Option`](index.md)<`T` \| `U`\>

Returns the option if it contains a value, otherwise returns
`option`.

Arguments passed to `or` are eagerly evaluated; if you are passing
the result of a function call, it is recommended to use
[orElse](index.md#orelse), which is lazily evaluated.

```typescript
Option.some(1).or(Option.some(2));
// returns Option.some(1)

Option.none().or(Option.some(2));
// returns Option.some(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of wrapped value in other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](index.md)<`U`\> | Return this if this option is `None` |

#### Returns

[`Option`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/option.ts:414](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L414)

___

### orElse

▸ **orElse**<`U`\>(`fn`): [`Option`](index.md)<`T` \| `U`\>

Returns the option if it contains a value, otherwise calls `fn` and
returns the result. The function `fn` is not called unless the
option is empty.

```typescript
Option.some(1).orElse(() => Option.some(2));
// returns Option.some(1)

Option.none().orElse(() => Option.some(2));
// returns Option.some(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of wrapped value in callback result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => [`Option`](index.md)<`U`\> | Call this if this option is empty |

#### Returns

[`Option`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/option.ts:432](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L432)

___

### unwrap

▸ **unwrap**(): `T`

Returns the wrapped value. Throws an [UnwrapNoneError](../UnwrapNoneError/index.md) if
called on `None`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to:
- use one of [unwrapOr](index.md#unwrapor) and [unwrapOrElse](index.md#unwraporelse)
- narrow the option type using [isSome](index.md#issome) in tandem with
[IsSome.intoSome](../IsSome/index.md#intosome)

```typescript
Option.some(1).unwrap();
// returns 1

Option.none().unwrap();
// throws error
```

**`throws`** {@link EmptyOptionError}

**`since`** 0.1.0

#### Returns

`T`

#### Defined in

[src/option/option.ts:454](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L454)

___

### unwrapOr

▸ **unwrapOr**<`U`\>(`value`): `T` \| `U`

Returns the contained wrapped value (if present) or a provided
default.

Arguments passed to unwrap_or are eagerly evaluated; if you are
passing the result of a function call, it is recommended to use
[unwrapOrElse](index.md#unwraporelse), which is lazily evaluated.

```typescript
Option.some(1).unwrapOr(0);
// returns 1

Option.none().unwrapOr(0);
// returns 0
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of default value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `U` | Use this if option is empty |

#### Returns

`T` \| `U`

#### Defined in

[src/option/option.ts:475](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L475)

___

### unwrapOrElse

▸ **unwrapOrElse**<`U`\>(`fn`): `T` \| `U`

Returns the contained value (if present) or computes it from the
function provided. The function is not called if the option is not
empty.

```typescript
Option.some(1).unwrapOrElse(() => 0);
// returns 1

Option.none().unwrapOrElse(() => 0);
// returns 0
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type returned by callback |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `U` | Call this and return value if option is empty |

#### Returns

`T` \| `U`

#### Defined in

[src/option/option.ts:493](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L493)

___

### xor

▸ **xor**<`U`\>(`option`): [`Option`](index.md)<`T` \| `U`\>

Returns `Some` if exactly one of self and `option` is `Some`,
otherwise returns `None`.

```typescript
Option.some(1).xor(Option.some(2));
// returns Option.none()

Option.some(1).xor(Option.none());
// returns Option.some(1)

Option.none().xor(Option.some(2));
// returns Option.some(2)

Option.none().xor(Option.none());
// returns Option.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](index.md)<`T`\> | The other option |

#### Returns

[`Option`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/option.ts:516](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L516)

___

### zip

▸ **zip**<`U`\>(`option`): [`Option`](index.md)<[`T`, `U`]\>

Zips this option with another.

If self is `Some(a)` and other is `Some(b)`, this method returns
`Some([a, b])`. Otherwise, returns `None`.

```typescript
Option.some(1).zip(Option.some("a"));
// returns Option.some([1, "a"])

Option.some(1).zip(Option.none());
// returns Option.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](index.md)<`U`\> | Zip with this option |

#### Returns

[`Option`](index.md)<[`T`, `U`]\>

#### Defined in

[src/option/option.ts:535](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L535)

___

### zipWith

▸ **zipWith**<`U`, `C`\>(`option`, `fn`): [`Option`](index.md)<`C`\>

Zips this and another option with function `fn`.

If self is `Some(a)` and other is `Some(b)`, this method returns
`Some(fn(a, b))`. Otherwise returns `None`.

```typescript
Option.some(2).zipWith(Option.some(3), (a, b) => a * b);
// returns Option.some(6);

Option.some(1).zipWith(Option.none(), (a, b) => a * b);
// returns Option.none()
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |
| `C` | Type returned by callback |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](index.md)<`U`\> | Zip with this option |
| `fn` | (`a`: `T`, `b`: `U`) => `C` | Use this to combine the two wrapped values |

#### Returns

[`Option`](index.md)<`C`\>

#### Defined in

[src/option/option.ts:555](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L555)
