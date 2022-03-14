import { AsyncOption } from "../option";
import { Result } from "./result";

export class AsyncResult<T, E> {
    constructor(private readonly promise: Promise<Result<T, E>>) {}

    /**
     * Convert a promise of a synchronous result ({@link Result})
     * into an {@link AsyncResult}.
     *
     * ```typescript
     * const promise = Promise.resolve(Result.ok(1));
     * AsyncResult.fromPromiseOfResult(promise);
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of err value
     * @param result Promise to be converted
     * @since 1.1.0
     */
    static fromPromiseOfResult<T, E>(
        result: Promise<Result<T, E>>,
    ): AsyncResult<T, E> {
        return new AsyncResult(result);
    }

    /**
     * Convert a synchronous result ({@link Result}) into an
     * {@link AsyncResult}.
     *
     * ```typescript
     * const result = Result.ok(1);
     * AsyncResult.fromResult(result);
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of err value
     * @param result Result to be converted
     * @since 1.0.1
     */
    static fromResult<T, E>(result: Result<T, E>): AsyncResult<T, E> {
        return this.fromPromiseOfResult(Promise.resolve(result));
    }

    /**
     * Create an OK {@link AsyncResult} that wraps the given value.
     *
     * ```typescript
     * const example = AsyncResult.ok(1);
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of error value
     * @param value Value to be wrapped
     * @since 1.0.1
     */
    static ok<T, E = never>(value: T): AsyncResult<T, E> {
        return this.fromResult(Result.ok(value));
    }

    /**
     * Create a error {@link AsyncResult} that wraps the given error.
     * Note that the error value need not be an instance of `Error`.
     *
     * ```typescript
     * const example = AsyncResult.err(new Error());
     * ```
     * @typeParam T Type of ok value
     * @typeParam E Type of error value
     * @param error Error to be wrapped
     * @since 1.0.1
     */
    static err<E, T = never>(error: E): AsyncResult<T, E> {
        return this.fromResult(Result.err(error));
    }

    /**
     *  {@link AsyncResult.and} but accepts and returns an async
     * result instead.
     *
     * ```typescript
     * AsyncResult.ok(1).and(AsyncResult(2));
     * // returns AsyncResult.ok(2)
     *
     * AsyncResult.err(someError).and(AsyncResult.ok(1));
     * // returns AsyncResult.err(SomeError)
     * ```
     * @typeParam U Ok type of other result
     * @param result The other result
     * @since 1.0.1
     */
    and<U>(result: AsyncResult<U, E>): AsyncResult<U, E> {
        return this.unwrapAnd(result, (a, b) => a.and(b));
    }

    /**
     *  {@link AsyncResult.andThen} but:
     * - accepts a callback that returns an {@link AsyncResult}
     * - also returns an {@link AsyncResult}
     *
     * ```typescript
     * AsyncResult.ok(1).andThen(v => AsyncResult(v + 1));
     * // returns AsyncResult.ok(2)
     *
     * AsyncResult.err(someError).andThen(v => AsyncResult.ok(v + 1));
     * // returns AsyncResult.err(SomeError)
     * ```
     * @typeParam U Ok type of {@link AsyncResult} returned by `fn`
     * @param fn Calls thi with deferred ok value
     * @since 1.0.1
     */
    andThen<U>(fn: (value: T) => AsyncResult<U, E>): AsyncResult<U, E> {
        return new AsyncResult(
            this.promise.then(result =>
                result.isOk()
                    ? fn(result.intoOk()).asPromise()
                    : Result.err(result.unwrapErr()),
            ),
        );
    }

    /**
     * Exposes the underlying promise of an option. There is no need to
     * use this method under normal circumstances!
     *
     * ```typescript
     * AsyncResult.ok(1)
     *   .asPromise()
     *   .then(result => result.isOk())
     *
     * // resolves to true
     * ```
     * @todo Should we expose this method at all?
     * @since 1.0.1
     */
    asPromise(): Promise<Result<T, E>> {
        return this.promise;
    }

    /**
     *  {@link Result.contains} but returns a promise of a
     * boolean, rather than a boolean.
     *
     * ```typescript
     * AsyncResult.ok(1).contains(1);
     * // resolves to true
     *
     * AsyncResult.err(someError).contains(1);
     * // resolves to false
     * ```
     * @param value Check for this value
     * @since 1.0.1
     */
    contains(value: T): Promise<boolean> {
        return this.promise.then(result => result.contains(value));
    }

    /**
     *  {@link Result.containsErr} but returns a promise of a
     * boolean, rather than a boolean.
     *
     * ```typescript
     * AsyncResult.ok(1).containsErr(1);
     * // resolves to false
     *
     * AsyncResult.err(someError).containsErr(someError);
     * // resolves to true
     * ```
     * @param error Check for this error
     * @since 1.0.1
     */
    containsErr(error: E): Promise<boolean> {
        return this.promise.then(result => result.containsErr(error));
    }

