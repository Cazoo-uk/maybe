import { Option } from "../option";
import { UnwrapErrError, IsErr, OkSymbol, Result } from "./result";

export class Err<T, E> implements Result<T, E>, IsErr<E> {
    readonly [OkSymbol] = false;
    constructor(private readonly error: E) {}

    and<B>(): Result<B, E> {
        return this as Result<any, E>;
    }

    andThen<B>(): Result<B, E> {
        return this as Result<any, E>;
    }

    apply<U>(fn: (result: Result<T, E>) => U): U {
        return fn(this);
    }

    contains(): boolean {
        return false;
    }

    containsErr(error: E): boolean {
        return this.error === error;
    }

    err(): Option<E> {
        return Option.some(this.error);
    }

    expect(message: string): T {
        throw new UnwrapErrError(message);
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

    map<B>(): Result<B, E> {
        return this as Result<any, E>;
    }

    mapErr<F>(fn: (error: E) => F): Result<T, F> {
        return new Err(fn(this.error));
    }

    mapOr<B>(or: B): B {
        return or;
    }

    mapOrElse<B>(or: (error: E) => B): B {
        return or(this.error);
    }

    ok(): Option<T> {
        return Option.none();
    }

    or<B>(result: Result<B, E>): Result<T | B, E> {
        return result;
    }

    orElse<B>(fn: (error: E) => Result<B, E>): Result<T | B, E> {
        return fn(this.error);
    }

    unwrap(): T {
        throw this.error;
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
