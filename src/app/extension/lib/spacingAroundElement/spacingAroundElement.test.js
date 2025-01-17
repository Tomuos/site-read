const spacingAroundElement = require("./spacingAroundElement")

describe('spacingAroundElement', () => {
  it('should check that spaces are added around tagged elements', () =>{
      const sentenceLink = "the site to use is <a>www.google.com</a>"
      const expectedResult = "<strong>th</strong>e <strong>si</strong>te <strong>t</strong>o <strong>us</strong>e <strong>i</strong>s <a>www.google.com</a>"

      const result = spacingAroundElement(sentenceLink)

      expect(result).toEqual(expectedResult)
  })
}) 