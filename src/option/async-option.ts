import { AsyncResult } from "../result";
import * as Option from "./option";
import { OptionLike } from "./option-like";

/**
 * Type `AsyncOption` represents an optional value that will be the
 * result of a promise. In other words, it represents an optional value
 * where that value isn't yet known.
 *
 * `AsyncOption` is not represented by `Some` and `None` in the same way
 * as {@link OptionLike}. We can't know which it is: as the wrapped value
 * is the result of a promise, we don't know whether it will be there or
 * not when the `AsyncOption` is created.
 *
 * `AsyncOption` is more ergonomic than {@link OptionLike} whenever a
 * promise is involved. See this (slightly contrived) example:
 *
 * ```typescript
 * // using promises
 *
 * function fetchApiKey(): Promise<Option<string>> {
 *     // does something async
 * }
 *
 * function fetchUsers(key: string): Promise<Option<User[]>> {
 *    // does something async with API key
 * }
 *
 * async function sumItemValues(): Promise<number> {
 *     const maybeKey = await fetchApiKey();
 *
 *     if (maybeKey.isNone()) {
 *          return 0;
 *     }
 *
 *     return (await fetchData(maybeKey.intoSome()))
 *         .map(sumItems)
 *         .unwrapOr(0);
 * }
 *
 * // using AsyncOption
 *
 * function fetchApiKey(): AsyncOption<string> {
 *     // does something async
 * }
 *
 * function fetchData(key: string): AsyncOption<Item[]> {
 *    // does something async with API key
 * }
 *
 * function sumItemValues(): Promise<number> {
 *     return fetchApiKey
 *         .andThen(fetchData)
 *         .map(sumItems)
 *         .unwrapOr(0);
 * }
 * ```
 * This example is contrived because we would probably want to use an
 * {@link AsyncResult} in this situation. It nonetheless shows how
 * `AsyncOption` can make asynchronous code more concise!
 *
 * `AsyncOption` exposes a very similar interface to {@link OptionLike}.
 * The key difference is that every `AsyncOption` method is async in some
 * way. If {@link OptionLike} returns a plain value, `AsyncOption` will
 * return a promise of a plain value. If an {@link OptionLike} method
 * wants another option. `AsyncOption` will want another async option.
 *
 * There is another small difference: the async version does not
 * implement {@link OptionLike.apply} but rather exposes a method called
 * {@link AsyncOption.transform}.
 *
 * It's prudent to assume that most async operations have a chance of
 * failing. It usually makes more sense to represent async outcomes
 * using {@like AsyncResult} if you have a choice.
 *
 * We include `AsyncOption` for two reasons:
 * - it's needed to support methods like {@link AsyncResult.ok}
 * - it can be used to handle the results of async operations in an
 * ergonomic way
 */
export class AsyncOption<T> {
    constructor(private readonly promise: Promise<OptionLike<T>>) {}

    /**
     * Convert a synchronous option ({@link OptionLike}) into an
     * {@link AsyncOption}.
     *
     * ```typescript
     * const option = Option.some(1);
     * AsyncOption.fromOption(option);
     * ```
     * @typeParam T Type of wrapped value
     * @param option Option to be converted
     * @since 0.1.0
     */
    static fromOption<T>(option: OptionLike<T>): AsyncOption<T> {
        return this.fromPromise(Promise.resolve(option));
    }

    /**
     * Convert a promise of a synchronous option ({@link OptionLike})
     * into an {@link AsyncOption}.
     *
     * ```typescript
     * const promise = Promise.resolve(Option.some(1));
     * AsyncOption.fromPromise(option);
     * ```
     * @typeParam T Type of wrapped value
     * @param promise Promise of option to be convert
     * @since 0.1.0
     */
    static fromPromise<T>(
        promise: Promise<OptionLike<T>>,
    ): AsyncOption<T> {
        return new AsyncOption(promise);
    }

