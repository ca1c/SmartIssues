require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.set('view engine', 'ejs');
var access_token = "";

app.get('/', (req, res) => {
    res.send('running app');
});

app.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`);
});

app.get('/github/callback', (req, res) => {
    const requestToken = req.query.code;

    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json',
        }
    }).then((response) => {
        access_token = response.data.access_token
        res.redirect('/success');
    });
});

app.get('/success', function(req, res) {
    axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: 'token ' + access_token
        }
    }).then((response) => {
        // response.data is the user data
        res.send('success'); 
    })
});

app.listen(process.env.PORT || 4000);
