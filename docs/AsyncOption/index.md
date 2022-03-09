---
layout: default
title: "AsyncOption"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / AsyncOption

# Class: AsyncOption<T\>

Type `AsyncOption` represents an optional value that will be the
result of a promise. In other words, it represents an optional value
where that value isn't yet known.

`AsyncOption` is not represented by `Some` and `None` in the same way
as [Option](../Option/index.md). We can't know which it is: as the wrapped value
is the result of a promise, we don't know whether it will be there or
not when the `AsyncOption` is created.

`AsyncOption` is more ergonomic than [Option](../Option/index.md) whenever a
promise is involved. See this (slightly contrived) example:

```typescript
// using promises

function fetchApiKey(): Promise<Option<string>> {
    // does something async
}

function fetchUsers(key: string): Promise<Option<User[]>> {
   // does something async with API key
}

async function sumItemValues(): Promise<number> {
    const maybeKey = await fetchApiKey();

    if (maybeKey.isNone()) {
         return 0;
    }

    return (await fetchData(maybeKey.intoSome()))
        .map(sumItems)
        .unwrapOr(0);
}

// using AsyncOption

function fetchApiKey(): AsyncOption<string> {
    // does something async
}

function fetchData(key: string): AsyncOption<Item[]> {
   // does something async with API key
}

function sumItemValues(): Promise<number> {
    return fetchApiKey
        .andThen(fetchData)
        .map(sumItems)
        .unwrapOr(0);
}
```
This example is contrived because we would probably want to use an
[AsyncResult](../AsyncResult/index.md) in this situation. It nonetheless shows how
`AsyncOption` can make asynchronous code more concise!

`AsyncOption` exposes a very similar interface to [Option](../Option/index.md).
The key difference is that every `AsyncOption` method is async in some
way. If [Option](../Option/index.md) returns a plain value, `AsyncOption` will
return a promise of a plain value. If an [Option](../Option/index.md) method
wants another option. `AsyncOption` will want another async option.

