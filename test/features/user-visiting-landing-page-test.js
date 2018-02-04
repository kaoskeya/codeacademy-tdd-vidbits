const {assert} = require("chai");
const { generateRandomUrl } = require("../utils")

describe("user visits landing page", () => {
    describe("with no existing videos", () => {
        it("shows no videos", () => {
            // Setup

            // Exercise
            browser.url("/")

            // Verify
            assert.isEmpty(browser.getText("#videos-container"))
        })
    })

    describe("clicks on a link to navigate to create page", () => {
        it("takes the user to videos/create.html", () => {
            // Setup
            const expectText = "Save a video"

            // Exercise
            browser.url("/")
            browser.click("a#create-page")

            // Verify
            assert.include(browser.getText("body"), expectText)
        })
    })

    describe("posts a video and revisits landing page", () => {
        it("to find the posted video", async () => {
            // Setup
            const title = "Dark Necessities"
            const description = "RHCP"
            const url = "https://www.youtube.com/embed/Q0oIoR9mLwc"

            // Exercise
            // Post the form
            browser.url("/videos/create")
            browser.setValue("input#title", title)
            browser.setValue("textarea#description", description)
            browser.setValue("input#url", url)
            browser.click("input#submit")

            // Go to landing page
            browser.url("/")

            // Verify
            const bodyText = browser.getText("body")
            assert.include(bodyText, title)
        })
    })

    describe("posts a video, from landing page", () => {
        it("can reach single video page", async () => {
            // Setup
            const title = "Dark Necessities"
            const description = "RHCP"
            const url = "https://www.youtube.com/embed/Q0oIoR9mLwc"

            // Exercise
            // Post the form
            browser.url("/videos/create")
            browser.setValue("input#title", title)
            browser.setValue("textarea#description", description)
            browser.setValue("input#url", url)
            browser.click("input#submit")
            const expectedUrl = browser.getUrl()

            // Go to landing page
            browser.url("/")
            browser.click(".video-title a")

            // Verify
            assert.equal(browser.getUrl(), expectedUrl)
        })
    })
})
