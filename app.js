const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const middleware = require('./middleware');
const { registro, login, guest } = require('./routes/user');

const port = 5000;
const { check, validationResult } = require('express-validator/check')

// configure middleware
app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes for the app
app.post('/registro', [
    check('name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('email').not().isEmpty(),
    check('email').isEmail(),
    check('age').not().isEmpty(),
    check('age').isNumeric(),
    check('gender').not().isEmpty(),
    check('gender').isNumeric(),
    check('password').not().isEmpty(),
], registro);

app.post('/login', [
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
], login);

app.get('/guest', middleware.ensureAuthenticated, guest);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
