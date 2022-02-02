import { Option, OptionLike } from "../option";
import { IsErr, OkSymbol, ResultLike } from "./result-like";

export class EmptyResultError extends Error {}

export class Err<A, E> implements ResultLike<A, E>, IsErr<E> {
    readonly [OkSymbol] = false;
    constructor(private readonly error: E) {}

    and<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    andThen<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    apply<T>(fn: (result: ResultLike<A, E>) => T): T {
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

    expect(message: string): A {
        throw new EmptyResultError(message);
    }

    expectErr(): E {
        return this.error;
    }

    isErr(): boolean {
        return true;
    }

    isOk(): boolean {
        return false;
    }

    iter(): IterableIterator<A> {
        return [][Symbol.iterator]();
    }

    map<B>(): ResultLike<B, E> {
        return this as ResultLike<any, E>;
    }

    mapErr<F>(fn: (error: E) => F): ResultLike<A, F> {
        return new Err(fn(this.error));
    }

    mapOr<B>(or: B): B {
        return or;
    }

    mapOrElse<B>(or: (error: E) => B): B {
        return or(this.error);
    }

    ok(): OptionLike<A> {
        return Option.none();
    }

    or<B>(result: ResultLike<B, E>): ResultLike<A | B, E> {
        return result;
    }

    orElse<B>(fn: (error: E) => ResultLike<B, E>): ResultLike<A | B, E> {
        return fn(this.error);
    }

    unwrap(): A {
        throw new EmptyResultError("unwrap called on Err");
    }

    unwrapErr(): E {
        return this.error;
    }

    intoErr(): E {
        return this.error;
    }

    unwrapOr<B>(or: B): A | B {
        return or;
    }

    unwrapOrElse<B>(fn: (error: E) => B): A | B {
        return fn(this.error);
    }
}
