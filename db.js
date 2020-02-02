const sqlite3 = require('sqlite3').verbose()
const initialPosts = require('./db/posts.json')

const db = new sqlite3.Database('./db/instagram.db', (err) => {
  if (err) {
    console.error(err.message)
    throw err
  }
  console.log('Connected to the instagram database')
})

const getAllPosts = (responseHandler) => {
  db.all('SELECT * FROM posts;', (err, rows) => {
    if (err) {
      console.error(err.message)
      throw err
    }
    responseHandler(rows)
  })
}

const createPost = (values, responseHandler) => {
  const { username, userImage, postImage, likes, hasBeenLiked, caption, filter } = values
  db.run('INSERT INTO posts (username, userImage, postImage, likes, hasBeenLiked, caption, filter) VALUES (?, ?, ?, ?, ?, ?, ?);', [username, userImage, postImage, likes, hasBeenLiked, caption, filter], (err) => {
    if (err) {
      return console.log(err.message)
    }
    responseHandler()
  })
}

const updatePost = (id, values, responseHandler) => {
  const { likes } = values
  db.run('UPDATE posts SET likes = ? WHERE id = ?;', [likes, id], (err) => {
    if (err) {
      return console.log(err.message)
    }
    responseHandler()
  })
}

const deletePost = (id, responseHandler) => {
  db.run('DELETE FROM posts WHERE id = ?;', [id], (err) => {
    if (err) {
      return console.log(err.message)
    }
    responseHandler()
  })
}

const initializePostsTable = () => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS posts;')
    db.run('CREATE TABLE posts (id INTEGER PRIMARY KEY, username TEXT, userImage TEXT, postImage TEXT, likes INTEGER, hasBeenLiked BOOL, caption TEXT, filter TEXT);')
    initialPosts.forEach(post => {
      createPost(post, () => console.log(`Created initial post`))
    })
  })
}

module.exports = { initializePostsTable, getAllPosts, createPost, updatePost, deletePost }