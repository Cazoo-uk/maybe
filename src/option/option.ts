import { Result } from "../result";
import { None } from "./none";
import { Some } from "./some";

/**
 * Error thrown when calling {@link Option.unwrap} or
 * {@link Option.expect} on `None`. This error is a simple subclasses
 * of the normal JavaScript `Error` type.
 * @since 1.0.1
 */
export class UnwrapNoneError extends Error {}

/**
 * Type `Option` represents an optional value: every Option is either
 * `Some` and contains a value, or `None`, and does not.
 *
 * `Some` and `None` are modelled as standalone classes but note these
 * are not exposed. You can create options using the helpers methods
 * exposed by `Option`.
 *
 * This class is heavily inspired by Rust's Option type. This option type
 * is immutable, which is the main difference from the Rust original.
 *
 * The following methods are present in Rust but not included in this
 * implementation:
 * - `as_deref` (no pointers in JS)
 * - `as_deref_mut` (no pointers in JS)
 * - `as_mut` (no pointers in JS)
 * - `as_pin_mut` (no pointers in JS)
 * - `as_pin_ref` (no pointers in JS)
 * - `as_ref` (no pointers in JS)
 * - `clone` (no reliable object cloning in JS)
 * - `cloned` (no reliable object cloning in JS)
 * - `copied` (no pointers in JS)
 * - `get_or_insert` (mutates option)
 * - `get_or_insert_with` (mutates option)
 * - `get_or_insert_default` (no defaults in JS)
 * - `insert` (mutates option)
 * - `iter_mut` (no such thing as immutable iterator)
 * - `replace` (mutates option)
 * - `take` (no pointers in JS)
 * - `unwrap_or_default` (no defaults in JS)
 *
 * Differences compared to Rust implementation:
 * - {@link filter} (can use predicate function)
 * - {@link or} (other option need not be of same type)
 * - {@link orElse} (other option need not be the same type)
 * - {@link unwrapOr} (can default to differing type)
 * - {@link unwrapOrElse} (can default to differing type)
 * - {@link xor} (other option need not be the same type)
 *
 * Extensions from Rust implementation:
 * - {@link apply} (added to facilitate type constraints)
 * - {@link IsSome.intoSome} (added to mirror {@link IsOk.intoOk})
 *
 * @typeParam T Type of wrapped value (if present)
 */
export interface Option<T> {
    /**
     * Returns None if the option is None, otherwise returns `option`.
     *
     * ```typescript
     * Option.some(1).and(Option.some(2));
     * // returns Option.some(2)
     *
     * Option.none().and(Option.some(2));
     * // returns Option.none()
     * ```
     * @typeParam U Type of `option`
     * @param option Returns this if option is not None
     * @since 1.0.1
     */
    and<U>(option: Option<U>): Option<U>;

    /**
     * Returns None if the option is None, otherwise calls `fn` with the
     * wrapped value and returns the result. Some languages call this
     * operation flatmap.
     *
     * ```typescript
     * function toString(value: number): OptionLike<string> {
     *     return value.toString();
     * }
     *
     * Option.some(1).andThen(toString);
     * // returns Option.some("1")
     * ```
     * @typeParam U Wrapped type of option returned by `fn`
     * @param fn Call this with wrapped value
     * @since 1.0.1
     */
    andThen<U>(fn: (value: T) => Option<U>): Option<U>;

    /**
     * Calls `fn` with this option and returns the result.
     *
     * Intended to be used alongside Option methods that only work with
     * specific wrapped types. This method does not exist in Rust because
     * Rust can specify implementations that only apply for certain type
     * constraints.
     *
     * ```typescript
     * Option.some(Option.some(1)).apply(Option.flatten);
     * // returns Option.some(1)
     *
     * Option.some(1).apply(Option.flatten);
     * // compile error! Option<number> is not an option of an option
     * ```
     * @param fn Passes the option to this callback
     * @typeParam U Return type of `fn`
     * @since 1.0.1
     */
    apply<U>(fn: (option: Option<T>) => U): U;

