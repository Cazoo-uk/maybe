import { Option } from "../option";
import { Err } from "./err";
import { Ok } from "./ok";

/**
 * Error thrown when calling {@link Result.unwrap} on `Err`. This
 * error is a simple subclasses of the normal JavaScript `Error` type.
 * @since 0.1.0
 */
export class UnwrapErrError extends Error {}

/**
 * Error thrown when calling {@link Result.unwrapErr} on `Ok`. This
 * error is a simple subclasses of the normal JavaScript `Error` type.
 * @since 0.1.0
 */
export class UnwrapOkError extends Error {}

/**
 * `Result<T, E>` is the type used for returning and propagating errors.
 * The result is either `Ok`, representing success and containing a
 * value, or `Err`, representing error and containing an error value.
 *
 * `Ok` and `Err` are modelled as standalone classes but note these
 * are not exposed. You can create options using the helpers methods
 * exposed by `Result`.
 *
 * This class is heavily inspired by Rust's Result type. This result type
 * is immutable, which is the main difference from the Rust original.
 * The following methods are present in Rust but not included in this
 * implementation:
 * - as_deref (no pointers in JS)
 * - as_deref_mut (no pointers in JS)
 * - as_mut (no pointers in JS)
 * - as_pin_mut (no pointers in JS)
 * - as_pin_ref (no pointers in JS)
 * - as_ref (no pointers in JS)
 * - clone (mutates result)
 * - cloned (no reliable object cloning in JS)
 * - copied (no pointers in JS)
 * - insert (mutates result)
 * - iter_mut (no such thing as immutable iterator)
 * - unwrap_or_default (no defaults in JS)
 *
 * Differences compared to Rust implementation:
 * - {@link intoOkOrError} (`T` and `E` need not match)
 * - {@link or} (other result need not be of same type)
 * - {@link orElse} (other result need not be of same type)
 * - {@link unwrapOr} (other result need not be of same type)
 * - {@link unwrapOrElse} (other result need not be of same type)
 *
 * Extensions from Rust implementation:
 * - {@link apply} (added to facilitate type constraints)
 *
 * @typeParam T Type of wrapped value (if ok)
 * @typeParam E Type of wrapped error (if err)
 */

export interface Result<T, E> {
    /**
     * Returns `result` if this result is `Ok`, otherwise returns this
     * result.
     *
     * ```typescript
     * Result.ok(1).and(Result.ok(2));
     * // returns Result.ok(2)
     *
     * Result.err(someError).and(Result.ok(2));
     * // returns Result.err(someError)
     * ```
     * @typeParam U Ok type of other result
     * @param result Return this if this result is ok
     * @since 0.1.0
     */
    and<U>(result: Result<U, E>): Result<U, E>;

    /**
     * Calls `fn` if the result is ok, otherwise returns this result.
     * This function can be used for control flow based on `Result`
     * values.
     *
     * ```typescript
     * Result.ok(1).andThen(value => Result.ok(value + 1));
     * // returns Result.ok(2)
     *
     * Result.err(someError).andThen(value => Result.ok(value + 1));
     * // returns Result.err(someError)
     * ```
     * @typeParam U Ok type of other result
     * @param fn Call this with ok value
     * @since 0.1.0
     */
    andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

    /**
     * Calls `fn` with this result and returns the outcome.
     *
     * Intended to be used alongside `Result` methods that only
     * work with specific wrapped types. This method does not exist in
     * Rust because Rust can specify implementations that only apply for
     * certain type constraints.
     *
     * ```typescript
     * Result.ok(Result.ok(1)).apply(Option.flatten);
     * // returns Result.ok(1)
     *
     * Result.ok(1).apply(Option.flatten);
     * // compile error! Result<number, unknown> is not a result of a result
     * ```
     * @param fn Passes the result to this callback
     * @typeParam U Return type of `fn`
     * @since 0.1.0
     */
    apply<U>(fn: (value: Result<T, E>) => U): U;

    /**
     * Returns true if the result is `Ok` and contains the given value.
     * Compares using strict equality.
     *
     * ```typescript
     * Result.ok(1).contains(1);
     * // true
     *
     * Result.ok(1).contains(2);
     * // false
     *
     * const a = { prop: 1 };
     * const b = { prop: 1 };
     * Result.ok(a).contains(b);
     * // false, because objects compare by identity
     * ```
     * @param value Compares against this value
     * @since 0.1.0
     */
    contains(value: T): boolean;

