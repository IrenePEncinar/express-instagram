const { initializePostsTable, getAllPosts, createPost, updatePost, deletePost } = require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Create table if not exists and populate it with initial data
initializePostsTable()

// Create express app and make it listen on port 3000
const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/api/posts', (req, res) => {
  getAllPosts((books) => res.send(books))
})

app.post('/api/posts', (req, res) => {
  createPost(req.body, () => res.status(201).send())
})

app.put('/api/posts/:id', (req, res) => {
  updatePost(req.params.id, req.body, () => res.send())
})

app.delete('/api/posts/:id', (req, res) => {
  deletePost(req.params.id, () => res.send())
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000. Ready to accept requests!')
})