There is another small difference: the async version does not
implement [Option.apply](../Option/index.md#apply) but rather exposes a method called
[AsyncOption.transform](index.md#transform).

It's prudent to assume that most async operations have a chance of
failing. It usually makes more sense to represent async outcomes
using {@like AsyncResult} if you have a choice.

We include `AsyncOption` for two reasons:
- it's needed to support methods like [AsyncResult.ok](../AsyncResult/index.md#ok)
- it can be used to handle the results of async operations in an
ergonomic way

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](index.md#constructor)

### Methods

- [and](index.md#and)
- [andThen](index.md#andthen)
- [asPromise](index.md#aspromise)
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
- [transform](index.md#transform)
- [unwrap](index.md#unwrap)
- [unwrapOr](index.md#unwrapor)
- [unwrapOrElse](index.md#unwraporelse)
- [xor](index.md#xor)
- [zip](index.md#zip)
- [zipWith](index.md#zipwith)
- [fromOption](index.md#fromoption)
- [fromPromise](index.md#frompromise)
- [none](index.md#none)
- [some](index.md#some)

## Constructors

### constructor

• **new AsyncOption**<`T`\>(`promise`)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<[`Option`](../Option/index.md)<`T`\>\> |

#### Defined in

[src/option/async-option.ts:81](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L81)

## Methods

### and

▸ **and**<`U`\>(`option`): [`AsyncOption`](index.md)<`U`\>

 [Option.and](../Option/index.md#and) but accepts and returns an async
option instead.

```typescript
AsyncOption.some(1).and(AsyncOption.some(2));
// returns AsyncOption.some(2)

AsyncOption.none().and(AsyncOption.some(2));
// returns AsyncOption.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of other option value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`AsyncOption`](index.md)<`U`\> | The other option |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:159](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L159)

___

### andThen

▸ **andThen**<`U`\>(`fn`): [`AsyncOption`](index.md)<`U`\>

 [Option.andThen](../Option/index.md#andthen) but:
- accepts a callback that returns an [AsyncOption](index.md)
- also returns an [AsyncOption](index.md)

```typescript
AsyncOption.some(1).andThen(v => AsyncOption.some(v + 1));
// returns AsyncOption.some(2);

AsyncOption.none().andThen(v => AsyncOption.some(v + 1));
// returns AsyncOption.none();
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped value of [AsyncOption](index.md) returned by `fn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => [`AsyncOption`](index.md)<`U`\> | Calls this with deferred value |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:179](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L179)

___

### asPromise

▸ **asPromise**(): `Promise`<[`Option`](../Option/index.md)<`T`\>\>

Exposes the underlying promise of an option. There is no need to
use this method under normal circumstances!

```typescript
AsyncOption.some(1)
  .asPromise()
  .then(option => option.isSome())

// resolves to true
```

**`todo`** Should we expose this method at all?

**`since`** 0.1.0

#### Returns

`Promise`<[`Option`](../Option/index.md)<`T`\>\>

#### Defined in

[src/option/async-option.ts:203](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L203)

___

### contains

▸ **contains**(`value`): `Promise`<`boolean`\>

 [Option.contains](../Option/index.md#contains) but returns a promise of a
boolean, rather than a boolean.

```typescript
AsyncOption.some(1).contains(1);
// resolves to true

AsyncOption.none().contains(1);
// resolves to false
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | Check for this value |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/option/async-option.ts:221](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L221)

___

### expect

▸ **expect**(`message`): `Promise`<`T`\>

 [Option.expect](../Option/index.md#expect) but returns a promise. If `Some`,
the promise resolves with the wrapped value, else it rejects with
an error.

```typescript
AsyncOption.some(1).expect("failure");
// resolves to 1

AsyncOption.none().expect("failure");
// rejects
```

**`since`** 0.1.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[src/option/async-option.ts:240](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L240)

___

### filter

▸ **filter**<`U`\>(`fn`): [`AsyncOption`](index.md)<`U`\>

 [Option.filter](../Option/index.md#filter) but returns an async option.

```typescript
AsyncOption.some(1).filter(value => value === 1);
// returns AsyncOption.some(1)

AsyncOption.some(1).filter(value => value === 2);
// returns AsyncOption.none()

// this predicate narrows a string to a specific literal type
const predicate = (value: string): value is "hello" => {
    return value === "hello";
}

AsyncOption.some("hello").filter(predicate);
// returns option narrowed to AsyncOption<"hello">

AsyncOption.none().filter(value => value === 2);
// returns Option.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Narrow option to this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => value is U | Call this with wrapped value |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:269](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L269)

▸ **filter**(`fn`): [`AsyncOption`](index.md)<`T`\>

 [Option.filter](../Option/index.md#filter) but returns an async option.

```typescript
AsyncOption.some(1).filter(value => value === 1);
// returns AsyncOption.some(1)

AsyncOption.§some(1).filter(value => value === 2);
// returns AsyncOption.none()

AsyncOption.none().filter(value => value === 2);
// returns Option.none()
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => `boolean` | Call this with wrapped value |

#### Returns

[`AsyncOption`](index.md)<`T`\>

#### Defined in

[src/option/async-option.ts:287](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L287)

___

### isNone

▸ **isNone**(): `Promise`<`boolean`\>

 [Option.isNone](../Option/index.md#isnone) but returns a promise of a boolean.
This function cannot be used to for type narrowing because this is
not possible with asynchronous code.

```typescript
AsyncOption.some(1).isNone();
// resolves to false

AsyncOption.none().isNone();
// resolves to true
```

**`since`** 0.1.0

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/option/async-option.ts:309](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L309)

___

### isSome

▸ **isSome**(): `Promise`<`boolean`\>

 [Option.isSome](../Option/index.md#issome) but returns a promise of a boolean.
This function cannot be used to for type narrowing because this is
not possible with asynchronous code.

```typescript
AsyncOption.some(1).isSome();
// resolves to true

AsyncOption.none().isSome();
// resolves to false
```

**`since`** 0.1.0

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/option/async-option.ts:327](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L327)

___

### iter

▸ **iter**(): `Promise`<`IterableIterator`<`T`\>\>

 [Option.iter](../Option/index.md#iter) but returns a promise of an
iterator.

```typescript
const iterator = await AsyncOption.some(1).iter();

iterator.next();
// return iterator result of 1

iterator.next();
// done

AsyncOption.none().iter().then(iterator => iterator.next());
// resolves to done
```

**`since`** 0.1.0

#### Returns

`Promise`<`IterableIterator`<`T`\>\>

#### Defined in

[src/option/async-option.ts:349](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L349)

___

### map

▸ **map**<`U`\>(`fn`): [`AsyncOption`](index.md)<`U`\>

 [Option.map](../Option/index.md#map) but returns an async option.

```typescript
AsyncOption.some(1).map(value => value + 1);
// returns AsyncOption.some(2)

AsyncOption.none().map(value => value + 1);
// returns AsyncOption.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Callback returns this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => `U` | Call wrapped value with this |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:367](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L367)

___

### mapOr

▸ **mapOr**<`U`\>(`or`, `fn`): [`AsyncOption`](index.md)<`U`\>

 [Option.mapOr](../Option/index.md#mapor) but returns an async option.

```typescript
AsyncOption.some(1).mapOr(0, value => value + 1);
// returns AsyncOption.some(1)

AsyncOption.none().mapOr(0, value => value + 1);
// returns AsyncOption.some(0)
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

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:388](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L388)

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`or`, `fn`): [`AsyncOption`](index.md)<`U`\>

 [Option.mapOrElse](../Option/index.md#maporelse) but returns an async option.

```typescript
AsyncOption.some(1).mapOrElse(() => 0, value => value + 1);
// returns AsyncOption.some(1)

AsyncOption.none().mapOrElse(() => 0, value => value + 1);
// returns AsyncOption.some(0)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map tp option of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | () => `U` | Call this if wrapped value is empty |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if non-empty |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:409](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L409)

___

### okOr

▸ **okOr**<`E`\>(`error`): [`AsyncResult`](../AsyncResult/index.md)<`T`, `E`\>

 [Option.okOr](../Option/index.md#okor) but returns an [AsyncResult](../AsyncResult/index.md).

```typescript
const error = new Error("failure");

AsyncOption.some(1).okOr(error);
// returns AsyncResult.ok(1)

AsyncOption.none().okOr(error);
// returns AsyncResult.err(error)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `E` | Error type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `E` | Return result of this error if option is empty |

#### Returns

[`AsyncResult`](../AsyncResult/index.md)<`T`, `E`\>

#### Defined in

[src/option/async-option.ts:431](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L431)

___

### okOrElse

▸ **okOrElse**<`E`\>(`fn`): [`AsyncResult`](../AsyncResult/index.md)<`T`, `E`\>

 [Option.okOrElse](../Option/index.md#okorelse) but returns an [AsyncResult](../AsyncResult/index.md).

```typescript
const error = new Error("failure");

AsyncOption.some(1).okOrElse(() => error);
// returns AsyncResult.ok(1)

AsyncOption.none().okOrElse(() => error);
// returns AsyncResult.err(error)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `E` | Error type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `E` | Create result from this callback if option is empty |

#### Returns

[`AsyncResult`](../AsyncResult/index.md)<`T`, `E`\>

#### Defined in

[src/option/async-option.ts:453](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L453)

___

### or

▸ **or**<`U`\>(`option`): [`AsyncOption`](index.md)<`T` \| `U`\>

 [Option.or](../Option/index.md#or) but accepts an async option and also
returns an async option.

```typescript
AsyncOption.some(1).or(AsyncOption.some(2));
// returns AsyncOption.some(1)

AsyncOption.none().or(AsyncOption.some(2));
// returns AsyncOption.some(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of wrapped value in other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`AsyncOption`](index.md)<`U`\> | Return this if this option is `None` |

#### Returns

[`AsyncOption`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/async-option.ts:474](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L474)

___

### orElse

▸ **orElse**<`U`\>(`fn`): [`AsyncOption`](index.md)<`T` \| `U`\>

 [Option.orElse](../Option/index.md#orelse) but:
- accepts a function that returns an async option
- itself returns an async option.

```typescript
AsyncOption.some(1).orElse(() => AsyncOption.some(2));
// returns AsyncOption.some(1)

AsyncOption.none().orElse(() => AsyncOption.some(2));
// returns AsyncOption.some(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of wrapped value in callback result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => [`AsyncOption`](index.md)<`U`\> | Call this if this option is empty |

#### Returns

[`AsyncOption`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/async-option.ts:494](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L494)

___

### transform

▸ **transform**<`U`\>(`fn`): [`AsyncOption`](index.md)<`U`\>

Call the provided function with a synchronous version of this
option. This fulfils the same role as [Option.apply](../Option/index.md#apply), in
that it can be used to apply a function to this option.

```typescript
const nested = AsyncOption.some(Option.some(1))
nested.transform(Option.flatten);
// returns AsyncOption.some(1)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Returns async option of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: [`Option`](../Option/index.md)<`T`\>) => [`Option`](../Option/index.md)<`U`\> | Call this the inner option |

#### Returns

[`AsyncOption`](index.md)<`U`\>

#### Defined in

[src/option/async-option.ts:516](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L516)

___

### unwrap

▸ **unwrap**(): `Promise`<`T`\>

 [Option.unwrap](../Option/index.md#unwrap) but returns a promise. If `Some`,
the promise resolves with the wrapped value, else it rejects with
an error.

```typescript
AsyncOption.some(1).unwrap();
// resolves to 1

AsyncOption.none().unwrap();
// rejects
```

**`since`** 0.1.0

**`throws`** {@link EmptyOptionError}

#### Returns

`Promise`<`T`\>

#### Defined in

[src/option/async-option.ts:535](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L535)

___

### unwrapOr

▸ **unwrapOr**<`U`\>(`value`): `Promise`<`T` \| `U`\>

 [Option.unwrapOr](../Option/index.md#unwrapor) but returns a promise. The promise
resolves with the wrapped value or the default.

```typescript
AsyncOption.some(1).unwrapOr(0);
// resolves to 1

AsyncOption.none().unwrapOr(0);
// resolves to 0
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Type of default value |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `U` |

#### Returns

`Promise`<`T` \| `U`\>

#### Defined in

[src/option/async-option.ts:553](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L553)

___

### unwrapOrElse

▸ **unwrapOrElse**<`U`\>(`fn`): `Promise`<`T` \| `U`\>

 [Option.unwrapOrElse](../Option/index.md#unwraporelse) but returns a promise. The
promise resolves with the wrapped value or the result of the
callback.

```typescript
AsyncOption.some(1).unwrapOrElse(() => 0);
// returns 1

AsyncOption.none().unwrapOrElse(() => 0);
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

`Promise`<`T` \| `U`\>

#### Defined in

[src/option/async-option.ts:573](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L573)

___

### xor

▸ **xor**<`U`\>(`option`): [`AsyncOption`](index.md)<`T` \| `U`\>

 [Option.xor](../Option/index.md#xor) but accepts an async option and also
returns an async option.

```typescript
AsyncOption.some(1).xor(AsyncOption.some(2));
// returns AsyncOption.none()

AsyncOption.some(1).xor(AsyncOption.none());
// returns AsyncOption.some(1)

AsyncOption.none().xor(AsyncOption.some(2));
// returns AsyncOption.some(2)

AsyncOption.none().xor(AsyncOption.none());
// returns AsyncOption.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`AsyncOption`](index.md)<`T`\> | The other option |

#### Returns

[`AsyncOption`](index.md)<`T` \| `U`\>

#### Defined in

[src/option/async-option.ts:598](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L598)

___

### zip

▸ **zip**<`U`\>(`option`): [`AsyncOption`](index.md)<[`T`, `U`]\>

 [Option.zip](../Option/index.md#zip) but accepts an async option and also
returns an async option.

```typescript
AsyncOption.some(1).zip(AsyncOption.some("a"));
// returns AsyncOption.some([1, "a"])

AsyncOption.some(1).zip(AsyncOption.none());
// returns AsyncOption.none()
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`AsyncOption`](index.md)<`U`\> | Zip with this option |

#### Returns

[`AsyncOption`](index.md)<[`T`, `U`]\>

#### Defined in

[src/option/async-option.ts:617](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L617)

___

### zipWith

▸ **zipWith**<`U`, `C`\>(`option`, `fn`): [`AsyncOption`](index.md)<`C`\>

 [Option.zipWith](../Option/index.md#zipwith) but accepts an async option and
also returns an async option.

```typescript
AsyncOption.some(2).zipWith(AsyncOption.some(3), (a, b) => a * b);
// returns AsyncOption.some(6);

AsyncOption.some(1).zipWith(AsyncOption.none(), (a, b) => a * b);
// returns AsyncOption.none()
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Wrapped type of other option |
| `C` | Type returned by callback |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`AsyncOption`](index.md)<`U`\> | Zip with this option |
| `fn` | (`a`: `T`, `b`: `U`) => `C` | Use this to combine the two wrapped values |

#### Returns

[`AsyncOption`](index.md)<`C`\>

#### Defined in

[src/option/async-option.ts:637](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L637)

___

### fromOption

▸ `Static` **fromOption**<`T`\>(`option`): [`AsyncOption`](index.md)<`T`\>

Convert a synchronous option ([Option](../Option/index.md)) into an
[AsyncOption](index.md).

```typescript
const option = Option.some(1);
AsyncOption.fromOption(option);
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of wrapped value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`Option`](../Option/index.md)<`T`\> | Option to be converted |

#### Returns

[`AsyncOption`](index.md)<`T`\>

#### Defined in

[src/option/async-option.ts:95](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L95)

___

### fromPromise

▸ `Static` **fromPromise**<`T`\>(`promise`): [`AsyncOption`](index.md)<`T`\>

Convert a promise of a synchronous option ([Option](../Option/index.md))
into an [AsyncOption](index.md).

```typescript
const promise = Promise.resolve(Option.some(1));
AsyncOption.fromPromise(option);
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of wrapped value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `promise` | `Promise`<[`Option`](../Option/index.md)<`T`\>\> | Promise of option to be convert |

#### Returns

[`AsyncOption`](index.md)<`T`\>

#### Defined in

[src/option/async-option.ts:111](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L111)

___

### none

▸ `Static` **none**<`T`\>(): [`AsyncOption`](index.md)<`T`\>

Create an empty [AsyncOption](index.md).

```typescript
const example = AsyncOption.none();
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of wrapped value (for compatibility with [AsyncOption](index.md) interface) |

#### Returns

[`AsyncOption`](index.md)<`T`\>

#### Defined in

[src/option/async-option.ts:139](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L139)

___

### some

▸ `Static` **some**<`T`\>(`value`): [`AsyncOption`](index.md)<`T`\>

Create a [AsyncOption](index.md) that wraps the given value.

```typescript
const example = AsyncOption.some(1);
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of value to be wrapped |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | Value to be wrapped |

#### Returns

[`AsyncOption`](index.md)<`T`\>

#### Defined in

[src/option/async-option.ts:125](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/async-option.ts#L125)
