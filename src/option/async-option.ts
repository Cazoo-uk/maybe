import { AsyncResult } from "../result";
import { OptionLike } from "./option-like";
import { Option } from "./option";

export class AsyncOption<A> {
    constructor(private readonly promise: Promise<OptionLike<A>>) {}

    static fromOption<T>(option: OptionLike<T>): AsyncOption<T> {
        return this.fromPromise(Promise.resolve(option));
    }

    static fromPromise<T>(
        option: Promise<OptionLike<T>>,
    ): AsyncOption<T> {
        return new AsyncOption(option);
    }

    static some<T>(value: T): AsyncOption<T> {
        return this.fromOption(Option.some(value));
    }

    static none<T>(): AsyncOption<T> {
        return this.fromOption(Option.none());
    }

    and<B>(option: AsyncOption<B>): AsyncOption<B> {
        return this.unwrapAnd(option, (a, b) => a.and(b));
    }

    andThen<B>(fn: (value: A) => AsyncOption<B>): AsyncOption<B> {
        return new AsyncOption(
            this.promise.then(option =>
                option.isSome()
                    ? fn(option.intoSome()).asPromise()
                    : Option.none(),
            ),
        );
    }

    apply<T>(fn: (option: AsyncOption<A>) => T): T {
        return fn(this);
    }

    asPromise(): Promise<OptionLike<A>> {
        return this.promise;
    }

    contains(value: A): Promise<boolean> {
        return this.promise.then(option => option.contains(value));
    }

    expect(message: string): Promise<A> {
        return this.promise.then(option => option.expect(message));
    }

    filter<B extends A>(fn: (value: A) => value is B): AsyncOption<B>;
    filter(fn: (value: A) => boolean): AsyncOption<A>;

    filter(fn: (value: A) => boolean): AsyncOption<A> {
        return new AsyncOption(
            this.promise.then(option => option.filter(fn)),
        );
    }

    isNone(): Promise<boolean> {
        return this.promise.then(option => option.isNone());
    }

    isSome(): Promise<boolean> {
        return this.promise.then(option => option.isSome());
    }

    iter(): Promise<IterableIterator<A>> {
        return this.promise.then(option => option.iter());
    }

    map<B>(fn: (value: A) => B): AsyncOption<B> {
        return new AsyncOption(
            this.promise.then(option => option.map(fn)),
        );
    }

    mapOr<B>(or: B, fn: (value: A) => B): AsyncOption<B> {
        return new AsyncOption(
            this.promise.then(option => option.mapOr(or, fn)),
        );
    }

    mapOrElse<B>(or: () => B, fn: (value: A) => B): AsyncOption<B> {
        return new AsyncOption(
            this.promise.then(option => option.mapOrElse(or, fn)),
        );
    }

    okOr<E>(error: E): AsyncResult<A, E> {
        return AsyncResult.fromPromise(
            this.promise.then(option => option.okOr(error)),
        );
    }

    okOrElse<E>(fn: () => E): AsyncResult<A, E> {
        return AsyncResult.fromPromise(
            this.promise.then(option => option.okOrElse(fn)),
        );
    }

    or<B>(other: AsyncOption<B>): AsyncOption<A | B> {
        return this.unwrapAnd(other, (a, b) => a.or(b));
    }

    orElse<B>(fn: () => AsyncOption<B>): AsyncOption<A | B> {
        return new AsyncOption(
            this.promise.then<OptionLike<A | B>>(option =>
                option.isSome() ? option : fn().asPromise(),
            ),
        );
    }

    transform<B>(
        fn: (value: OptionLike<A>) => OptionLike<B>,
    ): AsyncOption<B> {
        return new AsyncOption(this.promise.then(fn));
    }

    unwrap(): Promise<A> {
        return this.promise.then(option => option.unwrap());
    }

    unwrapOr<B>(value: B): Promise<A | B> {
        return this.promise.then(option => option.unwrapOr(value));
    }

    unwrapOrElse<B>(fn: () => B): Promise<A | B> {
        return this.promise.then(option => option.unwrapOrElse(fn));
    }

    xor<B>(option: AsyncOption<A>): AsyncOption<A | B> {
        return this.unwrapAnd(option, (a, b) => a.xor(b));
    }

    zip<B>(option: AsyncOption<B>): AsyncOption<[A, B]> {
        return this.unwrapAnd(option, (a, b) => a.zip(b));
    }

    zipWith<B, C>(
        option: AsyncOption<B>,
        fn: (a: A, b: B) => C,
    ): AsyncOption<C> {
        return this.unwrapAnd(option, (a, b) => a.zipWith(b, fn));
    }

    private unwrapAnd<B, T>(
        other: AsyncOption<B>,
        fn: (a: OptionLike<A>, b: OptionLike<B>) => OptionLike<T>,
    ): AsyncOption<T> {
        return new AsyncOption(
            this.promise.then(option =>
                other
                    .asPromise()
                    .then(otherOption => fn(option, otherOption)),
            ),
        );
    }
}
