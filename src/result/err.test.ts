import { EmptyResultError } from "./err";
import * as Result from "./result";
import { Option } from "../option";

describe("[Err]", () => {
    const exampleError = new Error("failure");

    describe("[and]", () => {
        it("should be original error", () => {
            const expected = Result.err(exampleError);
            const actual = expected.and(Result.ok(1));
            expect(actual).toEqual(expected);
        });
    });

    describe("[andThen]", () => {
        it("should be original error", () => {
            const expected = Result.err(exampleError);
            const actual = expected.andThen(() => Result.ok(1));
            expect(actual).toEqual(expected);
        });
    });

    describe("[apply]", () => {
        it("should be callback value", () => {
            const actual = Result.err(exampleError).apply(self =>
                self.isErr(),
            );
            expect(actual).toBe(true);
        });
    });

    describe("[contains]", () => {
        it("should be false", () => {
            const actual = Result.err<Error, number>(
                exampleError,
            ).contains(1);

            expect(actual).toBe(false);
        });
    });

    describe("[containsErr]", () => {
        describe("when value matches contents", () => {
            describe("and value is primitive", () => {
                it("should be true", () => {
                    const actual = Result.err(1).containsErr(1);
                    expect(actual).toBe(true);
                });
            });

            describe("and value is object", () => {
                it("should be true", () => {
                    const object = { a: 1 };
                    const actual = Result.err(object).containsErr(object);
                    expect(actual).toBe(true);
                });
            });
        });

        describe("when value does not match contents", () => {
            describe("and value is primitive", () => {
                it("should be false", () => {
                    const actual = Result.err(1).containsErr(2);
                    expect(actual).toBe(false);
                });
            });

            describe("and value is object", () => {
                it("should be false for object", () => {
                    const object = { a: 1 };
                    const actual = Result.err(object).containsErr({
                        a: 1,
                    });
                    expect(actual).toBe(false);
                });
            });
        });
    });

    describe("[expect]", () => {
        it("should throw appropriate error type", () => {
            const behaviour = () =>
                Result.err(exampleError).expect("message");
            expect(behaviour).toThrowError(EmptyResultError);
        });

        it("should throw error with message", () => {
            const behaviour = () =>
                Result.err(exampleError).expect("message");
            expect(behaviour).toThrowError("message");
        });
    });

    describe("[expectErr]", () => {
        it("should be contained error", () => {
            const actual = Result.err(exampleError).expectErr("message");
            expect(actual).toBe(exampleError);
        });
    });

    describe("[intoErr]", () => {
        it("should be contained error", () => {
            const actual = Result.err(exampleError).intoErr();
            expect(actual).toBe(exampleError);
        });
    });

    describe("[intoOkOrErr]", () => {
        it("should be contained error", () => {
            const actual = Result.err(exampleError).intoOkOrError();
            expect(actual).toBe(exampleError);
        });
    });

    describe("[isErr]", () => {
        it("should be true", () => {
            const actual = Result.err(exampleError).isErr();
            expect(actual).toBe(true);
        });
    });

    describe("[isOk]", () => {
        it("should be false", () => {
            const actual = Result.err(exampleError).isOk();
            expect(actual).toBe(false);
        });
    });

    describe("[iter]", () => {
        it("should be iterator containing no items", () => {
            const iterator = Result.err(exampleError).iter();
            const actual = iterator.next().done;
            expect(actual).toBe(true);
        });
    });

    describe("[map]", () => {
        it("should be none", () => {
            const error = Result.err(exampleError);
            const actual = error.map(value => value + 1);
            expect(actual).toEqual(error);
        });
    });

    describe("[mapErr]", () => {
        it("should be callback value", () => {
            const error = Result.err(1);
            const actual = error.mapErr(value => value + 1);
            expect(actual).toEqual(Result.err(2));
        });
    });

    describe("[mapOr]", () => {
        it("should be default value", () => {
            const actual = Result.err(exampleError).mapOr(
                0,
                value => value + 1,
            );
            expect(actual).toEqual(0);
        });
    });

    describe("[mapOrElse]", () => {
        it("should be default callback value", () => {
            const actual = Result.err<number, string>(1).mapOrElse(
                error => error.toString(),
                value => value + "hello world",
            );

            expect(actual).toEqual("1");
        });
    });

    describe("[ok]", () => {
        it("should be none", () => {
            const actual = Result.err(exampleError).ok();
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[or]", () => {
        it("should be other result", () => {
            const actual = Result.err(exampleError).or(Result.ok(2));
            expect(actual).toEqual(Result.ok(2));
        });
    });

    describe("[orElse]", () => {
        it("should be value of callback", () => {
            const actual = Result.err(1).orElse(value =>
                Result.ok(value + 1),
            );
            expect(actual).toEqual(Result.ok(2));
        });
    });

    describe("[unwrap]", () => {
        it("should throw appropriate error type", () => {
            const behaviour = () => Result.err(exampleError).unwrap();
            expect(behaviour).toThrowError(EmptyResultError);
        });
    });

    describe("[unwrapErr]", () => {
        it("should be contained error", () => {
            const actual = Result.err(exampleError).unwrapErr();
            expect(actual).toBe(exampleError);
        });
    });

    describe("[unwrapOr]", () => {
        it("should be default value", () => {
            const actual = Result.err(exampleError).unwrapOr(0);
            expect(actual).toEqual(0);
        });
    });

    describe("[unwrapOrElse]", () => {
        it("should be callback value ", () => {
            const actual = Result.err(1).unwrapOrElse(value => value + 1);
            expect(actual).toEqual(2);
        });
    });
});
