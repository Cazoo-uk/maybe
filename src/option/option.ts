import { Result, ResultLike } from "../result";
import { None } from "./none";
import { IsNone, IsSome, OptionLike } from "./option-like";
import { Some } from "./some";

export type Undecided<T> = OptionLike<T> & (IsSome<T> | IsNone);

export const flatten = <T>(
    option: OptionLike<OptionLike<T>>,
): OptionLike<T> => {
    return option.unwrapOr(none());
};

export const from = <T>(value: T | null | undefined): OptionLike<T> => {
    return value === null || value === undefined ? none() : some(value);
};

export const isOption = <T>(value: any): value is OptionLike<T> => {
    return value instanceof Some || value instanceof None;
};

export const none = <T = never>(): OptionLike<T> & IsNone => {
    return new None<T>();
};

export const some = <T>(value: T): OptionLike<T> & IsSome<T> => {
    return new Some(value);
};

export const transpose = <T, E>(
    option: OptionLike<ResultLike<T, E>>,
): ResultLike<OptionLike<T>, E> => {
    return option.isSome()
        ? option.intoSome().map(value => some(value))
        : Result.ok(none());
};

export const unzip = <A, B>(
    option: OptionLike<[A, B]>,
): [OptionLike<A>, OptionLike<B>] => {
    if (option.isSome()) {
        const [a, b] = option.intoSome();
        return [new Some(a), new Some(b)];
    }

    return [none(), none()];
};
