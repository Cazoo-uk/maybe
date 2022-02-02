import { Result, ResultLike } from "../result";
import { Option } from "./option";
import { IsSome, OptionLike, SomeSymbol } from "./option-like";

export class Some<A> implements OptionLike<A>, IsSome<A> {
    readonly [SomeSymbol] = true;
    constructor(private readonly value: A) {}

    and<B>(option: OptionLike<B>): OptionLike<B> {
        return option;
    }

    andThen<B>(fn: (value: A) => OptionLike<B>): OptionLike<B> {
        return fn(this.value);
    }

    apply<T>(fn: (option: OptionLike<A>) => T): T {
        return fn(this);
    }

    contains(value: A): boolean {
        return this.value === value;
    }

    expect(): A {
        return this.value;
    }

    filter<B extends A>(fn: (value: A) => boolean): OptionLike<A | B> {
        return fn(this.value) ? this : Option.none();
    }

    isNone(): boolean {
        return false;
    }

    isSome(): boolean {
        return true;
    }

    iter(): IterableIterator<A> {
        return [this.value][Symbol.iterator]();
    }

    map<B>(fn: (value: A) => B): OptionLike<B> {
        return new Some(fn(this.value));
    }

    mapOr<B>(_: B, fn: (value: A) => B): OptionLike<B> {
        return this.map(fn);
    }

    mapOrElse<B>(_: () => B, fn: (value: A) => B): OptionLike<B> {
        return this.map(fn);
    }

    okOr<E>(): ResultLike<A, E> {
        return Result.ok(this.value);
    }

    okOrElse<E>(): ResultLike<A, E> {
        return Result.ok(this.value);
    }

    or(): OptionLike<A> {
        return this;
    }

    orElse(): OptionLike<A> {
        return this.or();
    }

    unwrap(): A {
        return this.value;
    }

    unwrapOr<B>(): A | B {
        return this.unwrap();
    }

    unwrapOrElse<B>(): A | B {
        return this.unwrap();
    }

    xor(option: OptionLike<A>): OptionLike<A> {
        return option.isSome() ? Option.none() : this;
    }

    zip<B>(option: OptionLike<B>): OptionLike<[A, B]> {
        return option.map(value => [this.value, value]);
    }

    zipWith<B, C>(
        option: OptionLike<B>,
        fn: (a: A, b: B) => C,
    ): OptionLike<C> {
        return option.map(value => fn(this.value, value));
    }

    intoSome(): A {
        return this.value;
    }
}