    /**
     * Returns true if the option is `Some` and contains the given value.
     * Compares using strict equality.
     *
     * ```typescript
     * Option.some(1).contains(1);
     * // true
     *
     * Option.some(1).contains(2);
     * // false
     *
     * const a = { prop: 1 };
     * const b = { prop: 1 };
     * Option.some(a).contains(b);
     * // false, because objects compare by identity
     * ```
     * @param value Compares against this value
     * @since 1.0.1
     */
    contains(value: T): boolean;

    /**
     * Returns the wrapped value. Throws an {@link UnwrapNoneError} with
     * the given message if called on `None`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to:
     * - use one of {@link unwrapOr} and {@link unwrapOrElse}
     * - narrow the option type using {@link isSome} in tandem with
     * {@link IsSome.intoSome}
     *
     * ```typescript
     * Option.some(1).expect("It exists");
     * // returns 1
     *
     * Option.none().expect("It exists");
     * // throws error
     * ```
     * @param message Use this in the error
     * @since 1.0.1
     * @throws {@link EmptyOptionError}
     */
    expect(message: string): T;

    /**
     * Returns `None` if the option is `None`, otherwise calls the
     * predicate `fn` with the wrapped value and returns:
     * - `Some(t)` if `fn` returns true (where `t` is the wrapped value)
     * - `None` if `fn` returns false
     *
     * The predicate function is a type guard that narrows `T` to `U`.
     * The resulting option is of type `U`.
     *
     * ```typescript
     * Option.some(1).filter(value => value === 1);
     * // returns Option.some(1);
     *
     * Option.some(1).filter(value => value === 2);
     * // returns Option.none();
     *
     * // this predicate narrows a string to a specific literal type
     * const predicate = (value: string): value is "hello" => {
     *     return value === "hello";
     * }
     *
     * Option.some("hello").filter(predicate);
     * // returns option narrowed to OptionLike<"hello">
     *
     * Option.none().filter(value => value === 2);
     * // returns Option.none()
     *
     * ```
     * @typeParam U Narrow wrapped value to this type
     * @since 1.0.1
     * @param fn Predicate function
     */
    filter<U extends T>(fn: (value: T) => value is U): Option<U>;

    /**
     * Returns `None` if the option is `None`, otherwise calls the
     * predicate `fn` with the wrapped value and returns:
     * - `Some(t)` if `fn` returns true (where `t` is the wrapped value)
     * - `None` if `fn` returns false
     *
     * ```typescript
     * Option.some(1).filter(value => value === 1);
     * // returns Option.some(1)
     *
     * Option.some(1).filter(value => value === 2);
     * // returns Option.none()
     *
     * Option.none().filter(value => value === 2);
     * // returns Option.none()
     * ```
     * @since 1.0.1
     * @param fn Predicate function
     */
    filter(fn: (value: T) => boolean): Option<T>;

    /**
     * Returns true if the option is a `None` value. This function acts
     * as a type predicate.
     *
     * ```typescript
     * Option.some(1).isNone();
     * // returns false
     *
     * Option.none().isNone();
     * // returns true
     * ```
     * @since 1.0.1
     */
    isNone(): this is IsNone;

    /**
     * Returns true if the option is a `Some` value. This function acts
     * as a type predicate.
     *
     * ```typescript
     * Option.some(1).isNone();
     * // returns true
     *
     * function usingPredicate(option: OptionLike<number>) {
     *     if (option.isSome()) {
     *         // compiler understands that option is `Some`
     *         option.intoSome();
     *     }
     * }
     *
     * Option.none().isNone();
     * // returns false
     * ```
     * @since 1.0.1
     */
    isSome(): this is IsSome<T>;

