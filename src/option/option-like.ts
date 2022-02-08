// NOT IMPLEMENTED
// as_deref (cannot work with pointers)
// as_deref_mut (cannot work with pointers)
// as_mut (cannot work with pointers)
// as_pin_mut (cannot work with pointers)
// as_pin_ref (cannot work with pointers)
// as_ref (cannot work with pointers)
// clone (chosen no mutability)
// cloned (cannot change reference type)
// copied (cannot work with pointers)
// get_or_insert (chosen no mutability)
// get_or_insert_with (chosen no mutability)
// get_or_insert_default (default does not exist)
// insert (chosen no mutability)
// iter_mut (mutable by default)
// replace (chosen no mutability)
// take (cannot work with pointers)
// unwrap_or_default (default does not exist)
//
// EXTENDED
// filter (allows predicate function)
// or (other can be of differing type)
// orElse (other can be of differing type)
// unwrapOr (can default to differing type)
// unwrapOrElse (can default to differing type)
// xor (other can be of differing type)

import { ResultLike } from "../result";

/**
 * @typeParam T Type of wrapped value (if present)
 */
export interface OptionLike<T> {
    /**
     * Returns None if the option is None, otherwise returns `option`.
     * @typeParam U Type of `option`
     * @param option Returns this if option is not None
     * @since 0.1.0
     */
    and<U>(option: OptionLike<U>): OptionLike<U>;

    /**
     * Returns None if the option is None, otherwise calls `fn` with the wrapped
     * value and returns the result. Some languages call this operation flatmap.
     * @typeParam U Wrapped type of option returned by `fn`
     * @since 0.1.0
     */
    andThen<U>(fn: (value: T) => OptionLike<U>): OptionLike<U>;

    /**
     * Calls `fn` with this option and returns the result. Intended to be used
     * alongside Option methods that only work with specific wrapped types.
     *
     * ```
     * // compiles fine
     * Option.some(Result.ok(1)).apply(Option.transpose);
     *
     * // compile error! Option<number> is not an option of a result
     * Option.some(1).apply(Option.transpose);
     * ```
     *
     * This method is not taken from the original Rust option type.
     * @param fn Passes the option to this callback
     * @typeParam U Return type of `fn`
     * @return Result of `fn`
     * @since 0.1.0
     *
     */
    apply<U>(fn: (option: OptionLike<T>) => U): U;

    /**
     * Returns true if the option is a Some value containing the given value.
     * Compares using strict equality.
     * @param value Compares against this value
     * @return Boolean indicating equality
     * @since 0.1.0
     */
    contains(value: T): boolean;
    expect(message: string): T;
    filter<U extends T>(fn: (value: T) => value is U): OptionLike<U>;
    filter(fn: (value: T) => boolean): OptionLike<T>;
    isNone(): this is IsNone;
    isSome(): this is IsSome<T>;
    iter(): IterableIterator<T>;
    map<U>(fn: (value: T) => U): OptionLike<U>;
    mapOr<U>(or: U, fn: (value: T) => U): OptionLike<U>;
    mapOrElse<U>(or: () => U, fn: (value: T) => U): OptionLike<U>;
    okOr<E>(error: E): ResultLike<T, E>;
    okOrElse<E>(fn: () => E): ResultLike<T, E>;
    or<U>(option: OptionLike<U>): OptionLike<T | U>;
    orElse<U>(fn: () => OptionLike<U>): OptionLike<T | U>;
    unwrap(): T;
    unwrapOr<U>(value: U): T | U;
    unwrapOrElse<U>(fn: () => U): T | U;
    xor<U>(option: OptionLike<T>): OptionLike<T | U>;
    zip<U>(option: OptionLike<U>): OptionLike<[T, U]>;
    zipWith<U, C>(
        option: OptionLike<U>,
        fn: (a: T, b: U) => C,
    ): OptionLike<C>;
}

export const SomeSymbol = Symbol("Option.IsSome");

export interface IsNone {
    [SomeSymbol]: false;
}

export interface IsSome<T> {
    [SomeSymbol]: true;
    intoSome(): T;
}
