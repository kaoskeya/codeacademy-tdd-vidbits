const {assert} = require("chai")

describe("user visits the create page", () => {
    describe("submits the form", () => {
        it("and finds the data in the landing page", () => {
            // Setup
            const title = "The Zephyr Song"
            const description = "Anthony Kiedis, Flea, Chad Smith, John Frusciante. Slaying it."
            const url = "https://www.youtube.com/watch?v=0fcRa5Z6LmU"

            // Exercise
            browser.url("/videos/create")
            browser.setValue("input#title", title)
            browser.setValue("textarea#description", description)
            browser.setValue("input#url", url)
            browser.click("input#submit")

            // Verify
            const bodyText = browser.getText("body")
            assert.include(bodyText, title)
            assert.include(bodyText, description)
            assert.include(browser.getAttribute("iframe", "src"), url)
        })
    })
})