    /**
     * Create a {@link AsyncOption} that wraps the given value.
     *
     * ```typescript
     * const example = AsyncOption.some(1);
     * ```
     * @typeParam T Type of value to be wrapped
     * @param value Value to be wrapped
     * @since 0.1.0
     */
    static some<T>(value: T): AsyncOption<T> {
        return this.fromOption(Option.some(value));
    }

    /**
     * Create an empty {@link AsyncOption}.
     *
     * ```typescript
     * const example = AsyncOption.none();
     * ```
     * @since 0.1.0
     * @typeParam T Type of wrapped value (for compatibility with
     * {@link AsyncOption} interface)
     */
    static none<T>(): AsyncOption<T> {
        return this.fromOption(Option.none());
    }

    /**
     * Like {@link OptionLike.and} but accepts and returns an async
     * option instead.
     *
     * ```typescript
     * AsyncOption.some(1).and(AsyncOption.some(2));
     * // returns AsyncOption.some(2)
     *
     * AsyncOption.none().and(AsyncOption.some(2));
     * // returns AsyncOption.none()
     * ```
     *
     * @since 0.1.0
     * @typeParam U Type of other option value
     * @param option The other option
     */
    and<U>(option: AsyncOption<U>): AsyncOption<U> {
        return this.unwrapAnd(option, (a, b) => a.and(b));
    }

    /**
     * Like {@link OptionLike.andThen} but:
     * - accepts a callback that returns an {@link AsyncOption}
     * - also returns an {@link AsyncOption}
     *
     * ```typescript
     * AsyncOption.some(1).andThen(v => AsyncOption.some(v + 1));
     * // returns AsyncOption.some(2);
     *
     * AsyncOption.none().andThen(v => AsyncOption.some(v + 1));
     * // returns AsyncOption.none();
     * ```
     * @typeParam U Wrapped value of {@link AsyncOption} returned by `fn`
     * @param fn Calls this with deferred value
     * @since 0.1.0
     */
    andThen<U>(fn: (value: T) => AsyncOption<U>): AsyncOption<U> {
        return new AsyncOption(
            this.promise.then(option =>
                option.isSome()
                    ? fn(option.intoSome()).asPromise()
                    : Option.none(),
            ),
        );
    }

    /**
     * Exposes the underlying promise of an option. There is no need to
     * use this method under normal circumstances!
     *
     * ```typescript
     * AsyncOption.some(1)
     *   .asPromise()
     *   .then(option => option.isSome())
     *
     * // resolves to true
     * ```
     * @todo Should we expose this method at all?
     * @since 0.1.0
     */
    asPromise(): Promise<OptionLike<T>> {
        return this.promise;
    }

    /**
     * Like {@link OptionLike.contains} but returns a promise of a
     * boolean, rather than a boolean.
     *
     * ```typescript
     * AsyncOption.some(1).contains(1);
     * // resolves to true
     *
     * AsyncOption.none().contains(1);
     * // resolves to false
     * ```
     * @param value Check for this value
     * @since 0.1.0
     */
    contains(value: T): Promise<boolean> {
        return this.promise.then(option => option.contains(value));
    }

    /**
     * Like {@link OptionLike.expect} but returns a promise. If `Some`,
     * the promise resolves with the wrapped value, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncOption.some(1).expect("failure");
     * // resolves to 1
     *
     * AsyncOption.none().expect("failure");
     * // rejects
     * ```
     * @param message
     * @since 0.1.0
     */
    expect(message: string): Promise<T> {
        return this.promise.then(option => option.expect(message));
    }

    /**
     * Like {@link OptionLike.filter} but returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).filter(value => value === 1);
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.some(1).filter(value => value === 2);
     * // returns AsyncOption.none()
     *
     * // this predicate narrows a string to a specific literal type
     * const predicate = (value: string): value is "hello" => {
     *     return value === "hello";
     * }
     *
     * AsyncOption.some("hello").filter(predicate);
     * // returns option narrowed to AsyncOption<"hello">
     *
     * AsyncOption.none().filter(value => value === 2);
     * // returns Option.none()
     * ```
     * @typeParam U Narrow option to this type
     * @param fn Call this with wrapped value
     * @since 0.1.0
     */
    filter<U extends T>(fn: (value: T) => value is U): AsyncOption<U>;

