import { Option, OptionLike } from "../option";
import { IsErr, OkSymbol, ResultLike } from "./result-like";

export class EmptyResultError extends Error {}

export class Err<T, E> implements ResultLike<T, E>, IsErr<E> {
    readonly [OkSymbol] = false;
    constructor(private readonly error: E) {}

    and<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    andThen<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    apply<U>(fn: (result: ResultLike<T, E>) => U): U {
        return fn(this);
    }

    contains(): boolean {
        return false;
    }

    containsErr(error: E): boolean {
        return this.error === error;
    }

    err(): OptionLike<E> {
        return Option.some(this.error);
    }

    expect(message: string): T {
        throw new EmptyResultError(message);
    }

    expectErr(): E {
        return this.error;
    }

    intoOkOrError(): T | E {
        return this.error;
    }

    isErr(): boolean {
        return true;
    }

    isOk(): boolean {
        return false;
    }

    iter(): IterableIterator<T> {
        return [][Symbol.iterator]();
    }

    map<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    mapErr<F>(fn: (error: E) => F): ResultLike<T, F> {
        return new Err(fn(this.error));
    }

    mapOr<B>(or: B): B {
        return or;
    }

    mapOrElse<B>(or: (error: E) => B): B {
        return or(this.error);
    }

    ok(): OptionLike<T> {
        return Option.none();
    }

    or<B>(result: ResultLike<B, E>): ResultLike<T | B, E> {
        return result;
    }

    orElse<B>(fn: (error: E) => ResultLike<B, E>): ResultLike<T | B, E> {
        return fn(this.error);
    }

    unwrap(): T {
        throw new EmptyResultError("unwrap called on Err");
    }

    unwrapErr(): E {
        return this.error;
    }

    intoErr(): E {
        return this.error;
    }

    unwrapOr<B>(or: B): T | B {
        return or;
    }

    unwrapOrElse<B>(fn: (error: E) => B): T | B {
        return fn(this.error);
    }
}
