const mysql = require("mysql2");

const connection = mysql.createConnection({
    port: "1337",
    host: "localhost",
    user: "root",
    password: "1234"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE IF NOT EXISTS opdopdopd", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});
