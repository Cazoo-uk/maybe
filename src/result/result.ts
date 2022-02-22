import { Err } from "./err";
import { Ok } from "./ok";
import { IsErr, IsOk, ResultLike } from "./result-like";
import { Option, OptionLike } from "../option";

/**
 * A utility type which represents a result that must be *either* `Ok`
 * or `Err`. This contrasts with `ResultLike`, which is *neither* `Ok` or
 * `Err` as far as the compiler is concerned!
 *
 * This type makes {@link ResultLike.isOk} and {@link ResultLike.isErr}
 * more powerful in some situations. For example:
 *
 * ```typescript
 * const thisWorks = (result: ResultLike<number, Error>) => {
 *     if (result.isOk()) {
 *       // This works fine with the normal `ResultLike` interface
 *       result.intoOk();
 *     }
 * }
 *
 * const thisDoesNotWork = (result: ResultLike<number, Error>) => {
 *     if (result.isErr()) {
 *       // The compiler knows that `result` implements `IsErr` here...
 *       throw new Error("result is empty");
 *     }
 *
 *     // ...but here it is still just `ResultLike`, which does not
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
 * As shown above, {@link ResultLike} can still be narrowed in some
 * situations. This type is still available for convenience but it isn't
 * the default.
 *
 * @typeParam T Type of ok value
 * @typeParam E Type of error value
 * @since 0.1.0
 */
export type Undecided<T, E> = ResultLike<T, E> & (IsOk<T> | IsErr<E>);

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
 * {@link ResultLike} interface)
 * @typeParam E Type of error value
 * @since 0.1.0
 */
export const err = <T, E = never>(
    error: T,
): ResultLike<E, T> & IsErr<T> => {
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
    result: ResultLike<ResultLike<T, E>, E>,
): ResultLike<T, E> => {
    return result.unwrapOrElse(error => err(error));
};

/**
 * True if the value is an result, else false.
 *
 * Implementation note: an result is defined as an instance of `Ok` or
 * `Err`. These private classes both implement {@link ResultLike}. For
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
export const isResult = <T, E>(value: any): value is ResultLike<T, E> => {
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
 * {@link ResultLike} interface)
 * @param value Value to be wrapped
 * @since 0.1.0
 */
export const ok = <T, E = never>(
    value: T,
): ResultLike<T, E> & IsOk<T> => {
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
    result: ResultLike<OptionLike<T>, E>,
): OptionLike<ResultLike<T, E>> => {
    return result.isOk()
        ? result.intoOk().map(ok)
        : Option.some(result as ResultLike<any, E>);
};