    /**
     *  {@link Result.err} but returns an {@link AsyncOption}.
     *
     * ```typescript
     * AsyncResult.ok(1).err();
     * // returns AsyncOption.none()
     *
     * AsyncResult.err(someError).err();
     * // returns AsyncOption.some(someError)
     * ```
     * @since 1.0.1
     */
    err(): AsyncOption<E> {
        return AsyncOption.fromPromiseOfOption(
            this.promise.then(result => result.err()),
        );
    }

    /**
     *  {@link Result.expect} but returns a promise. If `Ok`,
     * the promise resolves with the ok value, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncResult.ok(1).expect("failure");
     * // resolves to 1
     *
     * AsyncResult.err(someError).expect("failure");
     * // rejects
     * ```
     * @param message
     * @since 1.0.1
     */
    expect(message: string): Promise<T> {
        return this.promise.then(result => result.expect(message));
    }

    /**
     *  {@link Result.expectErr} but returns a promise. If `Err`,
     * the promise resolves with the error value, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncResult.ok(1).expect("failure");
     * // rejects
     *
     * AsyncResult.err(someError).expect("failure");
     * // resolves to someError
     * ```
     * @param message
     * @since 1.0.1
     */
    expectErr(message: string): Promise<E> {
        return this.promise.then(result => result.expectErr(message));
    }

    /**
     *  {@link Result.isErr} but returns a promise of a boolean.
     * This function cannot be used to for type narrowing because this is
     * not possible with asynchronous code.
     *
     * ```typescript
     * AsyncResult.ok(1).isErr();
     * // resolves to false
     *
     * AsyncResult.err(someError).isErr();
     * // resolves to true
     * ```
     * @since 1.0.1
     */
    isErr(): Promise<boolean> {
        return this.promise.then(result => result.isErr());
    }

    /**
     *  {@link Result.isOk} but returns a promise of a boolean.
     * This function cannot be used to for type narrowing because this is
     * not possible with asynchronous code.
     *
     * ```typescript
     * AsyncResult.ok(1).isOk();
     * // resolves to true
     *
     * AsyncResult.err(someError).isOk();
     * // resolves to false
     * ```
     * @since 1.0.1
     */
    isOk(): Promise<boolean> {
        return this.promise.then(result => result.isOk());
    }

    /**
     *  {@link Result.iter} but returns a promise of an
     * iterator.
     *
     * ```typescript
     * const iterator = await AsyncResult.ok(1).iter();
     *
     * iterator.next();
     * // return iterator result of 1
     *
     * iterator.next();
     * // done
     *
     * AsyncResult.err(someError).iter().then(iterator => iterator.next());
     * // resolves to done
     * ```
     * @since 1.0.1
     */
    iter(): Promise<IterableIterator<T>> {
        return this.promise.then(result => result.iter());
    }

    /**
     *  {@link Result.map} but returns an {@link AsyncResult}.
     *
     * ```typescript
     * AsyncResult.ok(1).map(value => value + 1);
     * // returns AsyncResult.ok(2)
     *
     * AsyncResult.err(someError).map(value => value + 1);
     * // returns AsyncResult.err(someError)
     * ```
     * @typeParam U Callback returns this type
     * @param fn Call wrapped value with this
     * @since 1.0.1
     */
    map<U>(fn: (value: T) => U): AsyncResult<U, E> {
        return new AsyncResult(
            this.promise.then(result => result.map(fn)),
        );
    }

    /**
     *  {@link Result.mapErr} but returns an {@link AsyncResult}.
     *
     * ```typescript
     * AsyncResult.ok(1).mapErr(error => error.toUpperCase());
     * // returns AsyncResult.ok(1)
     *
     * AsyncResult.err("error").mapErr(error => error.toUpperCase());
     * // returns AsyncResult.err("ERROR")
     * ```
     * @typeParam U Callback returns this type
     * @param fn Call wrapped error with this
     * @since 1.0.1
     */
    mapErr<U>(fn: (error: E) => U): AsyncResult<T, U> {
        return new AsyncResult(
            this.promise.then(result => result.mapErr(fn)),
        );
    }

    /**
     * {@link Result.mapOr} but returns a promise of a value.
     *
     * ```typescript
     * AsyncResult.ok(1).mapOr(0, value => value + 1);
     * // resolves to 1
     *
     * AsyncResult.err(someError).mapOr(0, value => value + 1);
     * // resolves to 0
     * ```
     * @typeParam U Map to value of this type
     * @param or Use this value if `Err`
     * @param fn Call this with wrapped value if `Ok`
     * @since 1.0.1
     */
    mapOr<U>(or: U, fn: (value: T) => U): Promise<U> {
        return this.promise.then(result => result.mapOr(or, fn));
    }

    /**
     *  {@link Result.mapOrElse} but returns a promise of a
     * value.
     *
     * ```typescript
     * AsyncResult.ok(1).mapOrElseElse(() => 0, value => value + 1);
     * // resolves to 1
     *
     * AsyncResult.err(1).mapOrElse(error => error - 1, value => value + 1);
     * // resolves to 0
     * ```
     * @typeParam U Map to value of this type
     * @param or Use this value if `Err`
     * @param fn Call this with wrapped value if `Ok`
     * @since 1.0.1
     */
    mapOrElse<U>(or: (error: E) => U, fn: (value: T) => U): Promise<U> {
        return this.promise.then(result => result.mapOrElse(or, fn));
    }

