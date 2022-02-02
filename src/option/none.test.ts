import { Result } from "../result";
import { EmptyOptionError } from "./none";
import { Option } from "./option";

describe("[None]", () => {
    describe("[and]", () => {
        it("should be none", () => {
            const actual = Option.none().and(Option.some(2));
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[andThen]", () => {
        it("should be none", () => {
            const option = Option.none();
            const actual = option.andThen(value =>
                Option.some(value + 1),
            );
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[apply]", () => {
        it("should be callback value", () => {
            const actual = Option.none().apply(self => self.isNone());
            expect(actual).toBe(true);
        });
    });

    describe("[contains]", () => {
        it("should be false", () => {
            const actual = Option.none<number>().contains(3);
            expect(actual).toBe(false);
        });
    });

    describe("[expect]", () => {
        it("should throw EmptyOptionError", () => {
            const behaviour = () => Option.none().expect("message");
            expect(behaviour).toThrowError(EmptyOptionError);
        });

        it("should throw error with message", () => {
            const behaviour = () => Option.none().expect("message");
            expect(behaviour).toThrowError("message");
        });
    });

    describe("[filter]", () => {
        it("should be none", () => {
            const actual = Option.none().filter(() => true);
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[isNone]", () => {
        it("should be true", () => {
            const actual = Option.none().isNone();
            expect(actual).toBe(true);
        });
    });

    describe("[isSome]", () => {
        it("should be false", () => {
            const actual = Option.none().isSome();
            expect(actual).toBe(false);
        });
    });

    describe("[iter]", () => {
        it("should be iterator containing no items", () => {
            const iterator = Option.none().iter();
            const actual = iterator.next().done;
            expect(actual).toBe(true);
        });
    });

    describe("[map]", () => {
        it("should be none", () => {
            const actual = Option.none<number>().map(value => value + 1);
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[mapOr]", () => {
        it("should be default value", () => {
            const actual = Option.none<number>().mapOr(
                0,
                value => value + 1,
            );
            expect(actual).toEqual(Option.some(0));
        });
    });

    describe("[mapOrElse]", () => {
        it("should be none", () => {
            const actual = Option.none<number>().mapOrElse(
                () => 0,
                value => value + 1,
            );

            expect(actual).toEqual(Option.some(0));
        });
    });

    describe("[okOr]", () => {
        it("should be result of default error", () => {
            const error = new Error("failure");
            const actual = Option.none().okOr(error);
            expect(actual).toEqual(Result.err(error));
        });
    });

    describe("[okOrElse]", () => {
        it("should be result of callback value", () => {
            const error = new Error("failure");
            const actual = Option.none().okOrElse(() => error);
            expect(actual).toEqual(Result.err(error));
        });
    });

    describe("[or]", () => {
        it("should be other option", () => {
            const actual = Option.none<number>().or(Option.some(1));
            expect(actual).toEqual(Option.some(1));
        });
    });

    describe("[orElse]", () => {
        it("should be callback value", () => {
            const actual = Option.none<number>().orElse(() =>
                Option.some(1),
            );
            expect(actual).toEqual(Option.some(1));
        });
    });

    describe("[unwrap]", () => {
        it("should throw error", () => {
            const behaviour = () => Option.none().unwrap();
            expect(behaviour).toThrowError(EmptyOptionError);
        });
    });

    describe("[unwrapOr]", () => {
        it("should be default value", () => {
            const actual = Option.none().unwrapOr(0);
            expect(actual).toEqual(0);
        });
    });

    describe("[unwrapOrElse]", () => {
        it("should be callback value", () => {
            const actual = Option.none().unwrapOrElse(() => 0);
            expect(actual).toEqual(0);
        });
    });

    describe("[xor]", () => {
        describe("when other option is some", () => {
            it("should be other option", () => {
                const expected = Option.some(1);
                const actual = Option.none<number>().xor(expected);
                expect(actual).toEqual(expected);
            });
        });

        describe("when other option is none", () => {
            it("should be none", () => {
                const actual = Option.none().xor(Option.none());
                expect(actual).toEqual(Option.none());
            });
        });
    });

    describe("[zip]", () => {
        it("should be none", () => {
            const actual = Option.none().zip(Option.some(1));
            expect(actual).toEqual(Option.none());
        });
    });

    describe("[zipWith]", () => {
        it("should be none", () => {
            const actual = Option.none().zipWith(
                Option.some(1),
                (a, b) => a + b,
            );

            expect(actual).toEqual(Option.none());
        });
    });
});