    /**
     * Like {@link OptionLike.filter} but returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).filter(value => value === 1);
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.§some(1).filter(value => value === 2);
     * // returns AsyncOption.none()
     *
     * AsyncOption.none().filter(value => value === 2);
     * // returns Option.none()
     * ```
     * @param fn Call this with wrapped value
     * @since 0.1.0
     */
    filter(fn: (value: T) => boolean): AsyncOption<T>;

    filter(fn: (value: T) => boolean): AsyncOption<T> {
        return new AsyncOption(
            this.promise.then(option => option.filter(fn)),
        );
    }

    /**
     * Like {@link OptionLike.isNone} but returns a promise of a boolean.
     * This function cannot be used to for type narrowing because this is
     * not possible with asynchronous code.
     *
     * ```typescript
     * AsyncOption.some(1).isNone();
     * // resolves to false
     *
     * AsyncOption.none().isNone();
     * // resolves to true
     * ```
     * @since 0.1.0
     */
    isNone(): Promise<boolean> {
        return this.promise.then(option => option.isNone());
    }

    /**
     * Like {@link OptionLike.isSome} but returns a promise of a boolean.
     * This function cannot be used to for type narrowing because this is
     * not possible with asynchronous code.
     *
     * ```typescript
     * AsyncOption.some(1).isSome();
     * // resolves to true
     *
     * AsyncOption.none().isSome();
     * // resolves to false
     * ```
     * @since 0.1.0
     */
    isSome(): Promise<boolean> {
        return this.promise.then(option => option.isSome());
    }

    /**
     * Like {@link OptionLike.iter} but returns a promise of an
     * iterator.
     *
     * ```typescript
     * const iterator = await AsyncOption.some(1).iter();
     *
     * iterator.next();
     * // return iterator result of 1
     *
     * iterator.next();
     * // done
     *
     * AsyncOption.none(1).iter().then(iterator => iterator.next());
     * // resolves to done
     * ```
     * @since 0.1.0
     */
    iter(): Promise<IterableIterator<T>> {
        return this.promise.then(option => option.iter());
    }

    /**
     * Like {@link OptionLike.map} but returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).map(value => value + 1);
     * // returns AsyncOption.some(2)
     *
     * AsyncOption.none().map(value => value + 1);
     * // returns AsyncOption.none()
     * ```
     * @typeParam U Callback returns this type
     * @param fn Call wrapped value with this
     * @since 0.1.0
     */
    map<U>(fn: (value: T) => U): AsyncOption<U> {
        return new AsyncOption(
            this.promise.then(option => option.map(fn)),
        );
    }

    /**
     * Like {@link OptionLike.mapOr} but returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).mapOr(0, value => value + 1);
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.none().mapOr(0, value => value + 1);
     * // returns AsyncOption.some(0)
     * ```
     * @typeParam U Map tp option of this type
     * @param or Use this value if option is empty
     * @param fn Call this with wrapped value if non-empty
     * @since 0.1.0
     */
    mapOr<U>(or: U, fn: (value: T) => U): AsyncOption<U> {
        return new AsyncOption(
            this.promise.then(option => option.mapOr(or, fn)),
        );
    }

    /**
     * Like {@link OptionLike.mapOrElse} but returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).mapOrElse(() => 0, value => value + 1);
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.none().mapOrElse(() => 0, value => value + 1);
     * // returns AsyncOption.some(0)
     * ```
     * @typeParam U Map tp option of this type
     * @param or Call this if wrapped value is empty
     * @param fn Call this with wrapped value if non-empty
     * @since 0.1.0
     */
    mapOrElse<U>(or: () => U, fn: (value: T) => U): AsyncOption<U> {
        return new AsyncOption(
            this.promise.then(option => option.mapOrElse(or, fn)),
        );
    }

