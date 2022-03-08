import { Option } from "../option";
import { IsOk, OkSymbol, UnwrapOkError, Result } from "./result";

export class Ok<T, E> implements Result<T, E>, IsOk<T> {
    readonly [OkSymbol] = true;
    constructor(private readonly value: T) {}

    and<B>(result: Result<B, E>): Result<B, E> {
        return result;
    }

    andThen<B>(fn: (value: T) => Result<B, E>): Result<B, E> {
        return fn(this.value);
    }

    apply<U>(fn: (result: Result<T, E>) => U): U {
        return fn(this);
    }

    contains(value: T): boolean {
        return this.value === value;
    }

    containsErr(): boolean {
        return false;
    }

    err(): Option<E> {
        return Option.none();
    }

    expect(): T {
        return this.value;
    }

    expectErr(message: string): E {
        throw new UnwrapOkError(message);
    }

    intoOkOrError(): T | E {
        return this.value;
    }

    isErr(): boolean {
        return false;
    }

    isOk(): boolean {
        return true;
    }

    iter(): IterableIterator<T> {
        return [this.value][Symbol.iterator]();
    }

    map<B>(fn: (value: T) => B): Result<B, E> {
        return new Ok(fn(this.value));
    }

    mapErr<F>(): Result<T, F> {
        return this as Result<T, any>;
    }

    mapOr<B>(_: B, fn: (value: T) => B): B {
        return fn(this.value);
    }

    mapOrElse<B>(_: (error: E) => B, fn: (value: T) => B): B {
        return fn(this.value);
    }

    ok(): Option<T> {
        return Option.some(this.value);
    }

    or<B>(): Result<T | B, E> {
        return this;
    }

    orElse<B>(): Result<T | B, E> {
        return this;
    }

    unwrap(): T {
        return this.value;
    }

    unwrapErr(): E {
        throw new UnwrapOkError("unwrap error called on Ok");
    }

    unwrapOr<B>(): T | B {
        return this.value;
    }

    unwrapOrElse<B>(): T | B {
        return this.value;
    }

    intoOk(): T {
        return this.value;
    }
}
