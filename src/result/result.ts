import { Err } from "./err";
import { Ok } from "./ok";
import { IsErr, IsOk, ResultLike } from "./result-like";
import { Option, OptionLike } from "../option";

export type Undecided<T, E> = ResultLike<T, E> & (IsOk<T> | IsErr<E>);

export const err = <E, A = never>(
    error: E,
): ResultLike<A, E> & IsErr<E> => {
    return new Err(error);
};

export const flatten = <T, E>(
    result: ResultLike<ResultLike<T, E>, E>,
): ResultLike<T, E> => {
    return result.unwrapOrElse(error => err(error));
};

export const intoOkOrError = <T>(result: ResultLike<T, T>): T => {
    return result.unwrapOrElse(error => error);
};

export const isResult = <T, E>(value: any): value is ResultLike<T, E> => {
    return value instanceof Ok || value instanceof Err;
};

export const ok = <T, E = never>(
    value: T,
): ResultLike<T, E> & IsOk<T> => {
    return new Ok(value);
};

export const transpose = <T, E>(
    result: ResultLike<OptionLike<T>, E>,
): OptionLike<ResultLike<T, E>> => {
    return result.isOk()
        ? result.intoOk().map(ok)
        : Option.some(result as ResultLike<any, E>);
};
