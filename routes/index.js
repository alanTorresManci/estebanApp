module.exports = {
    getHomePage: (req, res) => {

        let query = "SELECT * FROM `users` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                console.log("se ejecta err");
                res.send("aqui");
                res.redirect('/');
            }
            res.status(201).send(result);
        });
    },
};
