const processWord = require('./processWord');

describe('processWord', () =>{
    it("calculates the amount the text will become bold", () =>{
        const text1 = "I"; // Single-letter word
        const text2 = "am"; // Two-letter word
        const text3 = "Neo"; // Three-letter word
        const text4 = "I know kung-fu!"; // Sentence 


        const result1 = processWord(text1);
        const result2 = processWord(text2);
        const result3 = processWord(text3);
        const result4 = text4.split(" ").map(processWord).join(" ");

        console.log("Input text:", text4);
        console.log("Processed Text:", result4);

       
        // word math assertions
        expect(result1).toBe("<strong>I</strong>");
        expect(result2).toBe("<strong>a</strong>m");
        expect(result3).toBe("<strong>Ne</strong>o");   

        // Sentence assertion
        expect(result4).toBe("<strong>I</strong> <strong>kn</strong>ow <strong>kun</strong>g-fu!"); 
    })
})