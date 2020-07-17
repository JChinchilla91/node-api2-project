const express = require('express');
const router = express.Router();
const Posts = require('../data/db.js');


router.post('/', async (req, res) => {
    const post = req.body;

    try {
        if (post.title && post.contents) {
            const posted = await Posts.insert(post)
            if (posted) {
                res.status(201).json(posted)
            } else {
                res.status(404).json({ message: 'This post could not be posted' })
            }
        } else {
            res.status(400).json({ message: 'Please provide title and contents for the post.' })
        }
    }
    catch {
        res.status(500).json({ error: 'There was an error while saving the post to the databsase' })
    }
})

router.post('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const post = Posts.findById(id);
    const comment = { ...req.body, post_id: id }

    try {
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else if (!comment.text) {
            res.status(400).json({ message: 'Please provide text for the comment.' })
        } else {
            const added = await Posts.insertComment(comment);
            res.status(201).json(added)
        }
    }
    catch{
        res.status(500).json({ error: 'There was an error while saving the comment to the database' })
    }
})

router.get('/', async (req, res) => {
    const posts = await Posts.find();

    try {
        res.status(200).json(posts);
    }
    catch {
        res.status(500).json({ error: 'The posts information could not be retrieved.' })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findById(id);

    try {
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            res.status(200).json(post)
        }
    }
    catch {
        res.status(500).json({ message: 'The post information could not be retrieved.' })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    const post = await Posts.findById(id)
  
    try {
      if (post) {
        const comments = await Posts.findPostComments(id)
        if (comments) {
          res.status(200).json(comments)
        }
      } else {
        res.status(404).json({ message: 'The post requested cannot be found' })
      }
    } 
    catch {
      res.status(500).json({ message: 'The comments information could not be retrieved' })
    }
  })

router.delete('/:id', async (req, res) =>{
    const { id } = req.params
    const post = await Posts.findById(id);

    try {
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        } else {
            const deleted = await Posts.remove(id)
            res.status(200).json( { deleted: 'Deleted?'})
        }
    }
    catch {
        res.status(500).json({ error: 'The post could not be removed' })
    }
})

module.exports = router;