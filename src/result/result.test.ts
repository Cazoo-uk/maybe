import { Option } from "../option";
import * as Result from "./result";

describe("[Result]", () => {
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

    describe("[intoOkOrError]", () => {
        describe("when ok", () => {
            it("should be contained value", () => {
                const actual = Result.intoOkOrError(Result.ok(1));
                expect(actual).toEqual(1);
            });
        });

        describe("when error", () => {
            it("should be error", () => {
                const actual = Result.intoOkOrError(Result.err(1));
                expect(actual).toEqual(1);
            });
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
