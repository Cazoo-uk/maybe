import { Option } from "../option";
import * as Result from "./result";
import { ResultIsOkError } from "./result-like";

describe("[Ok]", () => {
    describe("[and]", () => {
        it("should be other result", () => {
            const expected = Result.ok(2);
            const actual = Result.ok(1).and(expected);
            expect(actual).toEqual(expected);
        });
    });

    describe("[andThen]", () => {
        it("should be callback value", () => {
            const actual = Result.ok(1).andThen(value =>
                Result.ok(value + 1),
            );
            expect(actual).toEqual(Result.ok(2));
        });
    });

    describe("[andThen]", () => {
        it("should be callback value", () => {
            const actual = Result.ok(1).andThen(value =>
                Result.ok(value + 1),
            );
            expect(actual).toEqual(Result.ok(2));
        });
    });

    describe("[apply]", () => {
        it("should be callback value", () => {
            const actual = Result.ok(1).apply(self => self.isOk());
            expect(actual).toBe(true);
        });
    });

    describe("[contains]", () => {
        describe("when value matches contents", () => {
            describe("and value is primitive", () => {
                it("should be true", () => {
                    const actual = Result.ok(1).contains(1);
                    expect(actual).toBe(true);
                });
            });

            describe("and value is object", () => {
                it("should be true", () => {
                    const object = { a: 1 };
                    const actual = Result.ok(object).contains(object);
                    expect(actual).toBe(true);
                });
            });
        });

        describe("when value does not match contents", () => {
            describe("and value is primitive", () => {
                it("should be false", () => {
                    const actual = Result.ok(1).contains(2);
                    expect(actual).toBe(false);
                });
            });

            describe("and value is object", () => {
                it("should be false for object", () => {
                    const object = { a: 1 };
                    const actual = Result.ok(object).contains({ a: 1 });
                    expect(actual).toBe(false);
                });
            });
        });
    });

    describe("[containsErr]", () => {
        it("should be false", () => {
            const actual = Result.ok<number, Error>(1).containsErr(
                new Error("error"),
            );

            expect(actual).toBe(false);
        });
    });

    describe("[err]", () => {
        it("should be none", () => {
            const actual = Result.ok(1).err();
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[expect]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).expect("message");
            expect(actual).toEqual(1);
        });
    });

    describe("[expectErr]", () => {
        it("should throw appropriate error type", () => {
            const behaviour = () => Result.ok(1).expectErr("message");
            expect(behaviour).toThrowError(ResultIsOkError);
        });

        it("should throw error with message", () => {
            const behaviour = () => Result.ok(1).expectErr("message");
            expect(behaviour).toThrowError("message");
        });
    });

    describe("[intoOk]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).intoOk();
            expect(actual).toEqual(1);
        });
    });

    describe("[intoOkOrError]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).intoOkOrError();
            expect(actual).toEqual(1);
        });
    });

    describe("[isErr]", () => {
        it("should be false", () => {
            const actual = Result.ok(1).isErr();
            expect(actual).toBe(false);
        });
    });

    describe("[isOk]", () => {
        it("should be true", () => {
            const actual = Result.ok(1).isOk();
            expect(actual).toBe(true);
        });
    });

    describe("[iter]", () => {
        it("should be iterator containing value", () => {
            const iterator = Result.ok(1).iter();
            const actual = iterator.next().value;
            expect(actual).toEqual(1);
        });

        it("should be iterator containing one item", () => {
            const iterator = Result.ok(1).iter();
            iterator.next();
            const actual = iterator.next().done;
            expect(actual).toBe(true);
        });
    });

    describe("[map]", () => {
        it("should be result of callback value", () => {
            const actual = Result.ok(1).map(value => value + 1);
            expect(actual).toEqual(Result.ok(2));
        });
    });

    describe("[mapErr]", () => {
        it("should be same result", () => {
            const actual = Result.ok(1).mapErr(value => value + 1);
            expect(actual).toEqual(Result.ok(1));
        });
    });

    describe("[mapOr]", () => {
        it("should contain callback value", () => {
            const actual = Result.ok(1).mapOr(0, value => value + 1);
            expect(actual).toEqual(2);
        });
    });

    describe("[mapOrElse]", () => {
        it("should contain callback value", () => {
            const actual = Result.ok(1).mapOrElse(
                () => 0,
                value => value + 1,
            );

            expect(actual).toEqual(2);
        });
    });

    describe("[ok]", () => {
        it("should be option of value", () => {
            const actual = Result.ok(1).ok();
            expect(actual).toEqual(Option.some(1));
        });
    });

    describe("[or]", () => {
        it("should be original option", () => {
            const expected = Result.ok(1);
            const actual = expected.or(Result.ok(2));
            expect(actual).toEqual(expected);
        });
    });

    describe("[orElse]", () => {
        it("should be original option", () => {
            const expected = Result.ok(1);
            const actual = expected.orElse(() => Result.ok(2));
            expect(actual).toEqual(expected);
        });
    });

    describe("[unwrap]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).unwrap();
            expect(actual).toEqual(1);
        });
    });

    describe("[unwrapErr]", () => {
        it("should throw appropriate error type", () => {
            const behaviour = () => Result.ok(1).unwrapErr();
            expect(behaviour).toThrowError(ResultIsOkError);
        });
    });

    describe("[unwrapOr]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).unwrapOr(0);
            expect(actual).toEqual(1);
        });
    });

    describe("[unwrapOrElse]", () => {
        it("should be contained value", () => {
            const actual = Result.ok(1).unwrapOrElse(() => 0);
            expect(actual).toEqual(1);
        });
    });
});
