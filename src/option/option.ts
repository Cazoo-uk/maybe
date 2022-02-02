import { Result, ResultLike } from "../result";
import { None } from "./none";
import { IsNone, IsSome, OptionLike, Option } from "./option-like";
import { Some } from "./some";

interface OptionHelpers {
    readonly flatten: <T>(
        option: OptionLike<OptionLike<T>>,
    ) => OptionLike<T>;
    readonly from: <T>(value: T | null | undefined) => Option<T>;
    readonly isOption: <T>(value: any) => value is OptionLike<T>;
    readonly none: <T = never>() => OptionLike<T> & IsNone;
    readonly some: <T>(value: T) => OptionLike<T> & IsSome<T>;
    readonly transpose: <T, E>(
        option: OptionLike<ResultLike<T, E>>,
    ) => ResultLike<OptionLike<T>, E>;
    readonly unzip: <A, B>(
        option: OptionLike<[A, B]>,
    ) => [OptionLike<A>, OptionLike<B>];
}

const Option: OptionHelpers = {
    flatten: <T>(option: OptionLike<OptionLike<T>>): OptionLike<T> => {
        return option.unwrapOr(Option.none());
    },
    from: <T>(value: T | null | undefined): Option<T> => {
        return value === null || value === undefined
            ? Option.none()
            : Option.some(value);
    },
    isOption: <T>(value: any): value is OptionLike<T> => {
        return value instanceof Some || value instanceof None;
    },
    none: <T = never>(): OptionLike<T> & IsNone => {
        return new None<T>();
    },
    some: <T>(value: T): OptionLike<T> & IsSome<T> => {
        return new Some(value);
    },
    transpose: <T, E>(
        option: OptionLike<ResultLike<T, E>>,
    ): ResultLike<OptionLike<T>, E> => {
        return option.isSome()
            ? option.intoSome().map(value => Option.some(value))
            : Result.ok(Option.none());
    },
    unzip: <A, B>(
        option: OptionLike<[A, B]>,
    ): [OptionLike<A>, OptionLike<B>] => {
        if (option.isSome()) {
            const [a, b] = option.intoSome();
            return [new Some(a), new Some(b)];
        }

        return [Option.none(), Option.none()];
    },
};

export { Option };
