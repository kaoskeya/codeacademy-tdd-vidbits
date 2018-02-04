const router = require('express').Router();
const Video = require("../models/video")

router.get("/", (req, res, next) => {
    res.redirect("/videos")
})

router.get("/videos", async (req, res, next) => {
    const videos = await Video.find({})
    res.render("videos/index", {videos})
})

router.get("/videos/create", async (req, res, next) => {
    res.render("videos/create")
})

router.post("/videos", async (req, res, next) => {
    const {title, description, url} = req.body
    const video = new Video({title, description, url});
    const validationErrors = video.validateSync();
    if(validationErrors) {
        res.status(400).render("videos/create", {video, errors: validationErrors})
    } else {
        await video.save()
        res.redirect(`/videos/${video.id}`)
    }
})

router.get("/videos/:id", async (req, res, next) => {
    const video = await Video.findOne({ _id: req.params.id })
    res.render("videos/show", {video})
})

router.get("/videos/:id/edit", async (req, res, next) => {
    const video = await Video.findOne({ _id: req.params.id })
    res.render("videos/edit", {video})
})

router.post("/videos/:id/updates", async (req, res, next) => {
    const {title, description, url} = req.body
    const video = await Video.findOne({ _id: req.params.id })
    video.title = title
    video.description = description
    video.url = url
    validationErrors = video.validateSync()
    if(validationErrors) {
        res.status(400).render("videos/edit", {video, errors: validationErrors})
    } else {
        await video.save()
        res.redirect(`/videos/${video.id}`)
    }
})

router.post("/videos/:id/deletions", async (req, res, next) => {
    const video = await Video.remove({ _id: req.params.id })
    res.redirect("/videos")
})

module.exports = router;