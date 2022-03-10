# Home

## What is this?

This library provides some utility types that help represent uncertain outcomes. More specifically: it provides
TypeScript implementations of *result* and *option* types.

The API for these types is very closely modelled around the
`Option` and `Result` types in Rust. These Rust types are the inspiration for this library.

We also provide some helper types for dealing with options and results in asynchronous contexts. See {@link AsyncOption}
and {@link AsyncResult} for more information.

## Options

### What is an option?

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

### Using options

Import {@link Option} as follows:

```typescript
import { Option } from "@cazoo/maybe"

// or async
import { AsyncOption } from "@cazoo/maybe"
```

{@link Option} is both a namespace and an interface.

As a namespace, it contains helper methods for creating and working with options.

```typescript
Option.some(1);
Option.none();

const mightExist: number | null = 4;
Option.from(mightExist);

Option.isOption(3); // false
Option.isOption(Option.none()); // true
```

Creating an option results in an object that implement the {@link Option} interface.

Note that the interface and namespace are documented on separate pages!

By contrast, {@link AsyncOption} is modelled as a class with static methods. See the individual documentation pages for
more information about why this is.

### Async options

Promises make it a pain to work with the synchronous option types. For example:

Most async operations are liable to fail, and {@link AsyncResult} is probably a better choice in almost any
circumstance. We've included {@link AsyncOption} to complement {@link AsyncResult}. For example, we need to return
something async when an {@link AsyncResult} needs to create an option.

```typescript
// generate a promise of a result 
const option: Promise<Option<T>> = someOperation();

// do something with that data
const next = (await option).andThen(data => someOtherResult(data));

// and again...
(await next).andThen(data => someFurtherResult(data));
```

Asynchronous options use promises internally to abstract away this complexity. This allows you to write more concise
code. The `await` calls above are no longer required.

```typescript
// using AsyncOption<T>
someOperation().andThen(doSomething).asPromise()
```

## Results

### What is a result?

A result represents the outcome of an operation that might succeed (with some value), or fail (with some error).

Results are appropriate in any situation where we have a good reason to believe that an operation may fail. For example:
we should always expect that file I/O and HTTP calls may fail.

We might use a result as follows:

```typescript
interface Item {
    data: string;
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

### Using results

Import {@link Result} as follows:

```typescript
import { Result } from "@cazoo/maybe"

// or async
import { AsyncResult } from "@cazoo/maybe"
```

{@link Result} is both a namespace and an interface.

As a namespace, it contains helper methods for creating and working with results.

```typescript
Result.ok(1);
Result.err(someError);

Result.isResult(3) // false
Result.isResult(Result.ok(3)); // true
```

Creating an option results in an object that implement the {@link Result} interface.

Note that the interface and namespace are documented on separate pages!

By contrast, {@link AsyncResult} is modelled as a class with static methods. See the individual documentation pages for
more information about why this is.

### Async results

Promises make it a pain to work with regular (sync) results. For example:

```typescript
// generate a promise of a result 
const result: Promise<Result<T, E>> = someOperation();

// create another promise of a result using that data
const next = (await result).andThen(data => otherOperation(data));

// and again...
(await next).andThen(data => thirdOperation(data));
```

Asynchronous results use promises internally to abstract away this complexity. This allows you to write more concise
code. The `await` calls above are no longer required.

```typescript
// all operations return AsyncResult<T, E>
someOperation()
    .andThen(someOtherResult)
    .andThen(someFurtherResult)
```

## Why would I want to use this library?

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

### Options

JavaScript is a strange beast. Options make it difficult to mistake a value for something that doesn't exist, and vice
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

### Results

Results can also make things more concise. In this case, we want to parse and validate some incoming data.

```typescript
function parseAndValidate(input: string): Data {
    const hydrated = JSON.parse(input);
    const validation = someValidation(input)

    if (!validation.isValid) {
        throw new Error("data is not valid");
    }

    return hydrated;
}
```

This is concise but has two issues:

* the caller has to check for an error if they don't want the program to explode
* the caller has no clear way of knowing what went wrong

```typescript
class ValidationError {
    // ...
}

function parseAndValidate(input: string): Data {
    const hydrated = JSON.parse(input);
    const validation = someValidation(hydrated);

    if (!validation.isValid) {
        throw new Validation(validation.errors);
    }

    return hydrated;
}
```

This is better, but:

* the caller still has to know to check for an error
* the caller has to know what type of error to expect, and has to check for that error type in handling code

How about this?

```typescript
type ParseError = "invalid" | "malformed";

type ParseResult =
    | { success: true, data: Data }
    | { success: false, kind: ParseError };

function parseAndValidate(input: string): ParseResult {
    try {
        const hydrated = JSON.parse(input);
        const validation = someValidation(hydrated);

        if (!validation.isValid) {
            return { success: false, kind: "validation-error" };
        }

        return { success: true, data: hydrated };
    } catch (error) {
        return { success: false, kind: "parse-error" };
    }
}
```

This is better in some ways, worse in others:

* the caller cannot get to the data without explicitly handling the error case
* the kind of error is readily apparent
* we could easily extend this to include the validation errors
* but it's quite verbose

Results can make this more ergonomic:

```typescript
type ParseError = "invalid" | "malformed";

function parseAndValidate(input: string): Result<Data, ParseError> {
    try {
        const hydrated = JSON.parse(input);
        const validation = someValidation(hydrated);

        if (!validation.isValid) {
            return Result.err("invalid");
        }

        return Result.ok(hydrated);
    } catch (error) {
        return Result.err("malformed");
    }
}

// or even...

function parse(input: string): Result<unknown, "malformed"> {
    try {
        return Result.ok(JSON.parse(input));
    } catch (error) {
        return Result.err("malformed")
    }

}

function validate(data: unknown): Result<Data, ParseError> {
    const validation = someValidation(data);

    return validation.isValid
        ? Result.ok(hydrated)
        : Result.err("invalid");
}

function parseAndValidate(input: string): Result<Data, ParseError> {
    return parse(input).andThen(validate);
}
```

We don't need to create types like `ParseResult` all over the codebase, and {@link Result} provides utility methods that
make it easier for the caller to work with the outcome, whether success or failure.
