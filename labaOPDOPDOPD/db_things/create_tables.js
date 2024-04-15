const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321"
});
//да и здесь не сложнее
connection.connect(function (err){
    if (err) throw err;
    const use_db = "USE opdopdopd";
    const create_users = "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT, login VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, permissions INT CHECK (permissions = 1 OR permissions = 0) NOT NULL, PRIMARY KEY (id))";
    const create_professions = "CREATE TABLE IF NOT EXISTS professions(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
    const create_categories = "CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
    const create_PIQ = "CREATE TABLE IF NOT EXISTS piq(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, category_id INT NOT NULL, FOREIGN KEY fk_category_id (category_id) REFERENCES categories(id), PRIMARY KEY (id))";
    const create_opinions = "CREATE TABLE IF NOT EXISTS opinions(user_id INT NOT NULL, piq_id INT NOT NULL, profession_id INT NOT NULL, position INT CHECK (position > 0), FOREIGN KEY fk_user_id (user_id) REFERENCES users(id), FOREIGN KEY fk_piq_id (piq_id) REFERENCES piq(id), FOREIGN KEY fk_profession_id (profession_id) REFERENCES professions(id))";
    console.log("Connected!");

    connection.query(use_db, function (err, result){
        if (err) throw err;
        console.log("DB is in use!");
    });
    connection.query(create_users, function (err, result){
        if (err) throw err;
        console.log("Table users created!");
    });
    connection.query(create_professions, function (err, result){
        if (err) throw err;
        console.log("Table professions created!");
    });
    connection.query(create_categories, function (err, result){
        if (err) throw err;
        console.log("Table categories created!");
    });
    connection.query(create_PIQ, function (err, result){
        if (err) throw err;
        console.log("Table PIQ created!");
    });
    connection.query(create_opinions, function (err, result){
        if (err) throw err;
        console.log("Table opinions created!");
    });
    connection.end();
});
