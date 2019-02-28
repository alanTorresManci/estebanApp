const service = require('./../service');
const request = require("request")
const emailCheck = require('email-check');
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;
const fs = require('fs');
const { check, validationResult } = require('express-validator/check')

const Sequelize = require('sequelize');
const sequelize = new Sequelize('estebanDB', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889,
    define: {
        timestamps: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    gender: {
        type: Sequelize.INTEGER
    },
    password: {
        type: Sequelize.STRING
    },

});
const Guest = sequelize.define('guest', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    website: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.STRING
    },
    lat: {
        type: Sequelize.STRING
    },
    lng: {
        type: Sequelize.STRING
    },

});


module.exports = {
    registro: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var email = req.body.email;
        var name = req.body.name;
        var last_name = req.body.last_name;
        var age = req.body.age;
        var gender = req.body.gender;
        var password = req.body.password;
        var hash = bcrypt.hashSync(password, saltRounds);

        sequelize.sync()
            .then(() => User.create({
                email: req.body.email,
                name: req.body.name,
                last_name: req.body.last_name,
                age: req.body.age,
                gender: req.body.gender,
                password: bcrypt.hashSync(req.body.password, saltRounds),
            }))
            .then(jane => {
                console.log(jane.toJSON());
                res.status(200).json({ message: "User created", data: { user: jane.toJSON() } });
            });

    },
    login: (req, red) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return red.status(422).json({ errors: errors.array() });
        }
        let email = req.body.email;
        User.findOne({ where: {email: email} }).then(user => {
            bcrypt.compare(req.body.password, user.password, function(err, res) {
                if(res) {
                    return red.status(200).send({ message: "correct", data: { token: service.createToken(user) } });
                } else {
                    return red.status(501).json({ message: "Password missmatch" , data: {} });
                }
            });
        });
    },

    guest: (req, res) => {
        var url = "https://jsonplaceholder.typicode.com/users";
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body.forEach(function(element) {
                    element.zipcode = element.address.zipcode;
                    element.lat = element.address.geo.lat;
                    element.lng =  element.address.geo.lng;
                });
                sequelize.sync({
                    force: true
                })
                    .then(() => Guest.bulkCreate(body))
                    .then(() => {
                        return Guest.findAll()
                    }).then(guests => {
                        res.status(200).json({ message: "Guests", data: { users: guests } });
                        const fs = require('fs');
                        fs.appendFile("'" + moment().unix() + "'.txt", JSON.stringify(guests), function (err) {
                            if (err) throw err;
                            console.log('Thanks, Its saved to the file!');
                        });
                    });

            }
        });
    },
};
