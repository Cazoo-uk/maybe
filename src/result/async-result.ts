import { AsyncOption } from "../option";
import * as Result from "./result";
import { ResultLike } from "./result-like";

export class AsyncResult<A, E> {
    constructor(private readonly promise: Promise<ResultLike<A, E>>) {}

    static fromPromise<T, E>(
        result: Promise<ResultLike<T, E>>,
    ): AsyncResult<T, E> {
        return new AsyncResult(result);
    }

    static fromResult<T, E>(result: ResultLike<T, E>): AsyncResult<T, E> {
        return this.fromPromise(Promise.resolve(result));
    }

    static ok<T, E = never>(value: T): AsyncResult<T, E> {
        return this.fromResult(Result.ok(value));
    }

    static err<E, T = never>(error: E): AsyncResult<T, E> {
        return this.fromResult(Result.err(error));
    }

    and<B>(result: AsyncResult<B, E>): AsyncResult<B, E> {
        return this.unwrapAnd(result, (a, b) => a.and(b));
    }

    andThen<B>(fn: (value: A) => AsyncResult<B, E>): AsyncResult<B, E> {
        return new AsyncResult(
            this.promise.then(result =>
                result.isOk()
                    ? fn(result.intoOk()).asPromise()
                    : Result.err(result.unwrapErr()),
            ),
        );
    }

    apply<T>(fn: (result: ResultLike<A, E>) => T): Promise<T> {
        return this.promise.then(result => result.apply(fn));
    }

    asPromise(): Promise<ResultLike<A, E>> {
        return this.promise;
    }

    contains(value: A): Promise<boolean> {
        return this.promise.then(result => result.contains(value));
    }

    containsErr(error: E): Promise<boolean> {
        return this.promise.then(result => result.containsErr(error));
    }

    err(): AsyncOption<E> {
        return AsyncOption.fromPromise(
            this.promise.then(result => result.err()),
        );
    }

    expect(message: string): Promise<A> {
        return this.promise.then(result => result.expect(message));
    }

    expectErr(message: string): Promise<E> {
        return this.promise.then(result => result.expectErr(message));
    }

    isErr(): Promise<boolean> {
        return this.promise.then(result => result.isErr());
    }

    isOk(): Promise<boolean> {
        return this.promise.then(result => result.isOk());
    }

    iter(): Promise<IterableIterator<A>> {
        return this.promise.then(result => result.iter());
    }

    map<B>(fn: (value: A) => B): AsyncResult<B, E> {
        return new AsyncResult(
            this.promise.then(result => result.map(fn)),
        );
    }

    mapErr<B>(fn: (error: E) => B): AsyncResult<A, B> {
        return new AsyncResult(
            this.promise.then(result => result.mapErr(fn)),
        );
    }

    mapOr<B>(or: B, fn: (value: A) => B): Promise<B> {
        return this.promise.then(result => result.mapOr(or, fn));
    }

    mapOrElse<B>(or: () => B, fn: (value: A) => B): Promise<B> {
        return this.promise.then(result => result.mapOrElse(or, fn));
    }

    ok(): AsyncOption<A> {
        return AsyncOption.fromPromise(
            this.promise.then(result => result.ok()),
        );
    }

    or<B>(result: AsyncResult<B, E>): AsyncResult<A | B, E> {
        return this.unwrapAnd(result, (a, b) => a.or(b));
    }

    orElse<B>(fn: () => AsyncResult<B, E>): AsyncResult<A | B, E> {
        const promise = this.promise.then<ResultLike<A | B, E>>(
            result => {
                return result.isOk() ? result : fn().asPromise();
            },
        );

        return new AsyncResult(promise);
    }

    transform<B, F>(
        fn: (result: ResultLike<A, E>) => ResultLike<B, F>,
    ): AsyncResult<B, F> {
        return new AsyncResult(this.promise.then(fn));
    }

    unwrap(): Promise<A> {
        return this.promise.then(result => result.unwrap());
    }

    unwrapErr(): Promise<E> {
        return this.promise.then(result => result.unwrapErr());
    }

    unwrapOr<B>(value: B): Promise<A | B> {
        return this.promise.then(result => result.unwrapOr(value));
    }

    unwrapOrElse<B>(fn: () => B): Promise<A | B> {
        return this.promise.then(result => result.unwrapOrElse(fn));
    }

    private unwrapAnd<B, T>(
        other: AsyncResult<B, E>,
        fn: (
            a: ResultLike<A, E>,
            b: ResultLike<B, E>,
        ) => ResultLike<T, E>,
    ): AsyncResult<T, E> {
        return new AsyncResult(
            this.promise.then(result =>
                other
                    .asPromise()
                    .then(otherResult => fn(result, otherResult)),
            ),
        );
    }
}
