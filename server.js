const express = require('express');
const postsRouter = require('./posts/posts-router.js');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Blog Posts API</h2>
    <P>Get get get get got got got got</p>
    `);
});

module.exports = server;