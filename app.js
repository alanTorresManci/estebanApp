const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const middleware = require('./middleware');
const { getHomePage } = require('./routes/index');
const { registro, login, guest } = require('./routes/user');
// const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const port = 5000;
const { check, validationResult } = require('express-validator/check')


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'estebanDB',
    port: '8889',
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.get('/', getHomePage);
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
