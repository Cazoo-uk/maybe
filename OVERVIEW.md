# Home

## What is this?

This provides some utility types that help represent uncertain outcomes. More specifically: it provides TypeScript
implementations of *result* and *option* types.

The API for these types is very closely modelled around the
`Option` and `Result` types in Rust. These Rust types are the inspiration for this library.

We also provide some helper types for dealing with options and results in asynchronous contexts. See AsyncOption and
AsyncResult for more information.

## What is an option?

An option represents a value that may or may not exist.

For example:

```typescript
const nonEmpty = [1, 2, 3];
nonEmpty.pop(); // 3

const empty = [];
empty.pop(); // undefined
```

We could use an option to represent the return type of `pop`, because it might not produce a value.

We could model `pop` as follows:

```typescript
interface Array<T> {
    pop(): Option<T>;
}
```

## What is a result?

A result represents the outcome of an operation that might succeed (with some value), or fail (with some error).

Results are appropriate in any situation where we have a good reason to believe that an operation may fail. For example:
we should always expect that file I/O and HTTP calls may fail.

We might use a result as follows:

```typescript
interface Item {
}

type DatabaseError =
    | "cannot-connect"
    | "table-not-found"
    | "item-not-found";

interface DatabaseClient {
    // result either:
    // - succeeds with Item
    // - fails with DatabaseError
    getItem(id: string): Result<Item, DatabaseError>
}
```

## Why would I want to use these in my code?

There are many ways to model uncertainty in JavaScript:

To represent values that may not exist:

- value or `undefined`
- value or `null`
- using an "empty" value, e.g. an empty array
- using a discriminated union

To represent operations that may fail:

- throwing an error
- using a discriminated union
- return a value that may not exist

Options and results are a clear and consistent way of representing these things. They provide a functional interface
inspired by Rust's much-loved types.

JavaScript is a strange beast. Options and results make it difficult to mistake a value for an empty value and vice
versa.

This cannot happen with an option:

```typescript
const maybeNumber: number | undefined = 0;

if (!maybeNumber) {
    // oops! we meant to check for undefined, but 0
    // is a valid value in this case!
    throw new Error("value missing");
}
```

Options can make code more concise:

```typescript
// without options
function parseAndDouble(n: string | null): number | null {
    if (n === null) {
        return null;
    }

    const parsed = parseInt(n);
    return Number.isNaN(parsed) ? null : parsed * 2;
}

// with options
function parseAndDouble(n: Option<string>): Option<number> {
    return n
        .map(parseInt)
        .filter(v => !Number.isNaN(v))
        .map(v => v * 2);
}
```

## What are asynchronous options and results?

Promises make it a pain to work with the synchronous option and result types. For example:

```typescript
// generate a promise of a result 
const result: Promise<Result<T, E>> = someResult();

// create another promise of a result using that data
const next = (await result).then(data => someOtherResult(data));

// and again...
(await next).then(data => someFurtherResult(data));
```

Asynchronous options and results use promises internally to abstract away this complexity. This allows you to write more
concise code. The `await` calls above are no longer required.

```typescript
someResult() // returns AsyncResult<T, E>
    .then(someOtherResult)
    .then(someFurtherResult)
```
