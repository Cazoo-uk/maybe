import { Err } from "./err";
import { Ok } from "./ok";
import { IsErr, IsOk, ResultLike } from "./result-like";
import { Option, OptionLike } from "../option";

export class Result {
    static err = <E, A = never>(
        error: E,
    ): ResultLike<A, E> & IsErr<E> => {
        return new Err(error);
    };

    static flatten = <T, E>(
        result: ResultLike<ResultLike<T, E>, E>,
    ): ResultLike<T, E> => {
        return result.unwrapOrElse(error => Result.err(error));
    };

    static intoOkOrError = <T>(result: ResultLike<T, T>): T => {
        return result.unwrapOrElse(error => error);
    };

    static isResult = <T, E>(value: any): value is ResultLike<T, E> => {
        return value instanceof Ok || value instanceof Err;
    };

    static ok = <T, E = never>(value: T): ResultLike<T, E> & IsOk<T> => {
        return new Ok(value);
    };

    static transpose = <T, E>(
        result: ResultLike<OptionLike<T>, E>,
    ): OptionLike<ResultLike<T, E>> => {
        return result.isOk()
            ? result.intoOk().map(Result.ok)
            : Option.some(result as ResultLike<any, E>);
    };
}
