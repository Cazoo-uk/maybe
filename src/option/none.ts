import { Result } from "../result";
import { IsNone, SomeSymbol, Option, UnwrapNoneError } from "./option";

export class None<T> implements Option<T>, IsNone {
    readonly [SomeSymbol] = false;

    and<U>(): Option<U> {
        return this as Option<any> & IsNone;
    }

    andThen<U>(): Option<U> {
        return this as Option<any> & IsNone;
    }

    apply<U>(fn: (option: Option<T>) => U): U {
        return fn(this);
    }

    contains(): boolean {
        return false;
    }

    expect(message: string): T {
        throw new UnwrapNoneError(message);
    }

    filter<U extends T>(): Option<U> {
        return this as Option<any> & IsNone;
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

    map<U>(): Option<U> {
        return this as Option<any> & IsNone;
    }

    mapOr<U>(or: U): Option<U> {
        return Option.some(or);
    }

    mapOrElse<U>(or: () => U): Option<U> {
        return Option.some(or());
    }

    okOr<E>(error: E): Result<T, E> {
        return Result.err(error);
    }

    okOrElse<E>(fn: () => E): Result<T, E> {
        return Result.err(fn());
    }

    or<U>(option: Option<U>): Option<T | U> {
        return option;
    }

    orElse<U>(fn: () => Option<U>): Option<T | U> {
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

    xor(option: Option<T>): Option<T> {
        return option;
    }

    zip<U>(): Option<[T, U]> {
        return this as Option<any>;
    }

    zipWith<_, C>(): Option<C> {
        return this as Option<any> & IsNone;
    }
}
