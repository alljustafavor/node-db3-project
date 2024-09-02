const express = require('express');

const SchemeRouter = require('./schemes/scheme-router.js');

const server = express();

server.use(express.json());
server.use('/api/schemes', SchemeRouter);

server.use('/', (req, res, next) => {
  res.status(200).json({ api: 'up' })
})

module.exports = server;
