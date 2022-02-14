/**
 * Some example text
 */

import { Result, ResultLike } from "../result";
import { None } from "./none";
import { IsNone, IsSome, OptionLike } from "./option-like";
import { Some } from "./some";

/**
 * A utility type which represents an option that must be *either* Some
 * or None. This contrasts with `OptionLike`, which is *neither* Some or
 * None as far as the compiler is concerned!
 *
 * This type makes {@link OptionLike.isSome} and {@link OptionLike.isNone}
 * more powerful in some situations. For example:
 *
 * ```typescript
 * const thisWorks = (option: OptionLike<number>) => {
 *     if (option.isSome()) {
 *       // This works fine with the normal `OptionLike` interface
 *       option.intoSome();
 *     }
 * }
 *
 * const thisDoesNotWork = (option: OptionLike<number>) => {
 *     if (option.isNone()) {
 *       // The compiler knows that `option` implements `IsNone` here...
 *       throw new Error("option is empty");
 *     }
 *
 *     // COMPILE ERROR!
 *     // ...but here it is still just `OptionLike`, which does not
 *     // implement `IsSome`.
 *     option.intoSome();
 * }
 *
 * const butDoesWithUndecided = (option: Option.Undecided<number>) => {
 *     if (option.isNone()) {
 *       // The compiler knows that `option` implements `IsNone` here...
 *       throw new Error("option is empty");
 *     }
 *
 *     // ...and that it must therefore implement `IsSome` here!
 *     option.intoSome();
 * }
 * ```
 *
 * Why don't we just use this type to represent all options? Honestly, we
 * find that using a union with a generic makes the compiler sweat when
 * it occurs all over the place.
 *
 * As shown above, {@link OptionLike} can still be narrowed in some
 * situations. This type is still available for convenience but it isn't
 * the default.
 *
 * @typeParam T Type of wrapped value
 * @since 0.1.0
 */
export type Undecided<T> = OptionLike<T> & (IsSome<T> | IsNone);

/**
 * Turns an option of an option of a value into an option of a value. In
 * other words, it un-nests a nested option.
 *
 * Note that this only works for one level of nesting!
 *
 * It's easy to write code that works for any number of levels but it's
 * difficult to express this with the type system.
 *
 * @param option To be flattened
 * @todo Can we extend this to work for any level of nesting?
 * @typeParam T Type of wrapped value
 * @since 0.1.0
 */
export const flatten = <T>(
    option: OptionLike<OptionLike<T>>,
): OptionLike<T> => {
    return option.unwrapOr(none());
};

/**
 * Turns an "optional" value into an option of a value. Returns `None` if
 * the provided value is `null` or `undefined`, otherwise `Some(value)`.
 *
 * @typeParam T Type of value to be wrapped
 * @since 0.1.0
 * @param value The value to be wrapped
 */
export const from = <T>(value: T | null | undefined): OptionLike<T> => {
    return value === null || value === undefined ? none() : some(value);
};

/**
 * True if the value is an option, else false.
 *
 * Implementation note: an option is defined as an instance of `Some` or
 * `None`. These private classes both implement {@link OptionLike}. For
 * avoidance of doubt, Some and None are not exposed by this package.
 *
 * `isOption` will infer the wrapped type if possible. Note that this
 * provides no runtime guarantee that the option is of type `T`.
 *
 * @param value Value to be tested
 * @since 0.1.0
 * @typeParam T Type of wrapped value
 */
export const isOption = <T>(value: any): value is OptionLike<T> => {
    return value instanceof Some || value instanceof None;
};

/**
 * Creates an empty option.
 * @since 0.1.0
 * @typeParam T Type of wrapped value (for compatibility with
 * {@link OptionLike} interface).
 */
export const none = <T = never>(): OptionLike<T> & IsNone => {
    return new None<T>();
};

/**
 * Creates an option that wraps a value.
 * @param value Value to be wrapped
 * @since 0.1.0
 * @typeParam T Type of wrapped value
 */
export const some = <T>(value: T): OptionLike<T> & IsSome<T> => {
    return new Some(value);
};

/**
 * Transposes an option of a result into a result of an option. `None` is
 * mapped to `Ok(None)`. `Some(Ok(value))` and `Some(Err(error))` is
 * mapped to `Ok(Some(value))` and `Err(error)`.
 * @param option Option to be transposed
 * @since 0.1.0
 * @typeParam E Type of error value
 * @typeParam T Type of success value
 */
export const transpose = <T, E>(
    option: OptionLike<ResultLike<T, E>>,
): ResultLike<OptionLike<T>, E> => {
    return option.isSome()
        ? option.intoSome().map(value => some(value))
        : Result.ok(none());
};

/**
 * Turns an option of a tuple of two values into an array of two options
 * containing the tuple members. For example:
 *
 * ```typescript
 * const unzipped = Option.some(1)
 *     .zip(Option.some(2))
 *     .apply(Option.unzip);
 *
 * // unzipped == [Option.some(1), Option.some(2)];
 * ```
 *
 * @param option Option to be unzipped
 * @since 0.1.0
 * @typeParam A Type of first zipped value
 * @typeParam B Type of second zipped value
 */
export const unzip = <A, B>(
    option: OptionLike<[A, B]>,
): [OptionLike<A>, OptionLike<B>] => {
    if (option.isSome()) {
        const [a, b] = option.intoSome();
        return [new Some(a), new Some(b)];
    }

    return [none(), none()];
};
