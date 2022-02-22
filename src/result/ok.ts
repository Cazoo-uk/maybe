import { Option, OptionLike } from "../option";
import { IsOk, OkSymbol, ResultLike } from "./result-like";

export class Ok<T, E> implements ResultLike<T, E>, IsOk<T> {
    readonly [OkSymbol] = true;
    constructor(private readonly value: T) {}

    and<B>(result: ResultLike<B, E>): ResultLike<B, E> {
        return result;
    }

    andThen<B>(fn: (value: T) => ResultLike<B, E>): ResultLike<B, E> {
        return fn(this.value);
    }

    apply<U>(fn: (result: ResultLike<T, E>) => U): U {
        return fn(this);
    }

    contains(value: T): boolean {
        return this.value === value;
    }

    containsErr(): boolean {
        return false;
    }

    err(): OptionLike<E> {
        return Option.none();
    }

    expect(): T {
        return this.value;
    }

    expectErr(message: string): E {
        throw new ResultIsOkError(message);
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

    map<B>(fn: (value: T) => B): ResultLike<B, E> {
        return new Ok(fn(this.value));
    }

    mapErr<F>(): ResultLike<T, F> {
        return this as ResultLike<T, any>;
    }

    mapOr<B>(_: B, fn: (value: T) => B): B {
        return fn(this.value);
    }

    mapOrElse<B>(_: (error: E) => B, fn: (value: T) => B): B {
        return fn(this.value);
    }

    ok(): OptionLike<T> {
        return Option.some(this.value);
    }

    or<B>(): ResultLike<T | B, E> {
        return this;
    }

    orElse<B>(): ResultLike<T | B, E> {
        return this;
    }

    unwrap(): T {
        return this.value;
    }

    unwrapErr(): E {
        throw new ResultIsOkError("unwrap error called on Ok");
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
