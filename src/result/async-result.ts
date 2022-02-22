import { AsyncOption } from "../option";
import * as Result from "./result";
import { ResultLike } from "./result-like";

export class AsyncResult<T, E> {
    constructor(private readonly promise: Promise<ResultLike<T, E>>) {}

    static fromPromise<T, E>(
        result: Promise<ResultLike<T, E>>,
    ): AsyncResult<T, E> {
        return new AsyncResult(result);
    }

    /**
     * Convert a synchronous result ({@link ResultLike}) into an
     * {@link AsyncResult}.
     *
     * ```typescript
     * const result = Result.ok(1);
     * AsyncResult.fromResult(result);
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of err value
     * @param result Result to be converted
     * @since 0.1.0
     */
    static fromResult<T, E>(result: ResultLike<T, E>): AsyncResult<T, E> {
        return this.fromPromise(Promise.resolve(result));
    }

    static ok<T, E = never>(value: T): AsyncResult<T, E> {
        return this.fromResult(Result.ok(value));
    }

    static err<E, T = never>(error: E): AsyncResult<T, E> {
        return this.fromResult(Result.err(error));
    }

    and<U>(result: AsyncResult<U, E>): AsyncResult<U, E> {
        return this.unwrapAnd(result, (a, b) => a.and(b));
    }

    andThen<U>(fn: (value: T) => AsyncResult<U, E>): AsyncResult<U, E> {
        return new AsyncResult(
            this.promise.then(result =>
                result.isOk()
                    ? fn(result.intoOk()).asPromise()
                    : Result.err(result.unwrapErr()),
            ),
        );
    }

    apply<U>(fn: (result: ResultLike<T, E>) => U): Promise<U> {
        return this.promise.then(result => result.apply(fn));
    }

    asPromise(): Promise<ResultLike<T, E>> {
        return this.promise;
    }

    contains(value: T): Promise<boolean> {
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

    expect(message: string): Promise<T> {
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

    iter(): Promise<IterableIterator<T>> {
        return this.promise.then(result => result.iter());
    }

    map<U>(fn: (value: T) => U): AsyncResult<U, E> {
        return new AsyncResult(
            this.promise.then(result => result.map(fn)),
        );
    }

    mapErr<U>(fn: (error: E) => U): AsyncResult<T, U> {
        return new AsyncResult(
            this.promise.then(result => result.mapErr(fn)),
        );
    }

    mapOr<U>(or: U, fn: (value: T) => U): Promise<U> {
        return this.promise.then(result => result.mapOr(or, fn));
    }

    mapOrElse<U>(or: () => U, fn: (value: T) => U): Promise<U> {
        return this.promise.then(result => result.mapOrElse(or, fn));
    }

    ok(): AsyncOption<T> {
        return AsyncOption.fromPromise(
            this.promise.then(result => result.ok()),
        );
    }

    or<U>(result: AsyncResult<U, E>): AsyncResult<T | U, E> {
        return this.unwrapAnd(result, (a, b) => a.or(b));
    }

    orElse<U>(fn: () => AsyncResult<U, E>): AsyncResult<T | U, E> {
        const promise = this.promise.then<ResultLike<T | U, E>>(
            result => {
                return result.isOk() ? result : fn().asPromise();
            },
        );

        return new AsyncResult(promise);
    }

    transform<U, F>(
        fn: (result: ResultLike<T, E>) => ResultLike<U, F>,
    ): AsyncResult<U, F> {
        return new AsyncResult(this.promise.then(fn));
    }

    unwrap(): Promise<T> {
        return this.promise.then(result => result.unwrap());
    }

    unwrapErr(): Promise<E> {
        return this.promise.then(result => result.unwrapErr());
    }

    unwrapOr<U>(value: U): Promise<T | U> {
        return this.promise.then(result => result.unwrapOr(value));
    }

    unwrapOrElse<U>(fn: () => U): Promise<T | U> {
        return this.promise.then(result => result.unwrapOrElse(fn));
    }

    private unwrapAnd<U, C>(
        other: AsyncResult<U, E>,
        fn: (
            a: ResultLike<T, E>,
            b: ResultLike<U, E>,
        ) => ResultLike<C, E>,
    ): AsyncResult<C, E> {
        return new AsyncResult(
            this.promise.then(result =>
                other
                    .asPromise()
                    .then(otherResult => fn(result, otherResult)),
            ),
        );
    }
}
