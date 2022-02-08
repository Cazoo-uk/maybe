import { Result, ResultLike } from "../result";
import * as Option from "./option";
import { IsNone, OptionLike, SomeSymbol } from "./option-like";

export class EmptyOptionError extends Error {}

export class None<A> implements OptionLike<A>, IsNone {
    readonly [SomeSymbol] = false;

    and<B>(): OptionLike<B> {
        return this as OptionLike<any> & IsNone;
    }

    andThen<B>(): OptionLike<B> {
        return this as OptionLike<any> & IsNone;
    }

    apply<T>(fn: (option: OptionLike<A>) => T): T {
        return fn(this);
    }

    contains(): boolean {
        return false;
    }

    expect(message: string): A {
        throw new EmptyOptionError(message);
    }

    filter<B extends A>(): OptionLike<B> {
        return this as OptionLike<any> & IsNone;
    }

    isNone(): boolean {
        return true;
    }

    isSome(): boolean {
        return false;
    }

    iter(): IterableIterator<A> {
        return [][Symbol.iterator]();
    }

    map<B>(): OptionLike<B> {
        return this as OptionLike<any> & IsNone;
    }

    mapOr<B>(or: B): OptionLike<B> {
        return Option.some(or);
    }

    mapOrElse<B>(or: () => B): OptionLike<B> {
        return Option.some(or());
    }

    okOr<E>(error: E): ResultLike<A, E> {
        return Result.err(error);
    }

    okOrElse<E>(fn: () => E): ResultLike<A, E> {
        return Result.err(fn());
    }

    or<B>(option: OptionLike<B>): OptionLike<A | B> {
        return option;
    }

    orElse<B>(fn: () => OptionLike<B>): OptionLike<A | B> {
        return fn();
    }

    unwrap(): A {
        throw new EmptyOptionError("unwrap called on None");
    }

    unwrapOr<B>(value: B): A | B {
        return value;
    }

    unwrapOrElse<B>(fn: () => B): A | B {
        return fn();
    }

    xor(option: OptionLike<A>): OptionLike<A> {
        return option;
    }

    zip<B>(): OptionLike<[A, B]> {
        return this as OptionLike<any>;
    }

    zipWith<_, C>(): OptionLike<C> {
        return this as OptionLike<any> & IsNone;
    }
}
