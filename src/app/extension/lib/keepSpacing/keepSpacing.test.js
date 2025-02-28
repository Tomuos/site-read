const keepSpacing = require("./keepSpacing");

describe("keepSpacing", () => {
    it("keeps spacing and excludes unwanted punctuation", () => {
        const word = "don't";
        const result = keepSpacing(word);
        expect(result).toBe("don't");
    });

    it("preserves hyphens in hyphenated words", () => {
        const word = "swimming-helped";
        const result = keepSpacing(word);
        expect(result).toBe("swimming-helped");
    });

    it("removes unwanted characters while keeping spaces and punctuation", () => {
        const sentence = "Hello, world! How's it going?";
        const result = keepSpacing(sentence);
        expect(result).toBe("Hello, world! How's it going?");
    });

    it("removes special characters like @, #, $, &, *", () => {
        const sentence = "Special@characters#should$be&removed*.";
        const result = keepSpacing(sentence);
        expect(result).toBe("Specialcharactersshouldberemoved.");
    });

    it("handles quotes and dashes correctly", () => {
        const sentence = `Quotes “and” dashes – should stay.`;
        const result = keepSpacing(sentence);
        expect(result).toBe(`Quotes “and” dashes – should stay.`);
    });

    it("works with mixed input including hyphens and special characters", () => {
        const sentence = "Does-this@work#correctly?";
        const result = keepSpacing(sentence);
        expect(result).toBe("Does-thisworkcorrectly?");
    });
    
});
