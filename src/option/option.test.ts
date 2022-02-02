import { Result } from "../result";
import { Option } from "./option";

describe("[Option]", () => {
    describe("[flatten]", () => {
        it("should flatten option nested once", () => {
            const actual = Option.flatten(Option.some(Option.some(1)));
            expect(actual).toEqual(Option.some(1));
        });

        it("should not flatten option nested twice", () => {
            const actual = Option.flatten(
                Option.some(Option.some(Option.some(1))),
            );

            expect(actual).toEqual(Option.some(Option.some(1)));
        });
    });

    describe("[transpose]", () => {
        describe("when option of result of value", () => {
            it("should be result of option of value", () => {
                const actual = Option.transpose(
                    Option.some(Result.ok(1)),
                );

                expect(actual).toEqual(Result.ok(Option.some(1)));
            });
        });

        describe("when option of result of error", () => {
            it("should be result of error", () => {
                const error = new Error("failure");

                const actual = Option.transpose(
                    Option.some(Result.err(error)),
                );

                expect(actual).toEqual(Result.err(error));
            });
        });

        describe("when none", () => {
            it("should result of none", () => {
                const actual = Option.transpose(Option.none());
                expect(actual).toEqual(Result.ok(Option.none()));
            });
        });
    });

    describe("[unzip]", () => {
        describe("when zipped option exists", () => {
            it("should be array of options of zipped values", () => {
                const actual = Option.unzip(
                    Option.some(1).zip(Option.some(2)),
                );

                expect(actual).toEqual([Option.some(1), Option.some(2)]);
            });
        });

        describe("when zipped option is none", () => {
            it("should be array of Option.none", () => {
                const actual = Option.unzip(
                    Option.some(1).zip(Option.none()),
                );

                expect(actual).toEqual([Option.none(), Option.none()]);
            });
        });
    });
});