    /**
     * Returns true if the result is `Err` and contains an error that the
     * matches the given value. Compares using strict equality.
     *
     * ```typescript
     * Result.err(1).containsErr(1);
     * // true
     *
     * Result.err(1).containsErr(2);
     * // false
     *
     * const a = { prop: 1 };
     * const b = { prop: 1 };
     * Result.err(a).containsErr(b);
     * // false, because objects compare by identity
     * ```
     * @param error Compares against this value
     * @since 0.1.0
     */
    containsErr(error: E): boolean;

    /**
     * Converts from `Result<T, E>` to {@link Option}<E>. This is
     * an option of the error (if this result is an `Err`), else an empty
     * option.
     *
     * ```typescript
     * Result.ok(1).err()
     * // returns Option.none()
     *
     * Result.err(someError).err();
     * // returns Option.some(someError)
     * ```
     * @since 0.1.0
     */
    err(): Option<E>;

    /**
     * Returns the wrapped value if this result is `Ok`. Throws an
     * {@link UnwrapErrError} with the given message if called on
     * an `Err`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to:
     * - use one of {@link unwrapOr} and {@link unwrapOrElse}
     * - narrow the result type using {@link isOk} in tandem with
     * {@link IsOk.intoOk}
     *
     * ```typescript
     * Result.ok(1).expect("It exists");
     * // returns 1
     *
     * Result.err(someError).expect("It exists");
     * // throws error
     * ```
     * @param message Use this in the error
     * @since 0.1.0
     * @throws {@link EmptyResultError}
     */
    expect(message: string): T;

    /**
     * Returns the wrapped error if this result is `Err`. Throws an
     * {@link UnwrapOkError} with the given message if called on
     * an `Ok`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to narrow the
     * result type using {@link isErr} in tandem with
     * {@link IsErr.intoErr}.
     *
     * ```typescript
     * Result.ok(1).expect("It exists");
     * // throws error
     *
     * Result.err(someError).expect("It exists");
     * // returns someError
     * ```
     * @param message Use this in the error
     * @since 0.1.0
     * @throws {@link ResultIsOkError}
     */
    expectErr(message: string): E;

    /**
     * Returns the wrapped value, no matter whether the result is `Ok` or
     * `Err`.
     *
     * Unlike the Rust implementation, the ok and error types need not be
     * the same.
     *
     * ```typescript
     * Result.ok(1).intoOkOrError()
     * // returns 1
     *
     * Result.err(someError).intoOkOrError()
     * // returns someError
     * ```
     * @todo To implement!
     * @since 0.1.0
     */
    intoOkOrError(): T | E;

    /**
     * Returns true if the result is an `Err` value. This function acts
     * as a type predicate.
     *
     * ```typescript
     * Result.error(someError).isErr();
     * // returns true
     *
     * function usingPredicate(result: Result<number, Error>) {
     *     if (result.isErr()) {
     *         // compiler understands that result is `Err`
     *         result.intoErr();
     *     }
     * }
     *
     * Result.ok(1).isErr();
     * // returns false
     * ```
     * @since 0.1.0
     */
    isErr(): this is IsErr<E>;

    /**
     * Returns true if the result is an `Some` value. This function acts
     * as a type predicate.
     *
     * ```typescript
     * Result.ok(1).isOk();
     * // returns true
     *
     * function usingPredicate(result: Result<number, Error>) {
     *     if (result.isOke()) {
     *         // compiler understands that result is `Ok`
     *         result.intoOk();
     *     }
     * }
     *
     * Result.ok(1).isOk();
     * // returns false
     * ```
     * @since 0.1.0
     */
    isOk(): this is IsOk<T>;

