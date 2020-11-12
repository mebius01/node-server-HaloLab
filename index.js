const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const clien = redis.createClient(REDIS_PORT);

const apiUrl = "https://api.github.com/users/"

const app = express();

function setPublicRepos(username, public_repos) {
  return `<h2>${username} has ${public_repos} public repositories in GitHub</h2>`
}

// Get data from api
async function getUser(req, res, next) {
  try {
    console.log('Fetching date...');

    const { username } = req.params;

    const response = await fetch(apiUrl + username);

    const data = await response.json();

    const public_repos = data.public_repos;

    // Set data to Redis

    clien.setex(username, 3600, public_repos);

    res.send(setPublicRepos(username, public_repos))
    // res.send(data);

  } catch (error) {
    console.log(error);
    res.status(500);
  }
}

// Cache Middleware
function cache(req, res, next) {
  const { username } = req.params;

  clien.get(username, (error, data) => {

    if (error) throw error;

    if (data !== null) {
      res.send(setPublicRepos(username, data));
    }
    else {
      next();
    }
  });
}


app.get('/', (req, res) => res.send('Server Ok'));
app.get('/user/:username', cache, getUser);


app.listen(PORT, () => {
    console.log(`Example app listening on ${PORT}...`);
})