    /**
     * Like {@link OptionLike.okOr} but returns an {@link AsyncResult}.
     *
     * ```typescript
     * const error = new Error("failure");
     *
     * AsyncOption.some(1).okOr(error);
     * // returns AsyncResult.ok(1)
     *
     * AsyncOption.none().okOr(error);
     * // returns AsyncResult.err(error)
     * ```
     * @typeParam E Error type
     * @param error Return result of this error if option is empty
     * @since 0.1.0
     */
    okOr<E>(error: E): AsyncResult<T, E> {
        return AsyncResult.fromPromise(
            this.promise.then(option => option.okOr(error)),
        );
    }

    /**
     * Like {@link OptionLike.okOrElse} but returns an {@link AsyncResult}.
     *
     * ```typescript
     * const error = new Error("failure");
     *
     * AsyncOption.some(1).okOrElse(() => error);
     * // returns AsyncResult.ok(1)
     *
     * AsyncOption.none().okOrElse(() => error);
     * // returns AsyncResult.err(error)
     * ```
     * @typeParam E Error type
     * @param fn Create result from this callback if option is empty
     * @since 0.1.0
     */
    okOrElse<E>(fn: () => E): AsyncResult<T, E> {
        return AsyncResult.fromPromise(
            this.promise.then(option => option.okOrElse(fn)),
        );
    }

    /**
     * Like {@link OptionLike.or} but accepts an async option and also
     * returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).or(AsyncOption.some(2));
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.none().or(AsyncOption.some(2));
     * // returns AsyncOption.some(2)
     * ```
     * @typeParam U Type of wrapped value in other option
     * @param option Return this if this option is `None`
     * @since 0.1.0
     */
    or<U>(option: AsyncOption<U>): AsyncOption<T | U> {
        return this.unwrapAnd(option, (a, b) => a.or(b));
    }

    /**
     * Like {@link OptionLike.orElse} but:
     * - accepts a function that returns an async option
     * - itself returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).orElse(() => AsyncOption.some(2));
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.none().orElse(() => AsyncOption.some(2));
     * // returns AsyncOption.some(2)
     * ```
     * @typeParam U Type of wrapped value in callback result
     * @param fn Call this if this option is empty
     * @since 0.1.0
     */
    orElse<U>(fn: () => AsyncOption<U>): AsyncOption<T | U> {
        return new AsyncOption(
            this.promise.then<OptionLike<T | U>>(option =>
                option.isSome() ? option : fn().asPromise(),
            ),
        );
    }

    /**
     * Call the provided function with a synchronous version of this
     * option. This fulfils the same role as {@link OptionLike.apply}, in
     * that it can be used to apply a function to this option.
     *
     * ```typescript
     * const nested = AsyncOption.some(Option.some(1))
     * nested.transform(Option.flatten);
     * // returns AsyncOption.some(1)
     * ```
     * @typeParam U Returns async option of this type
     * @param fn Call this the inner option
     * @since 0.1.0
     */
    transform<U>(
        fn: (value: OptionLike<T>) => OptionLike<U>,
    ): AsyncOption<U> {
        return new AsyncOption(this.promise.then(fn));
    }

    /**
     * Like {@link OptionLike.unwrap} but returns a promise. If `Some`,
     * the promise resolves with the wrapped value, else it rejects with
     * an error.
     *
     * ```typescript
     * AsyncOption.some(1).unwrap();
     * // resolves to 1
     *
     * AsyncOption.none().unwrap();
     * // rejects
     * ```
     * @since 0.1.0
     * @throws {@link EmptyOptionError}
     */
    unwrap(): Promise<T> {
        return this.promise.then(option => option.unwrap());
    }