    /**
     * Returns an iterator over the possible value within. The iterator
     * contains one item if the option is `Some`, or none if `None`.
     *
     * ```typescript
     * const iterator = Option.some(1).iter()
     * iterator.next();
     * // returns iterator result of 1
     *
     * iterator.next();
     * // returns done
     *
     * Option.none().iter().next();
     * // returns done
     * ```
     * @todo It's not clear why this might be useful in JavaScript.
     * Should we remove this?
     * @since 1.0.1
     */
    iter(): IterableIterator<T>;

    /**
     * Maps an `OptionLike<T>` to `OptionLike<U>` by applying a function
     * to the contained value.
     *
     * The provided function `fn` is called if and only if the option is
     * non-empty.
     *
     * ```typescript
     * Option.some(1).map(value => value + 1);
     * // returns Option.some(2)
     *
     * Option.some(1).map(value => value.toString());
     * // returns Option.some("1")
     *
     * Option.none().map(value => value + 1);
     * // returns Option.none()
     * ```
     * @typeParam U Map to option of this type
     * @param fn Call this with wrapped value
     * @since 1.0.1
     */
    map<U>(fn: (value: T) => U): Option<U>;

    /**
     * Returns the provided default result (if `None`), or applies a
     * function to the contained value (if `Some`).
     *
     * Arguments passed to `mapOr` are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * {@link mapOrElse}, which is lazily evaluated.
     *
     * The provided function `fn` is called if and only if the option is
     * non-empty.
     *
     * ```typescript
     * Option.some(1).mapOr(0, value => value + 1);
     * // returns Option.some(2)
     *
     * Option.some(1).mapOr("0", value => value.toString());
     * // returns Option.some("1")
     *
     * Option.none().mapOr(0, value => value + 1);
     * // returns Option.some(0)
     * ```
     * @typeParam U Map to option of this type
     * @param or Use this value if option is empty
     * @param fn Call this with wrapped value if non-empty
     * @since 1.0.1
     */
    mapOr<U>(or: U, fn: (value: T) => U): Option<U>;

    /**
     * Computes a default function result (if `None`), or applies a
     * different function to the contained value (if `Some`).
     *
     * The function `fn` is called if and only if the option is non-empty.
     * The function `or` is only called if the option *is* empty.
     *
     * ```typescript
     * Option.some(1).mapOrElse(() => 0, value => value + 1);
     * // returns Option.some(2)
     *
     * Option.some(1).mapOrElse(() => "0", value => value.toString());
     * // returns Option.some("1")
     *
     * Option.none().mapOrElse(() => 0, value => value + 1);
     * // returns Option.some(0)
     * ```
     * @typeParam U Map to option of this type
     * @param or Use this callback if option is empty
     * @param fn Call this with wrapped value if non-empty
     * @since 1.0.1
     */
    mapOrElse<U>(or: () => U, fn: (value: T) => U): Option<U>;

    /**
     * Transforms the `OptionLike<T>` into a `ResultLike<T, E>`, mapping
     * `Some(value)` to `Ok(value)` and `None` to `Err(error)`.
     *
     * Arguments passed to `okOr` are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * {@link okOrElse}, which is lazily evaluated.
     *
     * ```typescript
     * const error = new Error("empty");
     *
     * Option.some(1).okOr(error);
     * // returns Result.ok(1)
     *
     * Option.none().okOr(error);
     * // returns Result.err(error)
     * ```
     * @typeParam E Error type
     * @param error Use this error value when the option is empty
     * @since 1.0.1
     */
    okOr<E>(error: E): Result<T, E>;

    /**
     * Transforms the `OptionLike<T>` into a `ResultLike<T, E>`, mapping
     * `Some(value)` to `Ok(value)` and `None` to `Err(err())`.
     *
     * The function `fn` is not called if the option is not empty.
     *
     * ```typescript
     * const error = new Error("empty");
     *
     * Option.some(1).okOrElse(() => error);
     * // returns Result.ok(1)
     *
     * Option.none().okOrElse(() => error);
     * // returns Result.err(error)
     * ```
     * @typeParam E Error type
     * @param fn Use result of this callback when the option is empty
     * @since 1.0.1
     */
    okOrElse<E>(fn: () => E): Result<T, E>;

