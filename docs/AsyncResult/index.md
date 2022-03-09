---
layout: default
title: "AsyncResult"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / AsyncResult

# Class: AsyncResult<T, E\>

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Table of contents

### Constructors

- [constructor](index.md#constructor)

### Methods

- [and](index.md#and)
- [andThen](index.md#andthen)
- [asPromise](index.md#aspromise)
- [contains](index.md#contains)
- [containsErr](index.md#containserr)
- [err](index.md#err)
- [expect](index.md#expect)
- [expectErr](index.md#expecterr)
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
- [transform](index.md#transform)
- [unwrap](index.md#unwrap)
- [unwrapErr](index.md#unwraperr)
- [unwrapOr](index.md#unwrapor)
- [unwrapOrElse](index.md#unwraporelse)
- [err](index.md#err)
- [fromPromise](index.md#frompromise)
- [fromResult](index.md#fromresult)
- [ok](index.md#ok)

## Constructors

### constructor

• **new AsyncResult**<`T`, `E`\>(`promise`)

#### Type parameters

| Name |
| :------ |
| `T` |
| `E` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<[`Result`](../Result/index.md)<`T`, `E`\>\> |

#### Defined in

[src/result/async-result.ts:5](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L5)

## Methods

### and

▸ **and**<`U`\>(`result`): [`AsyncResult`](index.md)<`U`, `E`\>

 [AsyncResult.and](index.md#and) but accepts and returns an async
result instead.

```typescript
AsyncResult.ok(1).and(AsyncResult(2));
// returns AsyncResult.ok(2)

AsyncResult.err(someError).and(AsyncResult.ok(1));
// returns AsyncResult.err(SomeError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of other result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | [`AsyncResult`](index.md)<`U`, `E`\> | The other result |

#### Returns

[`AsyncResult`](index.md)<`U`, `E`\>

#### Defined in

[src/result/async-result.ts:89](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L89)

___

### andThen

▸ **andThen**<`U`\>(`fn`): [`AsyncResult`](index.md)<`U`, `E`\>

 [AsyncResult.andThen](index.md#andthen) but:
- accepts a callback that returns an [AsyncResult](index.md)
- also returns an [AsyncResult](index.md)

```typescript
AsyncResult.ok(1).andThen(v => AsyncResult(v + 1));
// returns AsyncResult.ok(2)

AsyncResult.err(someError).andThen(v => AsyncResult.ok(v + 1));
// returns AsyncResult.err(SomeError)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of [AsyncResult](index.md) returned by `fn` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`value`: `T`) => [`AsyncResult`](index.md)<`U`, `E`\> | Calls thi with deferred ok value |

#### Returns

[`AsyncResult`](index.md)<`U`, `E`\>

#### Defined in

[src/result/async-result.ts:109](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L109)

___

### asPromise

▸ **asPromise**(): `Promise`<[`Result`](../Result/index.md)<`T`, `E`\>\>

Exposes the underlying promise of an option. There is no need to
use this method under normal circumstances!

```typescript
AsyncResult.ok(1)
  .asPromise()
  .then(result => result.isOk())

// resolves to true
```

**`todo`** Should we expose this method at all?

**`since`** 0.1.0

#### Returns

`Promise`<[`Result`](../Result/index.md)<`T`, `E`\>\>

#### Defined in

[src/result/async-result.ts:133](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L133)

___

### contains

▸ **contains**(`value`): `Promise`<`boolean`\>

 [Result.contains](../Result/index.md#contains) but returns a promise of a
boolean, rather than a boolean.

```typescript
AsyncResult.ok(1).contains(1);
// resolves to true

AsyncResult.err(someError).contains(1);
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

[src/result/async-result.ts:151](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L151)

___

### containsErr

▸ **containsErr**(`error`): `Promise`<`boolean`\>

 [Result.containsErr](../Result/index.md#containserr) but returns a promise of a
boolean, rather than a boolean.

```typescript
AsyncResult.ok(1).containsErr(1);
// resolves to false

AsyncResult.err(someError).containsErr(someError);
// resolves to true
```

**`since`** 0.1.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `E` | Check for this error |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/result/async-result.ts:169](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L169)

___

### err

▸ **err**(): [`AsyncOption`](../AsyncOption/index.md)<`E`\>

 [Result.err](../Result/index.md#err) but returns an [AsyncOption](../AsyncOption/index.md).

```typescript
AsyncResult.ok(1).err();
// returns AsyncOption.none()

AsyncResult.err(someError).err();
// returns AsyncOption.some(someError)
```

**`since`** 0.1.0

#### Returns

[`AsyncOption`](../AsyncOption/index.md)<`E`\>

#### Defined in

[src/result/async-result.ts:185](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L185)

___

### expect

▸ **expect**(`message`): `Promise`<`T`\>

 [Result.expect](../Result/index.md#expect) but returns a promise. If `Ok`,
the promise resolves with the ok value, else it rejects with
an error.

```typescript
AsyncResult.ok(1).expect("failure");
// resolves to 1

AsyncResult.err(someError).expect("failure");
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

[src/result/async-result.ts:206](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L206)

___

### expectErr

▸ **expectErr**(`message`): `Promise`<`E`\>

 [Result.expectErr](../Result/index.md#expecterr) but returns a promise. If `Err`,
the promise resolves with the error value, else it rejects with
an error.

```typescript
AsyncResult.ok(1).expect("failure");
// rejects

AsyncResult.err(someError).expect("failure");
// resolves to someError
```

**`since`** 0.1.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`E`\>

#### Defined in

[src/result/async-result.ts:225](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L225)

___

### isErr

▸ **isErr**(): `Promise`<`boolean`\>

 [Result.isErr](../Result/index.md#iserr) but returns a promise of a boolean.
This function cannot be used to for type narrowing because this is
not possible with asynchronous code.

```typescript
AsyncResult.ok(1).isErr();
// resolves to false

AsyncResult.err(someError).isErr();
// resolves to true
```

**`since`** 0.1.0

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/result/async-result.ts:243](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L243)

___

### isOk

▸ **isOk**(): `Promise`<`boolean`\>

 [Result.isOk](../Result/index.md#isok) but returns a promise of a boolean.
This function cannot be used to for type narrowing because this is
not possible with asynchronous code.

```typescript
AsyncResult.ok(1).isOk();
// resolves to true

AsyncResult.err(someError).isOk();
// resolves to false
```

**`since`** 0.1.0

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/result/async-result.ts:261](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L261)

___

### iter

▸ **iter**(): `Promise`<`IterableIterator`<`T`\>\>

 [Result.iter](../Result/index.md#iter) but returns a promise of an
iterator.

```typescript
const iterator = await AsyncResult.ok(1).iter();

iterator.next();
// return iterator result of 1

iterator.next();
// done

AsyncResult.err(someError).iter().then(iterator => iterator.next());
// resolves to done
```

**`since`** 0.1.0

#### Returns

`Promise`<`IterableIterator`<`T`\>\>

#### Defined in

[src/result/async-result.ts:283](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L283)

___

### map

▸ **map**<`U`\>(`fn`): [`AsyncResult`](index.md)<`U`, `E`\>

 [Result.map](../Result/index.md#map) but returns an [AsyncResult](index.md).

```typescript
AsyncResult.ok(1).map(value => value + 1);
// returns AsyncResult.ok(2)

AsyncResult.err(someError).map(value => value + 1);
// returns AsyncResult.err(someError)
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

[`AsyncResult`](index.md)<`U`, `E`\>

#### Defined in

[src/result/async-result.ts:301](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L301)

___

### mapErr

▸ **mapErr**<`U`\>(`fn`): [`AsyncResult`](index.md)<`T`, `U`\>

 [Result.mapErr](../Result/index.md#maperr) but returns an [AsyncResult](index.md).

```typescript
AsyncResult.ok(1).mapErr(error => error.toUpperCase());
// returns AsyncResult.ok(1)

AsyncResult.err("error").mapErr(error => error.toUpperCase());
// returns AsyncResult.err("ERROR")
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Callback returns this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`error`: `E`) => `U` | Call wrapped error with this |

#### Returns

[`AsyncResult`](index.md)<`T`, `U`\>

#### Defined in

[src/result/async-result.ts:321](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L321)

___

### mapOr

▸ **mapOr**<`U`\>(`or`, `fn`): `Promise`<`U`\>

 [Option.mapOr](../Option/index.md#mapor) but returns a promise of a value.

```typescript
AsyncResult.ok(1).mapOr(0, value => value + 1);
// resolves to 1

AsyncResult.err(someError).mapOr(0, value => value + 1);
// resolves to 0
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to value of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | `U` | Use this value if `Err` |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if `Ok` |

#### Returns

`Promise`<`U`\>

#### Defined in

[src/result/async-result.ts:342](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L342)

___

### mapOrElse

▸ **mapOrElse**<`U`\>(`or`, `fn`): `Promise`<`U`\>

 [Result.mapOrElse](../Result/index.md#maporelse) but returns a promise of a
value.

```typescript
AsyncResult.ok(1).mapOrElseElse(() => 0, value => value + 1);
// resolves to 1

AsyncResult.err(1).mapOrElse(error => error - 1, value => value + 1);
// resolves to 0
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Map to value of this type |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `or` | (`error`: `E`) => `U` | Use this value if `Err` |
| `fn` | (`value`: `T`) => `U` | Call this with wrapped value if `Ok` |

#### Returns

`Promise`<`U`\>

#### Defined in

[src/result/async-result.ts:362](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L362)

___

### ok

▸ **ok**(): [`AsyncOption`](../AsyncOption/index.md)<`T`\>

 [Result.ok](../Result/index.md#ok) but returns an [AsyncOption](../AsyncOption/index.md).

```typescript
AsyncResult.ok(1).ok();
// returns AsyncOption.some(1)

AsyncResult.err(someError).ok();
// returns AsyncOption.none()
```

**`since`** 0.1.0

#### Returns

[`AsyncOption`](../AsyncOption/index.md)<`T`\>

#### Defined in

[src/result/async-result.ts:378](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L378)

___

### or

▸ **or**<`U`\>(`result`): [`AsyncResult`](index.md)<`T` \| `U`, `E`\>

 [Result.or](../Result/index.md#or) but accepts an [AsyncResult](index.md) and
also returns one.

```typescript
AsyncResult.ok(1).or(AsyncResult.ok(2));
// returns AsyncResult.ok(1)

AsyncResult.err(exampleError).or(AsyncResult.ok(2));
// returns AsyncResult.ok(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of other result |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | [`AsyncResult`](index.md)<`U`, `E`\> | Return this if this result is `Err` |

#### Returns

[`AsyncResult`](index.md)<`T` \| `U`, `E`\>

#### Defined in

[src/result/async-result.ts:399](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L399)

___

### orElse

▸ **orElse**<`U`\>(`fn`): [`AsyncResult`](index.md)<`T` \| `U`, `E`\>

 [Option.orElse](../Option/index.md#orelse) but:
- accepts a function that returns an async option
- itself returns an async option.

```typescript
AsyncResult.ok(1).orElse(() => AsyncResult.ok(2));
// returns AsyncResult.ok(1)

AsyncResult.err(1).orElse(error => AsyncResult.ok(error - 1));
// returns AsyncResult.ok(2)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Ok type of result returned in callback |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`error`: `E`) => [`AsyncResult`](index.md)<`U`, `E`\> | Call this if this result is `Err` |

#### Returns

[`AsyncResult`](index.md)<`T` \| `U`, `E`\>

#### Defined in

[src/result/async-result.ts:419](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L419)

___

### transform

▸ **transform**<`U`, `F`\>(`fn`): [`AsyncResult`](index.md)<`U`, `F`\>

Call the provided function with a synchronous version of this
result. This fulfils the same role as [Result.apply](../Result/index.md#apply), in
that it can be used to apply a function to this result.

```typescript
const nested = AsyncResult.ok(Result.ok(1))
nested.transform(Result.flatten);
// returns AsyncResult.ok(1)
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `U` | Returns [AsyncResult](index.md) of this type |
| `F` | - |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | (`result`: [`Result`](../Result/index.md)<`T`, `E`\>) => [`Result`](../Result/index.md)<`U`, `F`\> | Call this the inner result |

#### Returns

[`AsyncResult`](index.md)<`U`, `F`\>

#### Defined in

[src/result/async-result.ts:445](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L445)

___

### unwrap

▸ **unwrap**(): `Promise`<`T`\>

 [Result.unwrap](../Result/index.md#unwrap) but returns a promise. If `Ok`,
the promise resolves with the wrapped value, else it rejects with
an error.

```typescript
AsyncResult.ok(1).unwrap();
// resolves to 1

AsyncResult.err(someError).unwrap();
// rejects
```

**`since`** 0.1.0

**`throws`** {@link EmptyResultError}

#### Returns

`Promise`<`T`\>

#### Defined in

[src/result/async-result.ts:466](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L466)

___

### unwrapErr

▸ **unwrapErr**(): `Promise`<`E`\>

 [Result.unwrapErr](../Result/index.md#unwraperr) but returns a promise. If `Err`,
the promise resolves with the wrapped error, else it rejects with
an error.

```typescript
AsyncResult.ok(1).unwrap();
// rejects

AsyncResult.err(someError).unwrap();
// resolves with someError
```

**`since`** 0.1.0

**`throws`** {@link ResultIsOkError}

#### Returns

`Promise`<`E`\>

#### Defined in

[src/result/async-result.ts:485](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L485)

___

### unwrapOr

▸ **unwrapOr**<`U`\>(`value`): `Promise`<`T` \| `U`\>

 [Result.unwrapOr](../Result/index.md#unwrapor) but returns a promise. The
promise resolves with the wrapped value (if `Ok`) or the default.

```typescript
AsyncResult.ok(1).unwrapOr(0);
// resolves to 1

AsyncResult.err(someError).unwrapOr(0);
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

[src/result/async-result.ts:503](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L503)

___

### unwrapOrElse

▸ **unwrapOrElse**<`U`\>(`fn`): `Promise`<`T` \| `U`\>

 [Result.unwrapOrElse](../Result/index.md#unwraporelse) but returns a promise. The
promise resolves with the wrapped value (if `Ok`) or the result of
the callback.

```typescript
AsyncResult.ok(1).unwrapOrElse(() => 0);
// returns 1

AsyncResult.err(someError).unwrapOrElse(() => 0);
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
| `fn` | () => `U` | Call this and return value if result is `Err` |

#### Returns

`Promise`<`T` \| `U`\>

#### Defined in

[src/result/async-result.ts:523](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L523)

___

### err

▸ `Static` **err**<`E`, `T`\>(`error`): [`AsyncResult`](index.md)<`T`, `E`\>

Create a error [AsyncResult](index.md) that wraps the given error.
Note that the error value need not be an instance of `Error`.

```typescript
const example = AsyncResult.err(new Error());
```

**`since`** 0.1.0

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `E` | `E` | Type of error value |
| `T` | `never` | Type of ok value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `E` | Error to be wrapped |

#### Returns

[`AsyncResult`](index.md)<`T`, `E`\>

#### Defined in

[src/result/async-result.ts:70](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L70)

___

### fromPromise

▸ `Static` **fromPromise**<`T`, `E`\>(`result`): [`AsyncResult`](index.md)<`T`, `E`\>

Convert a promise of a synchronous result ([Result](../Result/index.md))
into an [AsyncResult](index.md).

```typescript
const promise = Promise.resolve(Result.ok(1));
AsyncResult.fromPromise(promise);
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of ok value |
| `E` | Type of err value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | `Promise`<[`Result`](../Result/index.md)<`T`, `E`\>\> | Promise to be converted |

#### Returns

[`AsyncResult`](index.md)<`T`, `E`\>

#### Defined in

[src/result/async-result.ts:20](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L20)

___

### fromResult

▸ `Static` **fromResult**<`T`, `E`\>(`result`): [`AsyncResult`](index.md)<`T`, `E`\>

Convert a synchronous result ([Result](../Result/index.md)) into an
[AsyncResult](index.md).

```typescript
const result = Result.ok(1);
AsyncResult.fromResult(result);
```

**`since`** 0.1.0

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | Type of ok value |
| `E` | Type of err value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `result` | [`Result`](../Result/index.md)<`T`, `E`\> | Result to be converted |

#### Returns

[`AsyncResult`](index.md)<`T`, `E`\>

#### Defined in

[src/result/async-result.ts:39](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L39)

___

### ok

▸ `Static` **ok**<`T`, `E`\>(`value`): [`AsyncResult`](index.md)<`T`, `E`\>

Create a ok [AsyncResult](index.md) that wraps the given value.

```typescript
const example = AsyncResult.ok(1);
```

**`since`** 0.1.0

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | Type of ok value |
| `E` | `never` | Type of error value |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | Value to be wrapped |

#### Returns

[`AsyncResult`](index.md)<`T`, `E`\>

#### Defined in

[src/result/async-result.ts:54](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/result/async-result.ts#L54)
