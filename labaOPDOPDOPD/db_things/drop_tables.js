const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321",
    database: "opdopdopd"
});
//на случай если надо снести всё к хуям собачьим
connection.connect(function (err){
    if (err) throw err;
    const drop_users = "DROP TABLE users";
    const drop_professions = "DROP TABLE professions";
    const drop_opinions = "DROP TABLE opinions";
    const drop_categories = "DROP TABLE categories";
    const drop_piq = "DROP TABLE piq";
    connection.query(drop_opinions, function (err, result){
        if (err) throw err;
        console.log("Table opinions dropped!");
    });
    connection.query(drop_piq, function (err, result){
        if (err) throw err;
        console.log("Table PIQ dropped!");
    });
    connection.query(drop_categories, function (err, result){
        if (err) throw err;
        console.log("Table categories dropped!");
    });

    connection.query(drop_professions, function (err, result){
        if (err) throw err;
        console.log("Table professions dropped!");
    });
    connection.query(drop_users, function (err, result){
        if (err) throw err;
        console.log("Table users dropped!");
    });
    connection.end();
});