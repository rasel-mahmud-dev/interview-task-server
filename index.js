const express = require("express")
require("dotenv").config({})
const {MongoClient, ObjectId} = require("mongodb");
const cors  = require("cors")


const app = express()
app.use(express.json())
app.use(cors())


// Connection URI
const uri = process.env.DB_CONN_STRING
// Create a new MongoClient



function databaseConnection() {
    return new Promise(async (resolve, reject) => {
        try {
            const client = new MongoClient(uri);
            // Connect the client to the server (optional starting in v4.7)
            await client.connect();
            // Establish and verify connection
            let database  = await client.db("assignment-db")
            console.log("database connected")
            resolve(database)

        } catch (ex) {
            reject(ex)
        }
    })
}


// get all posts
app.get("/api/posts", async (req, res) => {
    try {
        const db = await databaseConnection()
        const Post = db.collection("posts")
        const posts = await Post.find().toArray()
        res.status(200).send(posts)
    } catch (ex) {

        res.status(500).send("Internal Error")
    }

})

// get single post by post id
app.get("/api/post/:postId", async (req, res) => {
    try {
        const {postId} = req.params
        const db = await databaseConnection()
        const Post = db.collection("posts")
        const post = await Post.findOne({_id: new ObjectId(postId)})
        res.status(200).send(post)
    } catch (ex) {
        res.status(500).send("Internal Error")
    }

})


// create a new Post
app.post("/api/posts", async (req, res) => {
    try {
        const {post} = req.body

        const db = await databaseConnection()
        const Post = db.collection("posts")
        const result = await Post.insertOne({
            post
        })

        res.status(201).send({
            post,
            _id: result.insertedId
        })
    } catch (ex) {
        res.status(500).send("Internal Error")
    }


})


// update a post
app.patch("/api/posts/:postId", async (req, res) => {
    try {
        const {post} = req.body
        const {postId} = req.params

        const db = await databaseConnection()
        const Post = db.collection("posts")
        const result = await Post.updateOne(
            {
                _id: new ObjectId(postId)
            },
            {
                $set: {
                    post: post
                }
            }
        )
        res.status(201).send({
            post
        })
    } catch (ex) {
        res.status(500).send("Internal Error")
    }


})


app.delete("/api/posts/:postId", async (req, res) => {

    try {
        const {postId} = req.params
        const db = await databaseConnection()
        const Post = db.collection("posts")
        const doc = await Post.deleteOne({
            _id: new ObjectId(postId)
        })
        res.status(201).send("post deleted")
    } catch (ex) {
        res.status(500).send("Internal Error")
    }
})


const PORT = process.env.PORT || 2000

app.listen(PORT, function () {
    console.log(`server is running on port ${PORT}`)
})