    /**
     * Returns an iterator over the possible value within. The iterator
     * contains one item if the result is `Ok`, or none if `Err`.
     *
     * ```typescript
     * const iterator = Result.ok(1).iter()
     * iterator.next();
     * // returns iterator result of 1
     *
     * iterator.next();
     * // returns done
     *
     * Result.err(someError).iter().next();
     * // returns done
     * ```
     * @todo It's not clear why this might be useful in JavaScript.
     * Should we remove this?
     * @since 0.1.0
     */
    iter(): IterableIterator<T>;

    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a
     * function to the contained value.
     *
     * The provided function `fn` is called if and only if the result is
     * an instance of `Ok`.
     *
     * ```typescript
     * Result.ok(1).map(value => value + 1);
     * // returns Result.ok(2)
     *
     * Result.ok(1).map(value => value.toString());
     * // returns Result.ok("1")
     *
     * Result.err(someError).map(value => value + 1);
     * // returns Result.err(someError)
     * ```
     * @typeParam U Map to result of this type
     * @param fn Call this with wrapped value
     * @since 0.1.0
     */
    map<U>(fn: (value: T) => U): Result<U, E>;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a
     * function to the contained value.
     *
     * The provided function `fn` is called if and only if the result is
     * an instance of `Err`.
     *
     * ```typescript
     * Result.err(1).mapErr(value => value + 1);
     * // returns Result.err(2)
     *
     * Result.err(someError).mapErr(value => new OtherError(value.message))
     * // returns Result.err(new OtherError("..."))
     *
     * Result.ok(1).mapErr(value => value + 1);
     * // returns Result.err(someError)
     * ```
     * @typeParam F Map to result of this error type
     * @param fn Call this with wrapped error
     * @since 0.1.0
     */
    mapErr<F>(fn: (error: E) => F): Result<T, F>;

    /**
     * Returns the provided default result (if `Err`), or applies a
     * function to the contained value (if `Ok`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * {@link mapOrElse}, which is lazily evaluated.
     *
     * The provided function `fn` is called if and only if the result is
     * non-empty.
     *
     * ```typescript
     * Result.ok(1).mapOr(0, value => value + 1);
     * // returns Result.ok(2)
     *
     * Result.ok(1).mapOr("0", value => value.toString());
     * // returns Result.ok("1")
     *
     * Result.err(someError).mapOr(0, value => value + 1);
     * // returns Result.ok(0)
     * ```
     * @typeParam U Map to result of this type
     * @param or Use this value if result is `Err`
     * @param fn Call this with wrapped value if `Ok`
     * @since 0.1.0
     */
    mapOr<U>(or: U, fn: (value: T) => U): U;

    /**
     * Computes a default function result (if `Err`), or applies a
     * different function to the contained value (if `Some`).
     *
     * The function `fn` is called if and only if the result is an
     * instance of `Ok`. The function `or` is only called if the
     * result *is* empty.
     *
     * ```typescript
     * Result.ok(1).mapOrElse(() => 0, value => value + 1);
     * // returns Result.ok(2)
     *
     * Result.ok(1).mapOrElse(() => "0", value => value.toString());
     * // returns Result.ok("1")
     *
     * Result.err(someError).mapOrElse(() => 0, value => value + 1);
     * // returns Result.ok(0)
     * ```
     * @typeParam U Map to result of this type
     * @param or Use this callback if result is `Err`
     * @param fn Call this with wrapped value if `Ok`
     * @since 0.1.0
     */
    mapOrElse<U>(or: (error: E) => U, fn: (value: T) => U): U;

    /**
     * Converts from `Result<T, E>` to {@link Option}<T>`.
     * This is an option of the ok value (if this result is `Ok`), else
     * an empty option.
     *
     * ```typescript
     * Result.ok(1).ok()
     * // returns Option.some(1)
     *
     * Result.err(someError).ok().isSome();
     * // returns Option.none()
     * ```
     * @since 0.1.0
     */
    ok(): Option<T>;

    /**
     * Returns this result if it is `Ok`, otherwise returns `result`.
     *
     * Arguments passed to `or` are eagerly evaluated; if you are passing
     * the result of a function call, it is recommended to use
     * {@link orElse}, which is lazily evaluated.
     *
     * ```typescript
     * Result.ok(1).or(Result.ok(2));
     * // returns Result.ok(1)
     *
     * Result.err(someError).or(Result.ok(2));
     * // returns Result.ok(2)
     * ```
     * @typeParam U Ok type of other result
     * @param result Return this if this result is `Err`
     * @since 0.1.0
     */
    or<U>(result: Result<U, E>): Result<T | U, E>;

    /**
     * Returns the result if it is `Ok`, otherwise calls `fn` and returns
     * the result. The function `fn` is not called unless the result is
     * an `Err`.
     *
     * ```typescript
     * Result.ok(1).orElse(() => Result.ok(2));
     * // returns Result.ok(1)
     *
     * Result.err(someError).orElse(() => Result.ok(2));
     * // returns Result.ok(2)
     * ```
     * @typeParam U Type of ok value in callback result
     * @param fn Call this if this result is `Err`
     * @since 0.1.0
     */
    orElse<U>(fn: (error: E) => Result<U, E>): Result<T | U, E>;