    /**
     * Returns the option if it contains a value, otherwise returns
     * `option`.
     *
     * Arguments passed to `or` are eagerly evaluated; if you are passing
     * the result of a function call, it is recommended to use
     * {@link orElse}, which is lazily evaluated.
     *
     * ```typescript
     * Option.some(1).or(Option.some(2));
     * // returns Option.some(1)
     *
     * Option.none().or(Option.some(2));
     * // returns Option.some(2)
     * ```
     * @typeParam U Type of wrapped value in other option
     * @param option Return this if this option is `None`
     * @since 1.0.1
     */
    or<U>(option: Option<U>): Option<T | U>;

    /**
     * Returns the option if it contains a value, otherwise calls `fn` and
     * returns the result. The function `fn` is not called unless the
     * option is empty.
     *
     * ```typescript
     * Option.some(1).orElse(() => Option.some(2));
     * // returns Option.some(1)
     *
     * Option.none().orElse(() => Option.some(2));
     * // returns Option.some(2)
     * ```
     * @typeParam U Type of wrapped value in callback result
     * @param fn Call this if this option is empty
     * @since 1.0.1
     */
    orElse<U>(fn: () => Option<U>): Option<T | U>;

    /**
     * Returns the wrapped value. Throws an {@link UnwrapNoneError} if
     * called on `None`.
     *
     * As this function can throw an error, it's use is generally
     * discouraged outside of tests. It's always preferable to:
     * - use one of {@link unwrapOr} and {@link unwrapOrElse}
     * - narrow the option type using {@link isSome} in tandem with
     * {@link IsSome.intoSome}
     *
     * ```typescript
     * Option.some(1).unwrap();
     * // returns 1
     *
     * Option.none().unwrap();
     * // throws error
     * ```
     * @throws {@link EmptyOptionError}
     * @since 1.0.1
     */
    unwrap(): T;

    /**
     * Returns the contained wrapped value (if present) or a provided
     * default.
     *
     * Arguments passed to unwrap_or are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * {@link unwrapOrElse}, which is lazily evaluated.
     *
     * ```typescript
     * Option.some(1).unwrapOr(0);
     * // returns 1
     *
     * Option.none().unwrapOr(0);
     * // returns 0
     * ```
     * @typeParam U Type of default value
     * @param value Use this if option is empty
     * @since 1.0.1
     */
    unwrapOr<U>(value: U): T | U;

    /**
     * Returns the contained value (if present) or computes it from the
     * function provided. The function is not called if the option is not
     * empty.
     *
     * ```typescript
     * Option.some(1).unwrapOrElse(() => 0);
     * // returns 1
     *
     * Option.none().unwrapOrElse(() => 0);
     * // returns 0
     * ```
     * @typeParam U Type returned by callback
     * @param fn Call this and return value if option is empty
     * @since 1.0.1
     */
    unwrapOrElse<U>(fn: () => U): T | U;

    /**
     * Returns `Some` if exactly one of self and `option` is `Some`,
     * otherwise returns `None`.
     *
     * ```typescript
     * Option.some(1).xor(Option.some(2));
     * // returns Option.none()
     *
     * Option.some(1).xor(Option.none());
     * // returns Option.some(1)
     *
     * Option.none().xor(Option.some(2));
     * // returns Option.some(2)
     *
     * Option.none().xor(Option.none());
     * // returns Option.none()
     * ```
     * @param option The other option
     * @typeParam U Wrapped type of other option
     * @since 1.0.1
     */
    xor<U>(option: Option<T>): Option<T | U>;

