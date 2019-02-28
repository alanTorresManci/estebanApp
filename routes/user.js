const emailCheck = require('email-check');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const { check, validationResult } = require('express-validator/check')


module.exports = {
    registro: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var email = req.body.email;
        // var name
        // var last_name
        // var email
        // var age
        // var gender
        // var password
        var hash = bcrypt.hashSync("myPlaintextPassword", saltRounds);

    },
};