    /**
     * Returns the wrapped value if this result is `Ok`. Throws an
     * {@link UnwrapErrError} with the given message if called on
     * an `Err`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to:
     * - use one of {@link unwrapOr} and {@link unwrapOrElse}
     * - narrow the result type using {@link isOk} in tandem with
     * {@link IsOk.intoOk}
     *
     * ```typescript
     * Result.ok(1).unwrap()
     * // returns 1
     *
     * Result.err(someError).unwrap();
     * // throws error
     * ```
     * @todo Should this throw the contained error?
     * @since 0.1.0
     * @throws {@link EmptyResultError}
     */
    unwrap(): T;

    /**
     * Returns the wrapped error if this result is `Err`. Throws an
     * {@link UnwrapOkError} with the given message if called on
     * an `Ok`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to narrow the
     * result type using {@link isErr} in tandem with
     * {@link IsErr.intoErr}.
     *
     * ```typescript
     * Result.ok(1).unwrap();
     * // throws error
     *
     * Result.err(someError).unwrap();
     * // returns someError
     * ```
     * @since 0.1.0
     * @throws {@link ResultIsOkError}
     */
    unwrapErr(): E;

    /**
     * Returns the contained wrapped ok value (if present) or a provided
     * default.
     *
     * Arguments passed to unwrap_or are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * {@link unwrapOrElse}, which is lazily evaluated.
     *
     * ```typescript
     * Result.ok(1).unwrapOr(0);
     * // returns 1
     *
     * Result.err(someError).unwrapOr(0);
     * // returns 0
     * ```
     * @typeParam U Type of default value
     * @param value Use this if result is `Err`
     * @since 0.1.0
     */
    unwrapOr<U>(value: U): T | U;

    /**
     * Returns the contained value (if present) or computes it from the
     * function provided. The function is not called if the result is not
     * an `Err`.
     *
     * ```typescript
     * Result.ok(1).unwrapOrElse(() => 0);
     * // returns 1
     *
     * Result.err(someError).unwrapOrElse(() => 0);
     * // returns 0
     * ```
     * @typeParam U Type returned by callback
     * @param fn Call this and return value if result is `Err`
     * @since 0.1.0
     */
    unwrapOrElse<U>(fn: (error: E) => U): T | U;
}

export const OkSymbol = Symbol("Result.IsOk");

/**
 * Represents an error outcome. Use {@link Result.isErr} to assert
 * that an result implements this interface.
 */
export interface IsErr<T> {
    /**
     * Static property. Used to discriminate between `Ok` and `Err`.
     */
    [OkSymbol]: false;

    /**
     * Identical to {@link Result.unwrapErr} but will never throw an
     * error. We can provide this guarantee because this method only
     * exists on results that are ok.
     *
     * ```typescript
     * Result.err(someError).intoErr();
     * // returns someError
     *
     * function realisticExample(result: Result<number, Error>) {
     *   if (result.isErr()) {
     *      const error = result.intoErr();
     *      // do other things...
     *   }
     * }
     * ```
     * @since 0.1.0
     */
    intoErr(): T;
}

/**
 * Represents an successful outcome. Use {@link Result.isOk} to
 * assert that an result implements this interface.
 */
export interface IsOk<T> {
    /**
     * Static property. Used to discriminate between `Ok` and `Err`.
     */
    [OkSymbol]: true;

    /**
     * Identical to {@link Result.unwrap} but will never throw an
     * error. We can provide this guarantee because this method only
     * exists on results that are ok.
     *
     * ```typescript
     * Result.ok(1).intoOk();
     * // returns 1
     *
     * function realisticExample(result: Result<number, Error>) {
     *   if (result.isOk()) {
     *      const value = result.intoSome();
     *      // do other things...
     *   }
     * }
     * ```
     * @since 0.1.0
     */
    intoOk(): T;
}

