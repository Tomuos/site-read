const cleanText = require('./cleanText');

describe('cleanText', () =>{
    it("Removes extra spaces by trimming the text", () =>{
        const text = "        Breaking your code into smaller functions.            Let's see       "
        const result = cleanText(text)

        console.log("Input Text:", `"${text}"`);
        console.log("Cleaned Text:", `"${result}"`);

        expect(result).toBe("Breaking your code into smaller functions. Let's see")
    })
})