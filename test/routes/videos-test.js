const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require("jsdom")

const app = require('../../app');
const { generateRandomUrl } = require("../utils")

const Video = require("../../models/video")
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

function elementTextExtractor(htmlAsString, element) {
    return jsdom(htmlAsString).querySelector(element).textContent
}

describe("/videos", () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe("POST a valid form", () => {
        it("adds the values to the database", async () => {
            // Setup
            const title = "The Zephyr Song"
            const description = "Anthony Kiedis, Flea, Chad Smith, John Frusciante. Slaying it."
            const url = "https://www.youtube.com/embed/0fcRa5Z6LmU"
            const data = { title, description, url }
            const expectedStatus = 302;

            // Exercise
            const response = await request(app).post("/videos").type("form").send(data)
            const video = await Video.findOne({});
            const videoPage = await request(app).get(response.header.location)

            // Verify
            assert.equal(video.title, title)
            assert.equal(video.description, description)
            assert.equal(video.url, url)
            assert.equal(response.status, expectedStatus)
            assert.equal(elementTextExtractor(videoPage.text, "h1"), video.title)
        })
    })

    describe("POST without title", () => {
        it("does not save the values to database and loads form with data and errors", async () => {
            // Setup
            const description = "Anthony Kiedis, Flea, Chad Smith, John Frusciante. Slaying it."
            const url = generateRandomUrl()
            const data = { description, url }
            const expectedStatus = 400

            // Exercise
            const response = await request(app).post("/videos").type("form").send(data)
            const videos = await Video.find();

            // Verify
            assert.isEmpty(videos)
            assert.equal(response.status, expectedStatus)
            assert.equal(elementTextExtractor(response.text, "span.error"), "Title is required")
            assert.equal(elementTextExtractor(response.text, "textarea#description"), description)
            assert.equal(jsdom(response.text).querySelector("input#url").getAttribute("value"), url)
        })
    })

    describe("POST without url", () => {
        it("does not save the values to database and loads form with data and errors", async () => {
            // Setup
            const title = "Goodbye Angels"
            const description = "Anthony Kiedis, Flea, Chad Smith, Josh Klinghoffer."
            const data = { title, description }
            const expectedStatus = 400

            // Exercise
            const response = await request(app).post("/videos").type("form").send(data)
            const videos = await Video.find();

            // Verify
            assert.isEmpty(videos)
            assert.equal(response.status, expectedStatus)
            assert.equal(elementTextExtractor(response.text, "span.error"), "URL is required")
            assert.equal(elementTextExtractor(response.text, "textarea#description"), description)
            assert.equal(jsdom(response.text).querySelector("input#title").getAttribute("value"), title)
        })
    })
})

describe("/videos/:id", () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe("GET", () => {
        it("renders the video", async () => {
            // Setup
            const video = {
                title: "Under the Bridge",
                description: "RHCP",
                url: generateRandomUrl()
            }

            // Exercise
            const createdVideo = new Video(video)
            await createdVideo.save()
            const response = await request(app).get(`/videos/${createdVideo._id}`)

            // Verify
            assert.include(elementTextExtractor(response.text, "h1"), video.title)
            assert.include(jsdom(response.text).querySelector("iframe").getAttribute("src"), video.url)
        })
    }) 
})

describe("/videos/:id/edit", () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe("GET", () => {
        it("renders the form", async () => {
            // Setup
            const video = {
                title: "Under the Bridge",
                description: "RHCP",
                url: generateRandomUrl()
            }

            // Exercise
            const createdVideo = new Video(video)
            await createdVideo.save()
            const response = await request(app).get(`/videos/${createdVideo._id}/edit`)

            // Verify
            assert.include(jsdom(response.text).querySelector("input#title").getAttribute("value"), video.title)
            assert.include(elementTextExtractor(response.text, "textarea#description"), video.description)
            assert.include(jsdom(response.text).querySelector("input#url").getAttribute("value"), video.url)
        })
    }) 
})

describe("/videos/:id/updates", () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe("POST", () => {
        it("renders the form", async () => {
            // Setup
            const video = {
                title: "Test Title 1",
                description: "Test Description 1",
                url: generateRandomUrl()
            }

            const video2 = {
                title: "Test Title 2",
                description: "Test Description 2",
                url: generateRandomUrl()
            }

            // Exercise
            const createdVideo = new Video(video)
            await createdVideo.save()
            await request(app).post(`/videos/${createdVideo._id}/updates`).type("form").send(video2)
            const response = await request(app).get(`/videos/${createdVideo._id}`)
            
            // Verify
            assert.include(elementTextExtractor(response.text, "h1"), video2.title)
            assert.include(elementTextExtractor(response.text, ".video-description"), video2.description)
            assert.include(jsdom(response.text).querySelector("iframe").getAttribute("src"), video2.url)
        })
    }) 
})

describe("/videos/:id/deletions", () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe("POST", () => {
        it("does not show the video on landing page", async () => {
            // Setup
            const video = {
                title: "Test Title 1",
                description: "Test Description 1",
                url: generateRandomUrl()
            }

            // Exercise
            const createdVideo = new Video(video)
            await createdVideo.save()
            await request(app).post(`/videos/${createdVideo._id}/deletions`).type("form").send()
            const response = await request(app).get("/videos")
            
            // Verify
            assert.notInclude(response.text, video.title)
            assert.notInclude(response.text, video.description)
            assert.notInclude(response.text, video.url)
        })
    }) 
})