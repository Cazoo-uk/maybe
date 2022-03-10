import { Result } from "../result";
import { AsyncOption } from "./async-option";
import { Option, UnwrapNoneError } from "./option";

describe("[AsyncOption]", () => {
    describe("[and]", () => {
        describe("when first option has value", () => {
            it("should be content of second option", () => {
                const actual = AsyncOption.some(1)
                    .and(AsyncOption.some(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(2));
            });
        });

        describe("when first option is none", () => {
            const cases: AsyncOption<number>[] = [
                AsyncOption.some(2),
                AsyncOption.none(),
            ];

            it.each(cases)("should be option of none", option => {
                const actual = AsyncOption.none()
                    .and(option)
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[andThen]", () => {
        describe("when first option has value", () => {
            it("should be callback value", () => {
                const actual = AsyncOption.some(1)
                    .andThen(value => AsyncOption.some(value + 1))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(2));
            });
        });

        describe("when first option is none", () => {
            it("should be option of none", () => {
                const actual = AsyncOption.none<number>()
                    .andThen(value => AsyncOption.some(value + 1))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[asPromise]", () => {
        it("should be underlying promise", () => {
            const actual = AsyncOption.some(1).asPromise();
            return expect(actual).resolves.toEqual(Option.some(1));
        });
    });

    describe("[contains]", () => {
        describe("when value is contained", () => {
            it("should be promise of true", () => {
                const actual = AsyncOption.some(1).contains(1);
                return expect(actual).resolves.toBe(true);
            });
        });

        describe("when value is not contained", () => {
            it("should be promise of false", () => {
                const actual = AsyncOption.some(1).contains(2);
                return expect(actual).resolves.toBe(false);
            });
        });
    });

    describe("[expect]", () => {
        describe("when option of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncOption.some(1).expect("message");
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when option of none", () => {
            it("should be reject with error", () => {
                const actual = AsyncOption.none().expect("message");

                return expect(actual).rejects.toBeInstanceOf(
                    UnwrapNoneError,
                );
            });
        });
    });

    describe("[filter]", () => {
        describe("when value passes filter", () => {
            it("should contain option of value", () => {
                const actual = AsyncOption.some(1)
                    .filter((value): value is 1 => value === 1)
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(1));
            });
        });

        describe("when value does not pass filter", () => {
            it("should contain none", () => {
                const actual = AsyncOption.some(1)
                    .filter(value => value === 2)
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[fromOptional]", () => {
        describe("when value exists", () => {
            it("should be option of value", () => {
                const actual = AsyncOption.fromOptional(1).asPromise();
                return expect(actual).resolves.toEqual(Option.some(1));
            });
        });

        describe("when value does not exist", () => {
            it("should be option of none", () => {
                const actual = AsyncOption.fromOptional(null).asPromise();
                return expect(actual).resolves.toEqual(Option.none());
            });
        });
    });

    describe("[isNone]", () => {
        it("should be promise of boolean", () => {
            const actual = AsyncOption.some(1).isNone();
            return expect(actual).resolves.toBe(false);
        });
    });

    describe("[isSome]", () => {
        it("should be promise of boolean", () => {
            const actual = AsyncOption.some(1).isSome();
            return expect(actual).resolves.toBe(true);
        });
    });

    describe("[iter]", () => {
        it("should be promise of iterator", () => {
            const actual = AsyncOption.none()
                .iter()
                .then(iter => iter.next());

            return expect(actual).resolves.toEqual({ done: true });
        });
    });

    describe("[map]", () => {
        it("should be promise of callback value", () => {
            const actual = AsyncOption.some(1)
                .map(value => value + 1)
                .asPromise();

            return expect(actual).resolves.toEqual(Option.some(2));
        });
    });

    describe("[mapOr]", () => {
        describe("when option of value", () => {
            it("should be promise of callback value", () => {
                const actual = AsyncOption.some(1)
                    .mapOr(0, value => value + 1)
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(2));
            });
        });

        describe("when option of none", () => {
            it("should be promise of default value", () => {
                const actual = AsyncOption.none<number>()
                    .mapOr(0, value => value + 1)
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(0));
            });
        });
    });

    describe("[mapOrElse]", () => {
        describe("when option of value", () => {
            it("should be promise of callback value", () => {
                const actual = AsyncOption.some(1)
                    .mapOrElse(
                        () => 0,
                        value => value + 1,
                    )
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(2));
            });
        });

        describe("when option of none", () => {
            it("should be promise of default value", () => {
                const actual = AsyncOption.none<number>()
                    .mapOrElse(
                        () => 0,
                        value => value + 1,
                    )
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(0));
            });
        });
    });

    describe("[okOr]", () => {
        const error = new Error("failure");

        describe("when option of value", () => {
            it("should be async result of value", () => {
                const actual = AsyncOption.some(1)
                    .okOr(error)
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(1));
            });
        });

        describe("when option of none", () => {
            it("should be async result of error", () => {
                const actual = AsyncOption.none()
                    .okOr(error)
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.err(error));
            });
        });
    });

    describe("[okOrElse]", () => {
        const error = new Error("failure");

        describe("when option of value", () => {
            it("should be async result of value", () => {
                const actual = AsyncOption.some(1)
                    .okOrElse(() => error)
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.ok(1));
            });
        });

        describe("when option of none", () => {
            it("should be async result of callback value", () => {
                const actual = AsyncOption.none()
                    .okOrElse(() => error)
                    .asPromise();

                return expect(actual).resolves.toEqual(Result.err(error));
            });
        });
    });

    describe("[or]", () => {
        describe("when first option has value", () => {
            it("should be first option", () => {
                const actual = AsyncOption.some(1)
                    .or(AsyncOption.some(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(1));
            });
        });

        describe("when first option is none", () => {
            const cases: [AsyncOption<number>, Option<number>][] = [
                [AsyncOption.some(2), Option.some(2)],
                [AsyncOption.none(), Option.none()],
            ];

            it.each(cases)(
                "should be second option",
                (option, expected) => {
                    const actual = AsyncOption.none()
                        .or(option)
                        .asPromise();

                    return expect(actual).resolves.toEqual(expected);
                },
            );
        });
    });

    describe("[orElse]", () => {
        describe("when first option has value", () => {
            it("should be first option", () => {
                const actual = AsyncOption.some(1)
                    .orElse(() => AsyncOption.some(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(1));
            });
        });

        describe("when first option is none", () => {
            it("should be callback value", () => {
                const actual = AsyncOption.none()
                    .orElse(() => AsyncOption.some(2))
                    .asPromise();

                return expect(actual).resolves.toEqual(Option.some(2));
            });
        });
    });

    describe("[transform]", () => {
        it("should apply function to option", () => {
            const actual = AsyncOption.some(1)
                .transform(option => option.and(Option.some(2)))
                .asPromise();

            return expect(actual).resolves.toEqual(Option.some(2));
        });
    });

    describe("[unwrap]", () => {
        describe("when option of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncOption.some(1).unwrap();
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when option of none", () => {
            it("should reject with error", () => {
                const actual = AsyncOption.none().unwrap();

                return expect(actual).rejects.toThrowError(
                    UnwrapNoneError,
                );
            });
        });
    });

    describe("[unwrapOr]", () => {
        describe("when option of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncOption.some(1).unwrapOr(0);
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when option of none", () => {
            it("should be promise of default value", () => {
                const actual = AsyncOption.none().unwrapOr(0);
                return expect(actual).resolves.toEqual(0);
            });
        });
    });

    describe("[unwrapOrElse]", () => {
        describe("when option of value", () => {
            it("should be promise of value", () => {
                const actual = AsyncOption.some(1).unwrapOrElse(() => 0);
                return expect(actual).resolves.toEqual(1);
            });
        });

        describe("when option of none", () => {
            it("should be promise of default value", () => {
                const actual = AsyncOption.none().unwrapOrElse(() => 0);
                return expect(actual).resolves.toEqual(0);
            });
        });
    });

    describe("[xor]", () => {
        describe("when first option has value", () => {
            describe("and second is none", () => {
                it("should be first option", () => {
                    const actual = AsyncOption.some(1)
                        .xor(AsyncOption.none())
                        .asPromise();

                    return expect(actual).resolves.toEqual(
                        Option.some(1),
                    );
                });
            });

            describe("and second has value", () => {
                it("should be none", () => {
                    const actual = AsyncOption.some(1)
                        .xor(AsyncOption.some(2))
                        .asPromise();

                    return expect(actual).resolves.toEqual(Option.none());
                });
            });
        });

        describe("when first option is none", () => {
            describe("and second is none", () => {
                it("should be none", () => {
                    const actual = AsyncOption.none()
                        .xor(AsyncOption.none())
                        .asPromise();

                    return expect(actual).resolves.toEqual(Option.none());
                });
            });

            describe("and second has value", () => {
                it("should be none", () => {
                    const actual = AsyncOption.none()
                        .xor(AsyncOption.some(2))
                        .asPromise();

                    return expect(actual).resolves.toEqual(
                        Option.some(2),
                    );
                });
            });
        });
    });

    describe("[zip]", () => {
        it("should be combine option values", () => {
            const actual = AsyncOption.some(1)
                .zip(AsyncOption.some(2))
                .asPromise();

            return expect(actual).resolves.toEqual(Option.some([1, 2]));
        });
    });

    describe("[zipWith]", () => {
        it("should be combine option values using callback", () => {
            const actual = AsyncOption.some(1)
                .zipWith(AsyncOption.some(2), (a, b) => a + b)
                .asPromise();

            return expect(actual).resolves.toEqual(Option.some(3));
        });
    });
});
