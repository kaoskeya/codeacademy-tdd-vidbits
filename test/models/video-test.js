const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

const Video = require("../../models/video")

describe("creating a video", () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe("#title", () => {
    it("is a string", async () => {
      // Setup
      const title = 123
      const url = "http://test.url"

      // Exercise
      const video = await Video.create({title, url})

      // Verify
      assert.strictEqual(video.title, title.toString())
    })

    it("is required", async () => {
      // Setup
      const description = "Test Desc"
      const url = "http://test.url"
      // Exercise
      const video = new Video({description, url})
      video.validateSync();

      // Verify
      assert.equal(video.errors.title.message, 'Title is required');
    })
  })

  describe("#description", () => {
    it("is a string", async () => {
      // Setup
      const title = "Test Title"
      const description = 234
      const url = "http://test.url"
      const createVideo = {title, description, url}

      // Exercise
      const video = await Video.create(createVideo)

      // Verify
      assert.strictEqual(video.description, description.toString())
    })
  })

  describe("#url", () => {
    it("is a string", async () => {
      // Setup
      const title = "Test Title"
      const description = "Test Description"
      const url = "http://test.url"
      const createVideo = {title, description, url}

      // Exercise
      const video = await Video.create(createVideo)

      // Verify
      assert.strictEqual(video.url, url)
    })

    it("is required", async () => {
      // Setup
      const title = "Test Title"
      const description = "Test Desc"
      
      // Exercise
      const video = new Video({title, description})
      video.validateSync();
  
      // Verify
      assert.equal(video.errors.url.message, 'URL is required');
    })
  })
})