    /**
     *  {@link Result.ok} but returns an {@link AsyncOption}.
     *
     * ```typescript
     * AsyncResult.ok(1).ok();
     * // returns AsyncOption.some(1)
     *
     * AsyncResult.err(someError).ok();
     * // returns AsyncOption.none()
     * ```
     * @since 1.0.1
     */
    ok(): AsyncOption<T> {
        return AsyncOption.fromPromiseOfOption(
            this.promise.then(result => result.ok()),
        );
    }

    /**
     *  {@link Result.or} but accepts an {@link AsyncResult} and
     * also returns one.
     *
     * ```typescript
     * AsyncResult.ok(1).or(AsyncResult.ok(2));
     * // returns AsyncResult.ok(1)
     *
     * AsyncResult.err(exampleError).or(AsyncResult.ok(2));
     * // returns AsyncResult.ok(2)
     * ```
     * @typeParam U Ok type of other result
     * @param result Return this if this result is `Err`
     * @since 1.0.1
     */
    or<U>(result: AsyncResult<U, E>): AsyncResult<T | U, E> {
        return this.unwrapAnd(result, (a, b) => a.or(b));
    }

    /**
     * {@link Result.orElse} but:
     * - accepts a function that returns an async option
     * - itself returns an async option.
     *
     * ```typescript
     * AsyncResult.ok(1).orElse(() => AsyncResult.ok(2));
     * // returns AsyncResult.ok(1)
     *
     * AsyncResult.err(1).orElse(error => AsyncResult.ok(error - 1));
     * // returns AsyncResult.ok(2)
     * ```
     * @typeParam U Ok type of result returned in callback
     * @param fn Call this if this result is `Err`
     * @since 1.0.1
     */
    orElse<U>(
        fn: (error: E) => AsyncResult<U, E>,
    ): AsyncResult<T | U, E> {
        const promise = this.promise.then<Result<T | U, E>>(result => {
            return result.isErr()
                ? fn(result.intoErr()).asPromise()
                : result;
        });

        return new AsyncResult(promise);
    }

    /**
     * Call the provided function with a synchronous version of this
     * result. This fulfils the same role as {@link Result.apply}, in
     * that it can be used to apply a function to this result.
     *
     * ```typescript
     * const nested = AsyncResult.ok(Result.ok(1))
     * nested.transform(Result.flatten);
     * // returns AsyncResult.ok(1)
     * ```
     * @typeParam U Returns {@link AsyncResult} of this type
     * @param fn Call this the inner result
     * @since 1.0.1
     */
    transform<U, F>(
        fn: (result: Result<T, E>) => Result<U, F>,
    ): AsyncResult<U, F> {
        return new AsyncResult(this.promise.then(fn));
    }

    /**
     *  {@link Result.unwrap} but returns a promise. If `Ok`,
     * the promise resolves with the wrapped value, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncResult.ok(1).unwrap();
     * // resolves to 1
     *
     * AsyncResult.err(someError).unwrap();
     * // rejects
     * ```
     * @since 1.0.1
     * @throws {@link EmptyResultError}
     */
    unwrap(): Promise<T> {
        return this.promise.then(result => result.unwrap());
    }

    /**
     *  {@link Result.unwrapErr} but returns a promise. If `Err`,
     * the promise resolves with the wrapped error, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncResult.ok(1).unwrap();
     * // rejects
     *
     * AsyncResult.err(someError).unwrap();
     * // resolves with someError
     * ```
     * @since 1.0.1
     * @throws {@link ResultIsOkError}
     */
    unwrapErr(): Promise<E> {
        return this.promise.then(result => result.unwrapErr());
    }

    /**
     *  {@link Result.unwrapOr} but returns a promise. The
     * promise resolves with the wrapped value (if `Ok`) or the default.
     *
     * ```typescript
     * AsyncResult.ok(1).unwrapOr(0);
     * // resolves to 1
     *
     * AsyncResult.err(someError).unwrapOr(0);
     * // resolves to 0
     * ```
     * @typeParam U Type of default value
     * @since 1.0.1
     */
    unwrapOr<U>(value: U): Promise<T | U> {
        return this.promise.then(result => result.unwrapOr(value));
    }

    /**
     *  {@link Result.unwrapOrElse} but returns a promise. The
     * promise resolves with the wrapped value (if `Ok`) or the result of
     * the callback.
     *
     * ```typescript
     * AsyncResult.ok(1).unwrapOrElse(() => 0);
     * // returns 1
     *
     * AsyncResult.err(someError).unwrapOrElse(() => 0);
     * // returns 0
     * ```
     * @typeParam U Type returned by callback
     * @param fn Call this and return value if result is `Err`
     * @since 1.0.1
     */
    unwrapOrElse<U>(fn: (error: E) => U): Promise<T | U> {
        return this.promise.then(result => result.unwrapOrElse(fn));
    }

    private unwrapAnd<U, C>(
        other: AsyncResult<U, E>,
        fn: (a: Result<T, E>, b: Result<U, E>) => Result<C, E>,
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
