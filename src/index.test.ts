import isFoo from ".";

describe("isFoo", () => {
  describe("when called with 'foo'", () => {
    it("should return true", () => {
      expect(isFoo("foo")).toBe(true);
    });
  });

  describe("when called with a number", () => {
    it("should return false", () => {
      expect(isFoo(123)).toBe(false);
    });
  });
});
