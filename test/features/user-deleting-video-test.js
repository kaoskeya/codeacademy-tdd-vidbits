const {assert} = require("chai")

describe("user submits the form", () => {
    describe("clicks delete", () => {
        it("and the video is removed", () => {
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

            // Edit
            browser.click("button#delete")

            // Verify
            const bodyText = browser.getText("body")
            assert.notInclude(bodyText, title)
            assert.notInclude(bodyText, description)
            assert.notInclude(bodyText, url)
        })
    })
})