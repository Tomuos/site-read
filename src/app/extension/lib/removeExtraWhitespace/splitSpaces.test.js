const splitSpaces = require('./splitSpaces');

describe('splitSpaces', () => {
    it('should keep spaces between words', () =>{
        const words = "we don't need roads";
        const expectedResult = ["we"," ","don't"," ","need"," ","roads" ] 
        
        const result = splitSpaces(words)

        expect(result).toEqual(expectedResult)

        
    })

    it('checks the spaces at the beginning and end', () =>{
        const words = " we don't need roads ";
        const expectedResult = [""," ","we"," ","don't"," ","need"," ","roads"," ","" ] 
        
        const result = splitSpaces(words)

        expect(result).toEqual(expectedResult)
    })
})