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
// iter_mut (mutable by default)
// unwrap_or_default (default does not exist)
//
// PARTIALLY IMPLEMENTED
// insert (cannot return mutable reference)
//
// EXTENDED
// or (other can be of differing type)
// orElse (other can be of differing type)
// unwrapOr (can default to differing type)
// unwrapOrElse (can default to differing type)

import { OptionLike } from "../option";

export interface ResultLike<A, E> {
    and<B>(result: ResultLike<B, E>): ResultLike<B, E>;
    andThen<B>(fn: (value: A) => ResultLike<B, E>): ResultLike<B, E>;
    apply<T>(fn: (value: ResultLike<A, E>) => T): T;
    contains(value: A): boolean;
    containsErr(error: E): boolean;
    err(): OptionLike<E>;
    expect(message: string): A;
    expectErr(message: string): E;
    isErr(): this is IsErr<E>;
    isOk(): this is IsOk<A>;
    iter(): IterableIterator<A>;
    map<B>(fn: (value: A) => B): ResultLike<B, E>;
    mapErr<F>(fn: (error: E) => F): ResultLike<A, F>;
    mapOr<B>(or: B, fn: (value: A) => B): B;
    mapOrElse<B>(or: (error: E) => B, fn: (value: A) => B): B;
    ok(): OptionLike<A>;
    or<B>(result: ResultLike<B, E>): ResultLike<A | B, E>;
    orElse<B>(fn: (error: E) => ResultLike<B, E>): ResultLike<A | B, E>;
    unwrap(): A;
    unwrapErr(): E;
    unwrapOr<B>(or: B): A | B;
    unwrapOrElse<B>(fn: (error: E) => B): A | B;
}

export const OkSymbol = Symbol("Result.IsOk");

export interface IsErr<T> {
    [OkSymbol]: false;
    intoErr(): T;
}

export interface IsOk<T> {
    [OkSymbol]: true;
    intoOk(): T;
}
