const {assert} = require("chai")

describe("user submits the form", () => {
    describe("clicks edit and submits form again", () => {
        it("and finds values entered during the second formfill", () => {
            // Setup
            const title = "The Zephyr Song"
            const description = "Anthony Kiedis, Flea, Chad Smith, John Frusciante. Slaying it."
            const url = "https://www.youtube.com/watch?v=0fcRa5Z6LmU"

            const title2 = "Jungle Man"
            const description2 = "Anthony Kiedis, Flea, Jack Irons, HILLEL SLOVAK."
            const url2 = "https://www.youtube.com/watch?v=0MBljztEeg0"

            // Exercise
            browser.url("/videos/create")
            browser.setValue("input#title", title)
            browser.setValue("textarea#description", description)
            browser.setValue("input#url", url)
            browser.click("input#submit")

            const address = browser.getUrl()

            // Edit
            browser.click("button#edit")
            browser.setValue("input#title", title2)
            browser.setValue("textarea#description", description2)
            browser.setValue("input#url", url2)
            browser.click("input#submit")

            // Verify
            const bodyText = browser.getText("body")
            assert.include(bodyText, title2)
            assert.include(bodyText, description2)
            assert.include(browser.getAttribute("iframe", "src"), url2)
            assert.equal(browser.getUrl(), address)
        })
    })
})