import { AsyncResult } from "./async-result";
import { EmptyResultError } from "./err";
import { ResultIsOkError } from "./ok";
import { Result } from "./result";
import { ResultLike } from "./result-like";
import { Option } from "../option";

describe("[AsyncResult]", () => {
    const exampleError = new Error("failure");

    describe("[and]", () => {
        describe("when first result has value", () => {
            it("should be content of second result", () => {
                const actual = AsyncResult.ok(1)
                    .and(AsyncResult.ok(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(2));
            });
        });

        describe("when first result is err", () => {
            const cases: AsyncResult<number, Error>[] = [
                AsyncResult.ok(2),
                AsyncResult.err(exampleError),
            ];

            it.each(cases)("should be result of err", result => {
                const actual = AsyncResult.err(exampleError)
                    .and(result)
                    .asPromise();

                return expect(actual).resolves.toEqual(
                    Result.err(exampleError),
                );
            });
        });
    });

    describe("[andThen]", () => {
        describe("when first result has value", () => {
            it("should be callback value", () => {
                const actual = AsyncResult.ok(1)
                    .andThen(value => AsyncResult.ok(value + 1))
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(2));
            });
        });

        describe("when first result is err", () => {
            it("should be result of err", () => {
                const actual = AsyncResult.err<Error>(exampleError)
                    .andThen(value => AsyncResult.ok(value + 1))
                    .asPromise();

                return expect(actual).resolves.toEqual(
                    Result.err(exampleError),
                );
            });
        });
    });

    describe("[apply]", () => {
        it("should be promise of callback value", () => {
            const actual = AsyncResult.ok(1).apply(result =>
                result.unwrap(),
            );

            return expect(actual).resolves.toEqual(1);
        });
    });

    describe("[asPromise]", () => {
        it("should be underlying promise", () => {
            const actual = AsyncResult.ok(1).asPromise();
            return expect(actual).resolves.toEqual(Result.ok(1));
        });
    });

    describe("[contains]", () => {
        describe("when value is contained", () => {
            it("should be promise of true", () => {
                const actual = AsyncResult.ok(1).contains(1);
                return expect(actual).resolves.toBe(true);
            });
        });

        describe("when value is not contained", () => {
            it("should be promise of false", () => {
                const actual = AsyncResult.ok(1).contains(2);
                return expect(actual).resolves.toBe(false);
            });
        });
    });

    describe("[containsErr]", () => {
        describe("when value is contained", () => {
            it("should be promise of true", () => {
                const actual = AsyncResult.err(exampleError).containsErr(
                    exampleError,
                );

                return expect(actual).resolves.toBe(true);
            });
        });

        describe("when value is not contained", () => {
            it("should be promise of false", () => {
                const actual = AsyncResult.err(
                    new Error("something"),
                ).containsErr(exampleError);

                return expect(actual).resolves.toBe(false);
            });
        });
    });

    describe("[err]", () => {
        describe("when is error", () => {
            it("should be option of error", () => {
                const actual = AsyncResult.err(exampleError)
                    .err()
                    .asPromise();

                return expect(actual).resolves.toEqual(
                    Option.some(exampleError),
                );
            });
        });

        describe("when is not error", () => {
            it("should be none", () => {
                const actual = AsyncResult.ok(1)
                    .err()
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[expect]", () => {
        describe("when result of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncResult.ok(1).expect("message");
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when result of err", () => {
            it("should be reject with error", () => {
                const actual = AsyncResult.err(exampleError).expect(
                    "message",
                );

                return expect(actual).rejects.toBeInstanceOf(
                    EmptyResultError,
                );
            });
        });
    });

    describe("[expectErr]", () => {
        describe("when result of error", () => {
            it("should be promise of error", () => {
                const actual = AsyncResult.err(exampleError).expectErr(
                    "message",
                );

                return expect(actual).resolves.toEqual(exampleError);
            });
        });

        describe("when result of err", () => {
            it("should be reject with error", () => {
                const actual = AsyncResult.ok(1).expectErr("message");

                return expect(actual).rejects.toBeInstanceOf(
                    ResultIsOkError,
                );
            });
        });
    });

    describe("[isErr]", () => {
        it("should be promise of boolean", () => {
            const actual = AsyncResult.ok(1).isErr();
            return expect(actual).resolves.toBe(false);
        });
    });

    describe("[isOk]", () => {
        it("should be promise of boolean", () => {
            const actual = AsyncResult.ok(1).isOk();
            return expect(actual).resolves.toBe(true);
        });
    });

    describe("[iter]", () => {
        it("should be promise of iterator", () => {
            const actual = AsyncResult.err(exampleError)
                .iter()
                .then(iter => iter.next());

            return expect(actual).resolves.toEqual({ done: true });
        });
    });

    describe("[map]", () => {
        it("should be promise of callback value", () => {
            const actual = AsyncResult.ok(1)
                .map(value => value + 1)
                .asPromise();

            return expect(actual).resolves.toEqual(Result.ok(2));
        });
    });

    describe("[mapErr]", () => {
        it("should be promise of callback value", () => {
            const actual = AsyncResult.err(exampleError)
                .mapErr(value => value.message)
                .asPromise();

            return expect(actual).resolves.toEqual(Result.err("failure"));
        });
    });

    describe("[mapOr]", () => {
        describe("when result of value", () => {
            it("should be promise of callback value", () => {
                const actual = AsyncResult.ok(1).mapOr(
                    0,
                    value => value + 1,
                );

                return expect(actual).resolves.toEqual(2);
            });
        });

        describe("when result of err", () => {
            it("should be promise of default value", () => {
                const actual = AsyncResult.err(exampleError).mapOr(
                    0,
                    value => value + 1,
                );

                return expect(actual).resolves.toEqual(0);
            });
        });
    });

    describe("[mapOrElse]", () => {
        describe("when result of value", () => {
            it("should be promise of callback value", () => {
                const actual = AsyncResult.ok(1).mapOrElse(
                    () => 0,
                    value => value + 1,
                );

                return expect(actual).resolves.toEqual(2);
            });
        });

        describe("when result of err", () => {
            it("should be promise of default value", () => {
                const actual = AsyncResult.err(exampleError).mapOrElse(
                    () => 0,
                    value => value + 1,
                );

                return expect(actual).resolves.toEqual(0);
            });
        });
    });

    describe("[ok]", () => {
        describe("when result of value", () => {
            it("should be option of value", () => {
                const actual = AsyncResult.ok(1)
                    .ok()
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(1));
            });
        });

        describe("when result of error", () => {
            it("should be none", () => {
                const actual = AsyncResult.err(exampleError)
                    .ok()
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[okOr]", () => {
        describe("when result of value", () => {
            it.todo("should be async result of value");
        });

        describe("when result of err", () => {
            it.todo("should be async result of error");
        });
    });

    describe("[okOr]", () => {
        describe("when result of value", () => {
            it.todo("should be async result of value");
        });

        describe("when result of err", () => {
            it.todo("should be async result of callback value");
        });
    });

    describe("[or]", () => {
        describe("when first result has value", () => {
            it("should be first result", () => {
                const actual = AsyncResult.ok(1)
                    .or(AsyncResult.ok(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(1));
            });
        });

        describe("when first result is err", () => {
            const cases: [
                AsyncResult<number, Error>,
                ResultLike<number, Error>,
            ][] = [
                [AsyncResult.ok(2), Result.ok(2)],
                [AsyncResult.err(exampleError), Result.err(exampleError)],
            ];

            it.each(cases)(
                "should be second result",
                (result, expected) => {
                    const actual = AsyncResult.err(exampleError)
                        .or(result)
                        .asPromise();

                    return expect(actual).resolves.toEqual(expected);
                },
            );
        });
    });

    describe("[orElse]", () => {
        describe("when first result has value", () => {
            it("should be first result", () => {
                const actual = AsyncResult.ok(1)
                    .orElse(() => AsyncResult.ok(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(1));
            });
        });

        describe("when first result is err", () => {
            it("should be callback value", () => {
                const actual = AsyncResult.err(exampleError)
                    .orElse(() => AsyncResult.ok(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(2));
            });
        });
    });

    describe("[transform]", () => {
        it("should apply function to result", () => {
            const actual = AsyncResult.ok(1)
                .transform(result => result.and(Result.ok(2)))
                .asPromise();

            return expect(actual).resolves.toEqual(Result.ok(2));
        });
    });

    describe("[unwrap]", () => {
        describe("when result of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncResult.ok(1).unwrap();
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when result of err", () => {
            it("should reject with error", () => {
                const actual = AsyncResult.err(exampleError).unwrap();

                return expect(actual).rejects.toThrowError(
                    EmptyResultError,
                );
            });
        });
    });

    describe("[unwrapErr]", () => {
        describe("when result of error", () => {
            it("should be promise of value", () => {
                const actual = AsyncResult.err(exampleError).unwrapErr();
                return expect(actual).resolves.toEqual(exampleError);
            });
        });

        describe("when result of value", () => {
            it("should reject with error", () => {
                const actual = AsyncResult.ok(1).unwrapErr();

                return expect(actual).rejects.toThrowError(
                    ResultIsOkError,
                );
            });
        });
    });

    describe("[unwrapOr]", () => {
        describe("when result of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncResult.ok(1).unwrapOr(0);
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when result of err", () => {
            it("should be promise of default value", () => {
                const actual = AsyncResult.err(exampleError).unwrapOr(0);
                return expect(actual).resolves.toEqual(0);
            });
        });
    });

    describe("[unwrapOrElse]", () => {
        describe("when result of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncResult.ok(1).unwrapOrElse(() => 0);
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when result of err", () => {
            it("should be promise of default value", () => {
                const actual = AsyncResult.err(exampleError).unwrapOrElse(
                    () => 0,
                );
                return expect(actual).resolves.toEqual(0);
            });
        });
    });
});