    /**
     * Zips this option with another.
     *
     * If self is `Some(a)` and other is `Some(b)`, this method returns
     * `Some([a, b])`. Otherwise, returns `None`.
     *
     * ```typescript
     * Option.some(1).zip(Option.some("a"));
     * // returns Option.some([1, "a"])
     *
     * Option.some(1).zip(Option.none());
     * // returns Option.none()
     * ```
     * @typeParam U Wrapped type of other option
     * @param option Zip with this option
     * @since 1.0.1
     */
    zip<U>(option: Option<U>): Option<[T, U]>;

    /**
     * Zips this and another option with function `fn`.
     *
     * If self is `Some(a)` and other is `Some(b)`, this method returns
     * `Some(fn(a, b))`. Otherwise returns `None`.
     *
     * ```typescript
     * Option.some(2).zipWith(Option.some(3), (a, b) => a * b);
     * // returns Option.some(6);
     *
     * Option.some(1).zipWith(Option.none(), (a, b) => a * b);
     * // returns Option.none()
     * ```
     * @typeParam U Wrapped type of other option
     * @typeParam C Type returned by callback
     * @param option Zip with this option
     * @param fn Use this to combine the two wrapped values
     */
    zipWith<U, C>(option: Option<U>, fn: (a: T, b: U) => C): Option<C>;
}

export const SomeSymbol = Symbol("Option.IsSome");

/**
 * Represents an option that doesn't contain a value.
 *
 * This interface does expose any functionality. It only exists in order
 * to allow the compiler to distinguish between `OptionLike<T>` and
 * `OptionLike<T> & IsNone`.
 */
export interface IsNone {
    /**
     * Static property. Used to discriminate between `Some` and `None`.
     */
    [SomeSymbol]: false;
}

/**
 * Represents an option that contains a value. Use
 * {@link Option.isSome} to assert that an option implements this
 * interface.
 */
export interface IsSome<T> {
    /**
     * Static property. Used to discriminate between `Some` and `None`.
     */
    [SomeSymbol]: true;

    /**
     * Identical to {@link Option.unwrap} but will never throw an
     * error. We can provide this guarantee because this method only
     * exists on options that contain values.
     *
     * ```typescript
     * Option.some(1).intoSome();
     * // returns 1
     *
     * function realisticExample(option: OptionLike<number>) {
     *   if (option.isSome()) {
     *      const value = option.intoSome();
     *      // do other things...
     *   }
     * }
     * ```
     * @since 1.0.1
     */
    intoSome(): T;
}

export namespace Option {
    /**
     * A utility type which represents an option that must be *either* `Some`
     * or `None`. This contrasts with `OptionLike`, which is *neither* `Some`
     * or `None` as far as the compiler is concerned!
     *
     * This type makes {@link Option.isSome} and {@link Option.isNone}
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
     *     // ...but here it is still just `OptionLike`, which does not
     *     // implement `IsSome` i.e. DOES NOT COMPILE!
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
     * As shown above, {@link Option} can still be narrowed in some
     * situations. This type is still available for convenience but it isn't
     * the default.
     *
     * @typeParam T Type of wrapped value
     * @since 1.0.1
     */
    export type Undecided<T> = Option<T> & (IsSome<T> | IsNone);

    /**
     * Turns an option of an option of a value into an option of a value. In
     * other words, it un-nests a nested option.
     *
     * Note that this only works for **one** level of nesting! It's easy to
     * write code that works for any number of levels but it's not easy to
     * express this using TypeScript.
     *
     * ```typescript
     * const option = Option.some(Option.some(1));
     * Option.flatten(option);
     * // returns Option.some(1)
     * ```
     * @todo Can we extend this to work for any level of nesting?
     * @typeParam T Type of wrapped value
     * @param option To be flattened
     * @since 1.0.1
     */
    export const flatten = <T>(option: Option<Option<T>>): Option<T> => {
        return option.unwrapOr(none());
    };

