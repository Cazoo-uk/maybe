import { Option, OptionLike } from "../option";
import { IsOk, OkSymbol, ResultLike } from "./result-like";

export class ResultIsOkError extends Error {}

export class Ok<A, E> implements ResultLike<A, E>, IsOk<A> {
    readonly [OkSymbol] = true;
    constructor(private readonly value: A) {}

    and<B>(result: ResultLike<B, E>): ResultLike<B, E> {
        return result;
    }

    andThen<B>(fn: (value: A) => ResultLike<B, E>): ResultLike<B, E> {
        return fn(this.value);
    }

    apply<T>(fn: (result: ResultLike<A, E>) => T): T {
        return fn(this);
    }

    contains(value: A): boolean {
        return this.value === value;
    }

    containsErr(): boolean {
        return false;
    }

    err(): OptionLike<E> {
        return Option.none();
    }

    expect(): A {
        return this.value;
    }

    expectErr(message: string): E {
        throw new ResultIsOkError(message);
    }

    isErr(): boolean {
        return false;
    }

    isOk(): boolean {
        return true;
    }

    iter(): IterableIterator<A> {
        return [this.value][Symbol.iterator]();
    }

    map<B>(fn: (value: A) => B): ResultLike<B, E> {
        return new Ok(fn(this.value));
    }

    mapErr<F>(): ResultLike<A, F> {
        return this as ResultLike<A, any>;
    }

    mapOr<B>(_: B, fn: (value: A) => B): B {
        return fn(this.value);
    }

    mapOrElse<B>(_: (error: E) => B, fn: (value: A) => B): B {
        return fn(this.value);
    }

    ok(): OptionLike<A> {
        return Option.some(this.value);
    }

    or<B>(): ResultLike<A | B, E> {
        return this;
    }

    orElse<B>(): ResultLike<A | B, E> {
        return this;
    }

    unwrap(): A {
        return this.value;
    }

    unwrapErr(): E {
        throw new ResultIsOkError("unwrap error called on Ok");
    }

    unwrapOr<B>(): A | B {
        return this.value;
    }

    unwrapOrElse<B>(): A | B {
        return this.value;
    }

    intoOk(): A {
        return this.value;
    }
}