export namespace Result {
    /**
     * A utility type which represents a result that must be *either* `Ok`
     * or `Err`. This contrasts with `Result`, which is *neither* `Ok` or
     * `Err` as far as the compiler is concerned!
     *
     * This type makes {@link Result.isOk} and {@link Result.isErr}
     * more powerful in some situations. For example:
     *
     * ```typescript
     * const thisWorks = (result: Result<number, Error>) => {
     *     if (result.isOk()) {
     *       // This works fine with the normal `Result` interface
     *       result.intoOk();
     *     }
     * }
     *
     * const thisDoesNotWork = (result: Result<number, Error>) => {
     *     if (result.isErr()) {
     *       // The compiler knows that `result` implements `IsErr` here...
     *       throw new Error("result is empty");
     *     }
     *
     *     // ...but here it is still just `Result`, which does not
     *     // implement `IsOk` i.e. DOES NOT COMPILE!
     *     result.intoOk();
     * }
     *
     * const butDoesWithUndecided = (result: Result.Undecided<number, Error>) => {
     *     if (result.isNone()) {
     *       // The compiler knows that `result` implements `IsErr` here...
     *       throw new Error("result is empty");
     *     }
     *
     *     // ...and that it must therefore implement `IsOk` here!
     *     result.intoOk();
     * }
     * ```
     *
     * Why don't we just use this type to represent all results? Honestly, we
     * find that using a union with a generic makes the compiler sweat when
     * it occurs all over the place.
     *
     * As shown above, {@link Result} can still be narrowed in some
     * situations. This type is still available for convenience but it isn't
     * the default.
     *
     * @typeParam T Type of ok value
     * @typeParam E Type of error value
     * @since 0.1.0
     */
    export type Undecided<T, E> = Result<T, E> & (IsOk<T> | IsErr<E>);

    /**
     * Creates an `Err` wrapping the given error value. Note that the error
     * value need not be an instance of `Error`!
     *
     * ```typescript
     * const result = Result.err(new Error());
     * result.isErr();
     * // returns true
     * ```
     *
     * @typeParam T Type of ok value (for compatibility with
     * {@link Result} interface)
     * @typeParam E Type of error value
     * @since 0.1.0
     */
    export const err = <T, E = never>(
        error: T,
    ): Result<E, T> & IsErr<T> => {
        return new Err(error);
    };

    /**
     * Turns a result of a result into a result. In other words, it un-nests
     * a nested result.
     *
     * Note that this only works for **one** level of nesting! It's easy to
     * write code that works for any number of levels but it's not easy to
     * express this using TypeScript.
     *
     * ```typescript
     * const result = Result.ok(Result.ok(1));
     * Result.flatten(result);
     * // returns Result.ok(1)
     * ```
     * @todo Can we extend this to work for any level of nesting?
     * @typeParam T Type of wrapped value
     * @param result To be flattened
     * @since 0.1.0
     */
    export const flatten = <T, E>(
        result: Result<Result<T, E>, E>,
    ): Result<T, E> => {
        return result.unwrapOrElse(error => err(error));
    };

    /**
     * True if the value is an result, else false.
     *
     * Implementation note: an result is defined as an instance of `Ok` or
     * `Err`. These private classes both implement {@link Result}. For
     * avoidance of doubt, `Ok` and `Err` are not exposed by this package.
     *
     * `isResult` will infer the wrapped type if possible. Note that this
     * provides no runtime guarantee that the option is of type `T`.
     *
     * ```typescript
     * Result.isResult(Result.ok(1));
     * // returns true
     *
     * Result.isResult(Result.err(new Error()));
     * // returns true
     *
     * Result.isResult(1);
     * // returns false
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of error value
     * @param value Test against this
     * @since 0.1.0
     */
    export const isResult = <T, E>(value: any): value is Result<T, E> => {
        return value instanceof Ok || value instanceof Err;
    };

    /**
     * Creates an `Ok`.
     *
     * ```typescript
     * const result = Result.ok(1);
     * result.isOk();
     * // returns true
     * ```
     * @typeParam T Type of wrapped value
     * @typeParam E Type of error value (for compatibility with
     * {@link Result} interface)
     * @param value Value to be wrapped
     * @since 0.1.0
     */
    export const ok = <T, E = never>(
        value: T,
    ): Result<T, E> & IsOk<T> => {
        return new Ok(value);
    };

    /**
     * Transposes a result of an option into an option of a result. `Ok(None)`
     * will be mapped to `None`. `Ok(Some(value))` and `Err(error)` will be
     * mapped to `Some(Ok(value))` and `Some(Err(error))`.
     *
     * ```typescript
     * Result.transpose(Result.err(someError));
     * // returns Option.some(Result.err(someError));
     *
     * Result.transpose(Result.ok(Option.none()))
     * // returns Option.none()
     *
     * Result.transpose(Result.ok(1));
     * // returns Option.some(Result.ok(1))
     * ```
     * @typeParam E Type of error value
     * @typeParam T Type of ok value
     * @param result Result to be transposed
     * @since 0.1.0
     */
    export const transpose = <T, E>(
        result: Result<Option<T>, E>,
    ): Option<Result<T, E>> => {
        return result.isOk()
            ? result.intoOk().map(ok)
            : Option.some(result as Result<any, E>);
    };
}
