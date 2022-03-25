import { Result } from "../result";
import { Option } from "./option";

describe("[Option]", () => {
    describe("[all]", () => {
        describe("when given three populated options", () => {
            it("should be option of three values", () => {
                const actual = Option.all(
                    Option.some(1),
                    Option.some("two"),
                    Option.some(3),
                );

                expect(actual).toEqual(Option.some([1, "two", 3]));
            });
        });

        describe("when one option is none", () => {
            it.each([
                [Option.none(), Option.some("two"), Option.some(3)],
                [Option.some(1), Option.none(), Option.some(3)],
            ])("should be option of none", () => {
                const actual = Option.all(
                    Option.none(),
                    Option.some("two"),
                    Option.some(3),
                );

                expect(actual).toEqual(Option.none());
            });
        });
    });

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

    describe("[fromOptional]", () => {
        describe("when given empty value", () => {
            const cases = [null, undefined];

            it.each(cases)("should be none", value => {
                const expected = Option.none();
                const actual = Option.fromOptional(value);
                expect(actual).toEqual(expected);
            });
        });

        describe("when given non-empty value", () => {
            const cases = [0, "", 12, "hello", { a: 1 }];

            it.each(cases)("should be some of %s", value => {
                const expected = Option.some(value);
                const actual = Option.fromOptional(value);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("[isOption]", () => {
        describe("when is option", () => {
            const cases = [Option.some(1), Option.none()];

            it.each(cases)("should be true for %o", actual => {
                expect(Option.isOption(actual)).toBe(true);
            });
        });

        describe("when is not option", () => {
            const cases = [null, undefined, 1, "hello", { a: 1 }];

            it.each(cases)("should be false for %s", actual => {
                expect(Option.isOption(actual)).toBe(false);
            });
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
