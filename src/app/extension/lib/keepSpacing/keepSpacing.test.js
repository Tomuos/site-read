const keepSpacing = require("./keepSpacing")

describe('keepSpacing', () =>{
    it("keeps spacing between words excludes punctuation", () =>{
        const word = "don't"
        const result = keepSpacing(word)

        expect(result).toBe("dont")
    })
})