import { Result, ResultLike } from "../result";
import * as Option from "./option";

import {
    UnwrapNoneError,
    IsNone,
    OptionLike,
    SomeSymbol,
} from "./option-like";

export class None<T> implements OptionLike<T>, IsNone {
    readonly [SomeSymbol] = false;

    and<U>(): OptionLike<U> {
        return this as OptionLike<any> & IsNone;
    }

    andThen<U>(): OptionLike<U> {
        return this as OptionLike<any> & IsNone;
    }

    apply<U>(fn: (option: OptionLike<T>) => U): U {
        return fn(this);
    }

    contains(): boolean {
        return false;
    }

    expect(message: string): T {
        throw new UnwrapNoneError(message);
    }

    filter<U extends T>(): OptionLike<U> {
        return this as OptionLike<any> & IsNone;
    }

    isNone(): boolean {
        return true;
    }

    isSome(): boolean {
        return false;
    }

    iter(): IterableIterator<T> {
        return [][Symbol.iterator]();
    }

    map<U>(): OptionLike<U> {
        return this as OptionLike<any> & IsNone;
    }

    mapOr<U>(or: U): OptionLike<U> {
        return Option.some(or);
    }

    mapOrElse<U>(or: () => U): OptionLike<U> {
        return Option.some(or());
    }

    okOr<E>(error: E): ResultLike<T, E> {
        return Result.err(error);
    }

    okOrElse<E>(fn: () => E): ResultLike<T, E> {
        return Result.err(fn());
    }

    or<U>(option: OptionLike<U>): OptionLike<T | U> {
        return option;
    }

    orElse<U>(fn: () => OptionLike<U>): OptionLike<T | U> {
        return fn();
    }

    unwrap(): T {
        throw new UnwrapNoneError("unwrap called on None");
    }

    unwrapOr<U>(value: U): T | U {
        return value;
    }

    unwrapOrElse<U>(fn: () => U): T | U {
        return fn();
    }

    xor(option: OptionLike<T>): OptionLike<T> {
        return option;
    }

    zip<U>(): OptionLike<[T, U]> {
        return this as OptionLike<any>;
    }

    zipWith<_, C>(): OptionLike<C> {
        return this as OptionLike<any> & IsNone;
    }
}
