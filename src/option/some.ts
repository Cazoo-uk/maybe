import { Result } from "../result";
import { IsSome, Option, SomeSymbol } from "./option";

export class Some<T> implements Option<T>, IsSome<T> {
    readonly [SomeSymbol] = true;
    constructor(private readonly value: T) {}

    and<U>(option: Option<U>): Option<U> {
        return option;
    }

    andThen<U>(fn: (value: T) => Option<U>): Option<U> {
        return fn(this.value);
    }

    apply<U>(fn: (option: Option<T>) => U): U {
        return fn(this);
    }

    contains(value: T): boolean {
        return this.value === value;
    }

    expect(): T {
        return this.value;
    }

    filter<U extends T>(fn: (value: T) => boolean): Option<T | U> {
        return fn(this.value) ? this : Option.none();
    }

    isNone(): boolean {
        return false;
    }

    isSome(): boolean {
        return true;
    }

    iter(): IterableIterator<T> {
        return [this.value][Symbol.iterator]();
    }

    map<U>(fn: (value: T) => U): Option<U> {
        return new Some(fn(this.value));
    }

    mapOr<U>(_: U, fn: (value: T) => U): Option<U> {
        return this.map(fn);
    }

    mapOrElse<U>(_: () => U, fn: (value: T) => U): Option<U> {
        return this.map(fn);
    }

    okOr<E>(): Result<T, E> {
        return Result.ok(this.value);
    }

    okOrElse<E>(): Result<T, E> {
        return Result.ok(this.value);
    }

    or(): Option<T> {
        return this;
    }

    orElse(): Option<T> {
        return this.or();
    }

    unwrap(): T {
        return this.value;
    }

    unwrapOr<U>(): T | U {
        return this.unwrap();
    }

    unwrapOrElse<U>(): T | U {
        return this.unwrap();
    }

    xor(option: Option<T>): Option<T> {
        return option.isSome() ? Option.none() : this;
    }

    zip<U>(option: Option<U>): Option<[T, U]> {
        return option.map(value => [this.value, value]);
    }

    zipWith<U, Z>(option: Option<U>, fn: (a: T, b: U) => Z): Option<Z> {
        return option.map(value => fn(this.value, value));
    }

    intoSome(): T {
        return this.value;
    }
}