    /**
     * Like {@link OptionLike.unwrapOr} but returns a promise. The promise
     * resolves with the wrapped value or the default.
     *
     * ```typescript
     * AsyncOption.some(1).unwrapOr(0);
     * // resolves to 1
     *
     * AsyncOption.none().unwrapOr(0);
     * // resolves to 0
     * ```
     * @typeParam U Type of default value
     * @throws {@link EmptyOptionError}
     * @since 0.1.0
     */
    unwrapOr<U>(value: U): Promise<T | U> {
        return this.promise.then(option => option.unwrapOr(value));
    }

    /**
     * Like {@link OptionLike.unwrapOrElse} but returns a promise. The
     * promise resolves with the wrapped value or the result of the
     * callback.
     *
     * ```typescript
     * AsyncOption.some(1).unwrapOrElse(() => 0);
     * // returns 1
     *
     * AsyncOption.none().unwrapOrElse(() => 0);
     * // returns 0
     * ```
     * @typeParam U Type returned by callback
     * @param fn Call this and return value if option is empty
     * @since 0.1.0
     */
    unwrapOrElse<U>(fn: () => U): Promise<T | U> {
        return this.promise.then(option => option.unwrapOrElse(fn));
    }

    /**
     * Like {@link OptionLike.xor} but accepts an async option and also
     * returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).xor(AsyncOption.some(2));
     * // returns AsyncOption.none()
     *
     * AsyncOption.some(1).xor(AsyncOption.none());
     * // returns AsyncOption.some(1)
     *
     * AsyncOption.none().xor(AsyncOption.some(2));
     * // returns AsyncOption.some(2)
     *
     * AsyncOption.none().xor(AsyncOption.none());
     * // returns AsyncOption.none()
     * ```
     * @param option The other option
     * @typeParam U Wrapped type of other option
     * @since 0.1.0
     */
    xor<U>(option: AsyncOption<T>): AsyncOption<T | U> {
        return this.unwrapAnd(option, (a, b) => a.xor(b));
    }

    /**
     * Like {@link OptionLike.zip} but accepts an async option and also
     * returns an async option.
     *
     * ```typescript
     * AsyncOption.some(1).zip(AsyncOption.some("a"));
     * // returns AsyncOption.some([1, "a"])
     *
     * AsyncOption.some(1).zip(AsyncOption.none());
     * // returns AsyncOption.none()
     * ```
     * @typeParam U Wrapped type of other option
     * @param option Zip with this option
     * @since 0.1.0
     */
    zip<U>(option: AsyncOption<U>): AsyncOption<[T, U]> {
        return this.unwrapAnd(option, (a, b) => a.zip(b));
    }

    /**
     * Like {@link OptionLike.zipWith} but accepts an async option and
     * also returns an async option.
     *
     * ```typescript
     * AsyncOption.some(2).zipWith(AsyncOption.some(3), (a, b) => a * b);
     * // returns AsyncOption.some(6);
     *
     * AsyncOption.some(1).zipWith(AsyncOption.none(), (a, b) => a * b);
     * // returns AsyncOption.none()
     * ```
     * @typeParam U Wrapped type of other option
     * @typeParam C Type returned by callback
     * @param option Zip with this option
     * @param fn Use this to combine the two wrapped values
     */
    zipWith<U, C>(
        option: AsyncOption<U>,
        fn: (a: T, b: U) => C,
    ): AsyncOption<C> {
        return this.unwrapAnd(option, (a, b) => a.zipWith(b, fn));
    }

    private unwrapAnd<U, C>(
        other: AsyncOption<U>,
        fn: (a: OptionLike<T>, b: OptionLike<U>) => OptionLike<C>,
    ): AsyncOption<C> {
        return new AsyncOption(
            this.promise.then(option =>
                other
                    .asPromise()
                    .then(otherOption => fn(option, otherOption)),
            ),
        );
    }
}