    /**
     * Turns an "optional" value into an option of a value. Returns `None` if
     * the provided value is `null` or `undefined`, otherwise `Some(value)`.
     *
     * ```typescript
     * Option.fromOptional(1);
     * // returns Option.some(1)
     *
     * Option.fromOptional(null);
     * // returns Option.none()
     * ```
     * @typeParam T Type of value to be wrapped
     * @param value The value to be wrapped
     * @since 1.0.1
     */
    export const fromOptional = <T>(
        value: T | null | undefined,
    ): Option<T> => {
        return value === null || value === undefined
            ? none()
            : some(value);
    };

    /**
     * True if the value is an option, else false.
     *
     * Implementation note: an option is defined as an instance of `Some` or
     * `None`. These private classes both implement {@link Option}. For
     * avoidance of doubt, `Some` and `None` are not exposed by this package.
     *
     * `isOption` will infer the wrapped type if possible. Note that this
     * provides no runtime guarantee that the option is of type `T`.
     *
     * ```typescript
     * Option.isOption(Option.some(1));
     * // returns true
     *
     * Option.isOption(Option.none());
     * // returns true
     *
     * Option.isOption(1);
     * // returns false
     * ```
     * @typeParam T Type of wrapped value
     * @param value Test against this
     * @since 1.0.1
     */
    export const isOption = <T>(value: any): value is Option<T> => {
        return value instanceof Some || value instanceof None;
    };

    /**
     * Creates an empty option.
     *
     * ```typescript
     * const option = Option.none();
     * option.isNone();
     * // returns true
     * ```
     * @typeParam T Type of wrapped value (for compatibility with
     * {@link Option} interface).
     * @since 1.0.1
     */
    export const none = <T = never>(): Option<T> & IsNone => {
        return new None<T>();
    };

    /**
     * Creates an option that wraps a value.
     *
     * ```typescript
     * const option = Option.some(1);
     * option.isSome();
     * // returns true
     * ```
     * @typeParam T Type of wrapped value
     * @param value Value to be wrapped
     * @since 1.0.1
     */
    export const some = <T>(value: T): Option<T> & IsSome<T> => {
        return new Some(value);
    };

    /**
     * Transposes an option of a result into a result of an option. `None` is
     * mapped to `Ok(None)`. `Some(Ok(value))` and `Some(Err(error))` is
     * mapped to `Ok(Some(value))` and `Err(error)`.
     *
     * ```typescript
     * Option.transpose(Option.none());
     * // returns Result.ok(Option.none())
     *
     * Option.transpose(Option.some(Result.ok(1)));
     * // returns Result.ok(Option.some(1))
     *
     * Option.transpose(Option.some(Result.err("error")));
     * // returns Result.err("error")
     * ```
     * @typeParam E Type of error value
     * @typeParam T Type of ok value
     * @param option Option to be transposed
     * @since 1.0.1
     */
    export const transpose = <T, E>(
        option: Option<Result<T, E>>,
    ): Result<Option<T>, E> => {
        return option.isSome()
            ? option.intoSome().map(value => some(value))
            : Result.ok(none());
    };

    /**
     * Turns an option of a tuple of two values into an array of two options
     * containing the tuple members. For example:
     *
     * ```typescript
     * const zipped = Option.some(1).zip(Option.some(2))
     * Option.unzip(zipped);
     * // returns [Option.some(1), Option.some(2)]
     * ```
     * @typeParam A Type of first zipped value
     * @typeParam B Type of second zipped value
     * @param option Option to be unzipped
     * @since 1.0.1
     */
    export const unzip = <A, B>(
        option: Option<[A, B]>,
    ): [Option<A>, Option<B>] => {
        if (option.isSome()) {
            const [a, b] = option.intoSome();
            return [new Some(a), new Some(b)];
        }

        return [none(), none()];
    };
}
