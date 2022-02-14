import { Result, ResultLike } from "../result";
import * as Option from "./option";
import { IsSome, SomeSymbol, OptionLike } from "./option-like";

export class Some<T> implements OptionLike<T>, IsSome<T> {
    readonly [SomeSymbol] = true;
    constructor(private readonly value: T) {}

    and<U>(option: OptionLike<U>): OptionLike<U> {
        return option;
    }

    andThen<U>(fn: (value: T) => OptionLike<U>): OptionLike<U> {
        return fn(this.value);
    }

    apply<U>(fn: (option: OptionLike<T>) => U): U {
        return fn(this);
    }

    contains(value: T): boolean {
        return this.value === value;
    }

    expect(): T {
        return this.value;
    }

    filter<U extends T>(fn: (value: T) => boolean): OptionLike<T | U> {
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

    map<U>(fn: (value: T) => U): OptionLike<U> {
        return new Some(fn(this.value));
    }

    mapOr<U>(_: U, fn: (value: T) => U): OptionLike<U> {
        return this.map(fn);
    }

    mapOrElse<U>(_: () => U, fn: (value: T) => U): OptionLike<U> {
        return this.map(fn);
    }

    okOr<E>(): ResultLike<T, E> {
        return Result.ok(this.value);
    }

    okOrElse<E>(): ResultLike<T, E> {
        return Result.ok(this.value);
    }

    or(): OptionLike<T> {
        return this;
    }

    orElse(): OptionLike<T> {
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

    xor(option: OptionLike<T>): OptionLike<T> {
        return option.isSome() ? Option.none() : this;
    }

    zip<U>(option: OptionLike<U>): OptionLike<[T, U]> {
        return option.map(value => [this.value, value]);
    }

    zipWith<U, Z>(
        option: OptionLike<U>,
        fn: (a: T, b: U) => Z,
    ): OptionLike<Z> {
        return option.map(value => fn(this.value, value));
    }

    intoSome(): T {
        return this.value;
    }
}
