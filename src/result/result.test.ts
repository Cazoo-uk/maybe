import { Option } from "../option";
import * as Result from "./result";

describe("[Result]", () => {
    describe("[isResult]", () => {
        describe("when item is result", () => {
            const cases = [Result.ok(1), Result.err(1)];

            it.each(cases)("should be true", result => {
                expect(Result.isResult(result)).toBe(true);
            });
        });

        describe("when item is not result", () => {
            const cases = [1, "hello"];

            it.each(cases)("should be false", item => {
                expect(Result.isResult(item)).toBe(false);
            });
        });
    });

    describe("[flatten]", () => {
        it("should flatten result nested once", () => {
            const actual = Result.flatten(Result.ok(Result.ok(1)));
            expect(actual).toEqual(Result.ok(1));
        });

        it("should flatten error nested once", () => {
            const error = new Error("failure");
            const actual = Result.flatten(Result.ok(Result.err(error)));
            expect(actual).toEqual(Result.err(error));
        });

        it("should flatten error", () => {
            const error = new Error("failure");
            const actual = Result.flatten(Result.err(error));
            expect(actual).toEqual(Result.err(error));
        });

        it("should not flatten result nested twice", () => {
            const actual = Result.flatten(
                Result.ok(Result.ok(Result.ok(1))),
            );

            expect(actual).toEqual(Result.ok(Result.ok(1)));
        });
    });

    describe("[transpose]", () => {
        describe("when result of option of value", () => {
            it("should be result of option of value", () => {
                const actual = Result.transpose(
                    Result.ok(Option.some(1)),
                );
                expect(actual).toEqual(Option.some(Result.ok(1)));
            });
        });

        describe("when result of error", () => {
            it("should be result of error", () => {
                const error = new Error("failure");
                const actual = Result.transpose(Result.err(error));
                expect(actual).toEqual(Option.some(Result.err(error)));
            });
        });

        describe("when result of option of none", () => {
            it("should be result of none", () => {
                const actual = Result.transpose(Result.ok(Option.none()));
                expect(actual).toEqual(Option.none());
            });
        });
    });
});
