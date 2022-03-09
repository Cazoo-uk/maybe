---
layout: default
title: "Result"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / Result

# Interface: Result<T, E\>

`Result<T, E>` is the type used for returning and propagating errors.
The result is either `Ok`, representing success and containing a
value, or `Err`, representing error and containing an error value.

`Ok` and `Err` are modelled as standalone classes but note these
are not exposed. You can create options using the helpers methods
exposed by `Result`.

This class is heavily inspired by Rust's Result type. This result type
is immutable, which is the main difference from the Rust original.
The following methods are present in Rust but not included in this
implementation:
- as_deref (no pointers in JS)
- as_deref_mut (no pointers in JS)
- as_mut (no pointers in JS)
- as_pin_mut (no pointers in JS)
- as_pin_ref (no pointers in JS)
- as_ref (no pointers in JS)
- clone (mutates result)
- cloned (no reliable object cloning in JS)
- copied (no pointers in JS)
- insert (mutates result)
- iter_mut (no such thing as immutable iterator)
- unwrap_or_default (no defaults in JS)

Differences compared to Rust implementation:
- [intoOkOrError](index.md#intookorerror) (`T` and `E` need not match)
- [or](index.md#or) (other result need not be of same type)
- [orElse](index.md#orelse) (other result need not be of same type)
- [unwrapOr](index.md#unwrapor) (other result need not be of same type)
- [unwrapOrElse](index.md#unwraporelse) (other result need not be of same type)

Extensions from Rust implementation:
- [apply](index.md#apply) (added to facilitate type constraints)

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of wrapped value (if ok) |
| `E` | Type of wrapped error (if err) |

## Table of contents

### Methods

- [and](index.md#and)
- [andThen](index.md#andthen)
- [apply](index.md#apply)
- [contains](index.md#contains)
- [containsErr](index.md#containserr)
- [err](index.md#err)
- [expect](index.md#expect)
- [expectErr](index.md#expecterr)
- [intoOkOrError](index.md#intookorerror)
- [isErr](index.md#iserr)
- [isOk](index.md#isok)
- [iter](index.md#iter)
- [map](index.md#map)
- [mapErr](index.md#maperr)
- [mapOr](index.md#mapor)
- [mapOrElse](index.md#maporelse)
- [ok](index.md#ok)
- [or](index.md#or)
- [orElse](index.md#orelse)
- [unwrap](index.md#unwrap)
- [unwrapErr](index.md#unwraperr)
- [unwrapOr](index.md#unwrapor)
- [unwrapOrElse](index.md#unwraporelse)

## Methods

### and

▸ **and**<`U`\>(`result`): [`Result`](index.md)<`U`, `E`\>

Returns `result` if this result is `Ok`, otherwise returns this
result.

```typescript
Result.ok(1).and(Result.ok(2));
// returns Result.ok(2)

Result.err(someError).and(Result.ok(2));
// returns Result.err(someError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of other result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | [`Result`](index.md)<`U`, `E`\> | Return this if this result is ok |

#### Returns

[`Result`](index.md)<`U`, `E`\>

#### Defined in

[src/result/result.ts:75](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L75)

___

### andThen

▸ **andThen**<`U`\>(`fn`): [`Result`](index.md)<`U`, `E`\>

Calls `fn` if the result is ok, otherwise returns this result.
This function can be used for control flow based on `Result`
values.

```typescript
Result.ok(1).andThen(value => Result.ok(value + 1));
// returns Result.ok(2)

Result.err(someError).andThen(value => Result.ok(value + 1));
// returns Result.err(someError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of other result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => [`Result`](index.md)<`U`, `E`\> | Call this with ok value |

#### Returns

[`Result`](index.md)<`U`, `E`\>

#### Defined in

[src/result/result.ts:93](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L93)

___

### apply

▸ **apply**<`U`\>(`fn`): `U`

Calls `fn` with this result and returns the outcome.

Intended to be used alongside `Result` methods that only
work with specific wrapped types. This method does not exist in
Rust because Rust can specify implementations that only apply for
certain type constraints.

```typescript
Result.ok(Result.ok(1)).apply(Option.flatten);
// returns Result.ok(1)

Result.ok(1).apply(Option.flatten);
// compile error! Result<number, unknown> is not a result of a result
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Return type of `fn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: [`Result`](index.md)<`T`, `E`\>) => `U` | Passes the result to this callback |

#### Returns

`U`

#### Defined in

[src/result/result.ts:114](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L114)

___

### contains

▸ **contains**(`value`): `boolean`

Returns true if the result is `Ok` and contains the given value.
Compares using strict equality.

```typescript
Result.ok(1).contains(1);
// true

Result.ok(1).contains(2);
// false

const a = { prop: 1 };
const b = { prop: 1 };
Result.ok(a).contains(b);
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

[src/result/result.ts:135](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L135)

___

### containsErr

▸ **containsErr**(`error`): `boolean`

Returns true if the result is `Err` and contains an error that the
matches the given value. Compares using strict equality.

```typescript
Result.err(1).containsErr(1);
// true

Result.err(1).containsErr(2);
// false

const a = { prop: 1 };
const b = { prop: 1 };
Result.err(a).containsErr(b);
// false, because objects compare by identity
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `E` | Compares against this value |

#### Returns

`boolean`

#### Defined in

[src/result/result.ts:156](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L156)

___

### err

▸ **err**(): [`Option`](../Option/index.md)<`E`\>

Converts from `Result<T, E>` to [Option](../Option/index.md)<E>. This is
an option of the error (if this result is an `Err`), else an empty
option.

```typescript
Result.ok(1).err()
// returns Option.none()

Result.err(someError).err();
// returns Option.some(someError)
```

**`since`** 0.1.0

#### Returns

[`Option`](../Option/index.md)<`E`\>

#### Defined in

[src/result/result.ts:172](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L172)

___

### expect

▸ **expect**(`message`): `T`

Returns the wrapped value if this result is `Ok`. Throws an
[UnwrapErrError](../UnwrapErrError/index.md) with the given message if called on
an `Err`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to:
- use one of [unwrapOr](index.md#unwrapor) and [unwrapOrElse](index.md#unwraporelse)
- narrow the result type using [isOk](index.md#isok) in tandem with
[IsOk.intoOk](../IsOk/index.md#intook)

```typescript
Result.ok(1).expect("It exists");
// returns 1

Result.err(someError).expect("It exists");
// throws error
```

**`since`** 0.1.0

**`throws`** {@link EmptyResultError}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Use this in the error |

#### Returns

`T`

#### Defined in

[src/result/result.ts:196](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L196)

___

### expectErr

▸ **expectErr**(`message`): `E`

Returns the wrapped error if this result is `Err`. Throws an
[UnwrapOkError](../UnwrapOkError/index.md) with the given message if called on
an `Ok`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to narrow the
result type using [isErr](index.md#iserr) in tandem with
[IsErr.intoErr](../IsErr/index.md#intoerr).

```typescript
Result.ok(1).expect("It exists");
// throws error

Result.err(someError).expect("It exists");
// returns someError
```

**`since`** 0.1.0

**`throws`** {@link ResultIsOkError}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Use this in the error |

#### Returns

`E`

#### Defined in

[src/result/result.ts:219](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L219)

___

### intoOkOrError

▸ **intoOkOrError**(): `T` \| `E`

Returns the wrapped value, no matter whether the result is `Ok` or
`Err`.

Unlike the Rust implementation, the ok and error types need not be
the same.

```typescript
Result.ok(1).intoOkOrError()
// returns 1

Result.err(someError).intoOkOrError()
// returns someError
```

**`todo`** To implement!

**`since`** 0.1.0

#### Returns

`T` \| `E`

#### Defined in

[src/result/result.ts:238](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L238)

___

### isErr

▸ **isErr**(): this is IsErr<E\>

Returns true if the result is an `Err` value. This function acts
as a type predicate.

```typescript
Result.error(someError).isErr();
// returns true

function usingPredicate(result: Result<number, Error>) {
    if (result.isErr()) {
        // compiler understands that result is `Err`
        result.intoErr();
    }
}

Result.ok(1).isErr();
// returns false
```

**`since`** 0.1.0

#### Returns

this is IsErr<E\>

#### Defined in

[src/result/result.ts:260](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L260)

___

### isOk

▸ **isOk**(): this is IsOk<T\>

Returns true if the result is an `Some` value. This function acts
as a type predicate.

```typescript
Result.ok(1).isOk();
// returns true

function usingPredicate(result: Result<number, Error>) {
    if (result.isOke()) {
        // compiler understands that result is `Ok`
        result.intoOk();
    }
}

Result.ok(1).isOk();
// returns false
```

**`since`** 0.1.0

#### Returns

this is IsOk<T\>

#### Defined in

[src/result/result.ts:282](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L282)

___

### iter

▸ **iter**(): `IterableIterator`<`T`\>

Returns an iterator over the possible value within. The iterator
contains one item if the result is `Ok`, or none if `Err`.

```typescript
const iterator = Result.ok(1).iter()
iterator.next();
// returns iterator result of 1

iterator.next();
// returns done

Result.err(someError).iter().next();
// returns done
```

**`todo`** It's not clear why this might be useful in JavaScript.
Should we remove this?

**`since`** 0.1.0

#### Returns

`IterableIterator`<`T`\>

#### Defined in

[src/result/result.ts:303](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L303)

___

### map

▸ **map**<`U`\>(`fn`): [`Result`](index.md)<`U`, `E`\>

Maps a `Result<T, E>` to `Result<U, E>` by applying a
function to the contained value.

The provided function `fn` is called if and only if the result is
an instance of `Ok`.

```typescript
Result.ok(1).map(value => value + 1);
// returns Result.ok(2)

Result.ok(1).map(value => value.toString());
// returns Result.ok("1")

Result.err(someError).map(value => value + 1);
// returns Result.err(someError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to result of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value |

#### Returns

[`Result`](index.md)<`U`, `E`\>

#### Defined in

[src/result/result.ts:326](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L326)

___

### mapErr

▸ **mapErr**<`F`\>(`fn`): [`Result`](index.md)<`T`, `F`\>

Maps a `Result<T, E>` to `Result<T, F>` by applying a
function to the contained value.

The provided function `fn` is called if and only if the result is
an instance of `Err`.

```typescript
Result.err(1).mapErr(value => value + 1);
// returns Result.err(2)

Result.err(someError).mapErr(value => new OtherError(value.message))
// returns Result.err(new OtherError("..."))

Result.ok(1).mapErr(value => value + 1);
// returns Result.err(someError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `F` | Map to result of this error type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`error`: `E`) => `F` | Call this with wrapped error |

#### Returns

[`Result`](index.md)<`T`, `F`\>

#### Defined in

[src/result/result.ts:349](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L349)

___

### mapOr

▸ **mapOr**<`U`\>(`or`, `fn`): `U`

Returns the provided default result (if `Err`), or applies a
function to the contained value (if `Ok`).

Arguments passed to `mapOr` are eagerly evaluated; if you are
passing the result of a function call, it is recommended to use
[mapOrElse](index.md#maporelse), which is lazily evaluated.

The provided function `fn` is called if and only if the result is
non-empty.

```typescript
Result.ok(1).mapOr(0, value => value + 1);
// returns Result.ok(2)

Result.ok(1).mapOr("0", value => value.toString());
// returns Result.ok("1")

Result.err(someError).mapOr(0, value => value + 1);
// returns Result.ok(0)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to result of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | `U` | Use this value if result is `Err` |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if `Ok` |

#### Returns

`U`

#### Defined in

[src/result/result.ts:377](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L377)

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`or`, `fn`): `U`

Computes a default function result (if `Err`), or applies a
different function to the contained value (if `Some`).

The function `fn` is called if and only if the result is an
instance of `Ok`. The function `or` is only called if the
result *is* empty.

```typescript
Result.ok(1).mapOrElse(() => 0, value => value + 1);
// returns Result.ok(2)

Result.ok(1).mapOrElse(() => "0", value => value.toString());
// returns Result.ok("1")

Result.err(someError).mapOrElse(() => 0, value => value + 1);
// returns Result.ok(0)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to result of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | (`error`: `E`) => `U` | Use this callback if result is `Err` |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if `Ok` |

#### Returns

`U`

#### Defined in

[src/result/result.ts:402](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L402)

___

### ok

▸ **ok**(): [`Option`](../Option/index.md)<`T`\>

Converts from `Result<T, E>` to [Option](../Option/index.md)<T>`.
This is an option of the ok value (if this result is `Ok`), else
an empty option.

```typescript
Result.ok(1).ok()
// returns Option.some(1)

Result.err(someError).ok().isSome();
// returns Option.none()
```

**`since`** 0.1.0

#### Returns

[`Option`](../Option/index.md)<`T`\>

#### Defined in

[src/result/result.ts:418](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L418)

___

### or

▸ **or**<`U`\>(`result`): [`Result`](index.md)<`T` \| `U`, `E`\>

Returns this result if it is `Ok`, otherwise returns `result`.

Arguments passed to `or` are eagerly evaluated; if you are passing
the result of a function call, it is recommended to use
[orElse](index.md#orelse), which is lazily evaluated.

```typescript
Result.ok(1).or(Result.ok(2));
// returns Result.ok(1)

Result.err(someError).or(Result.ok(2));
// returns Result.ok(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of other result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | [`Result`](index.md)<`U`, `E`\> | Return this if this result is `Err` |

#### Returns

[`Result`](index.md)<`T` \| `U`, `E`\>

#### Defined in

[src/result/result.ts:438](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L438)

___

### orElse

▸ **orElse**<`U`\>(`fn`): [`Result`](index.md)<`T` \| `U`, `E`\>

Returns the result if it is `Ok`, otherwise calls `fn` and returns
the result. The function `fn` is not called unless the result is
an `Err`.

```typescript
Result.ok(1).orElse(() => Result.ok(2));
// returns Result.ok(1)

Result.err(someError).orElse(() => Result.ok(2));
// returns Result.ok(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of ok value in callback result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`error`: `E`) => [`Result`](index.md)<`U`, `E`\> | Call this if this result is `Err` |

#### Returns

[`Result`](index.md)<`T` \| `U`, `E`\>

#### Defined in

[src/result/result.ts:456](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L456)

___

### unwrap

▸ **unwrap**(): `T`

Returns the wrapped value if this result is `Ok`. Throws an
[UnwrapErrError](../UnwrapErrError/index.md) with the given message if called on
an `Err`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to:
- use one of [unwrapOr](index.md#unwrapor) and [unwrapOrElse](index.md#unwraporelse)
- narrow the result type using [isOk](index.md#isok) in tandem with
[IsOk.intoOk](../IsOk/index.md#intook)

```typescript
Result.ok(1).unwrap()
// returns 1

Result.err(someError).unwrap();
// throws error
```

**`todo`** Should this throw the contained error?

**`since`** 0.1.0

**`throws`** {@link EmptyResultError}

#### Returns

`T`

#### Defined in

[src/result/result.ts:480](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L480)

___

### unwrapErr

▸ **unwrapErr**(): `E`

Returns the wrapped error if this result is `Err`. Throws an
[UnwrapOkError](../UnwrapOkError/index.md) with the given message if called on
an `Ok`.

As this function can throw an error, it's use is generally
discouraged outside of tests. It's always preferable to narrow the
result type using [isErr](index.md#iserr) in tandem with
[IsErr.intoErr](../IsErr/index.md#intoerr).

```typescript
Result.ok(1).unwrap();
// throws error

Result.err(someError).unwrap();
// returns someError
```

**`since`** 0.1.0

**`throws`** {@link ResultIsOkError}

#### Returns

`E`

#### Defined in

[src/result/result.ts:502](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L502)

___

### unwrapOr

▸ **unwrapOr**<`U`\>(`value`): `T` \| `U`

Returns the contained wrapped ok value (if present) or a provided
default.

Arguments passed to unwrap_or are eagerly evaluated; if you are
passing the result of a function call, it is recommended to use
[unwrapOrElse](index.md#unwraporelse), which is lazily evaluated.

```typescript
Result.ok(1).unwrapOr(0);
// returns 1

Result.err(someError).unwrapOr(0);
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
| `value` | `U` | Use this if result is `Err` |

#### Returns

`T` \| `U`

#### Defined in

[src/result/result.ts:523](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L523)

___

### unwrapOrElse

▸ **unwrapOrElse**<`U`\>(`fn`): `T` \| `U`

Returns the contained value (if present) or computes it from the
function provided. The function is not called if the result is not
an `Err`.

```typescript
Result.ok(1).unwrapOrElse(() => 0);
// returns 1

Result.err(someError).unwrapOrElse(() => 0);
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
| `fn` | (`error`: `E`) => `U` | Call this and return value if result is `Err` |

#### Returns

`T` \| `U`

#### Defined in

[src/result/result.ts:541](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/result.ts#L541)
