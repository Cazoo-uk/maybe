import { Result } from "../result";
import { Option } from "./option";

describe("[Some]", () => {
    describe("[and]", () => {
        it("should be next option", () => {
            const a = Option.some(1);
            const b = Option.some(2);
            const actual = a.and(b);
            expect(actual).toBe(b);
        });
    });

    describe("[andThen]", () => {
        it("should be callback value", () => {
            const option = Option.some(1);
            const actual = option.andThen(value =>
                Option.some(value + 1),
            );
            expect(actual).toEqual(Option.some(2));
        });
    });

    describe("[apply]", () => {
        it("should be callback value", () => {
            const actual = Option.some(1).apply(self => self.isSome());
            expect(actual).toBe(true);
        });
    });

    describe("[contains]", () => {
        describe("when value matches contents", () => {
            describe("and value is primitive", () => {
                it("should be true", () => {
                    const actual = Option.some(1).contains(1);
                    expect(actual).toBe(true);
                });
            });

            describe("and value is object", () => {
                it("should be true", () => {
                    const object = { a: 1 };
                    const actual = Option.some(object).contains(object);
                    expect(actual).toBe(true);
                });
            });
        });

        describe("when value does not match contents", () => {
            describe("and value is primitive", () => {
                it("should be false", () => {
                    const actual = Option.some(1).contains(2);
                    expect(actual).toBe(false);
                });
            });

            describe("and value is object", () => {
                it("should be false for object", () => {
                    const object = { a: 1 };
                    const actual = Option.some(object).contains({ a: 1 });
                    expect(actual).toBe(false);
                });
            });
        });
    });

    describe("[expect]", () => {
        it("should be value", () => {
            const option = Option.some(1);
            const actual = option.expect("message");
            expect(actual).toEqual(1);
        });
    });

    describe("[filter]", () => {
        describe("when value passes filter", () => {
            it("should be original option", () => {
                const option = Option.some(1);

                const actual = option.filter(
                    (value): value is 1 => value === 1,
                );

                expect(actual).toBe(option);
            });
        });

        describe("when value does not pass filter", () => {
            it("should be None", () => {
                const option = Option.some(1);
                const actual = option.filter(value => value === 2);
                expect(actual).toEqual(Option.none());
            });
        });
    });

    describe("[intoSome]", () => {
        it("should be contained value", () => {
            const actual = Option.some(1).intoSome();
            expect(actual).toEqual(1);
        });
    });

    describe("[isNone]", () => {
        it("should be false", () => {
            const actual = Option.some(1).isNone();
            expect(actual).toBe(false);
        });
    });

    describe("[isSome]", () => {
        it("should be true", () => {
            const actual = Option.some(1).isSome();
            expect(actual).toBe(true);
        });
    });

    describe("[iter]", () => {
        it("should be iterator containing value", () => {
            const iterator = Option.some(1).iter();
            const actual = iterator.next().value;
            expect(actual).toEqual(1);
        });

        it("should be iterator containing one item", () => {
            const iterator = Option.some(1).iter();
            iterator.next();
            const actual = iterator.next().done;
            expect(actual).toBe(true);
        });
    });

    describe("[map]", () => {
        it("should apply function to value", () => {
            const actual = Option.some(1).map(value => value + 1);
            expect(actual).toEqual(Option.some(2));
        });
    });

    describe("[mapOr]", () => {
        it("should apply function to value", () => {
            const actual = Option.some(1).mapOr(0, value => value + 1);
            expect(actual).toEqual(Option.some(2));
        });
    });

    describe("[mapOrElse]", () => {
        it("should apply function to value", () => {
            const actual = Option.some(1).mapOrElse(
                () => 0,
                value => value + 1,
            );

            expect(actual).toEqual(Option.some(2));
        });
    });

    describe("[okOr]", () => {
        it("should be result of value", () => {
            const actual = Option.some(1).okOr(new Error("failure"));
            expect(actual).toEqual(Result.ok(1));
        });
    });

    describe("[okOrElse]", () => {
        it("should be result of value", () => {
            const actual = Option.some(1).okOrElse(
                () => new Error("failure"),
            );

            expect(actual).toEqual(Result.ok(1));
        });
    });

    describe("[or]", () => {
        it("should be original option", () => {
            const actual = Option.some(1).or(Option.some(2));
            expect(actual).toEqual(Option.some(1));
        });
    });

    describe("[orElse]", () => {
        it("should be original option", () => {
            const actual = Option.some(1).orElse(() => Option.some(2));
            expect(actual).toEqual(Option.some(1));
        });
    });

    describe("[unwrap]", () => {
        it("should be contained value", () => {
            const actual = Option.some(1).unwrap();
            expect(actual).toEqual(1);
        });
    });

    describe("[unwrapOr]", () => {
        it("should be contained value", () => {
            const actual = Option.some(1).unwrapOr(2);
            expect(actual).toEqual(1);
        });
    });

    describe("[unwrapOrElse]", () => {
        it("should be contained value", () => {
            const actual = Option.some(1).unwrapOrElse(() => 2);
            expect(actual).toEqual(1);
        });
    });

    describe("[xor]", () => {
        describe("when other option is some", () => {
            it("should be none", () => {
                const actual = Option.some(1).xor(Option.some(2));
                expect(actual).toEqual(Option.none());
            });
        });

        describe("when other option is none", () => {
            it("should be original option", () => {
                const expected = Option.some(1);
                const actual = expected.xor(Option.none());
                expect(actual).toBe(expected);
            });
        });
    });

    describe("[zip]", () => {
        describe("when other option is some", () => {
            it("should be option of array of both values", () => {
                const actual = Option.some(1)
                    .zip(Option.some(2))
                    .unwrap();

                expect(actual).toEqual([1, 2]);
            });
        });

        describe("when other option is none", () => {
            it("should be none", () => {
                const actual = Option.some(1).zip(Option.none());
                expect(actual).toEqual(Option.none());
            });
        });
    });

    describe("[zipWith]", () => {
        describe("when other option is some", () => {
            it("should apply function to join options", () => {
                const actual = Option.some(1).zipWith(
                    Option.some(2),
                    (a, b) => a + b,
                );

                expect(actual).toEqual(Option.some(3));
            });
        });

        describe("when other option is none", () => {
            it("should be none", () => {
                const actual = Option.some(1).zipWith(
                    Option.none(),
                    (a, b) => a + b,
                );

                expect(actual).toEqual(Option.none());
            });
        });
    });
});
