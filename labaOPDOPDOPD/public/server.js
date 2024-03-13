const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 1488;
const PORT2 = 5252;

const mysql = require("mysql2")
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


connection.connect(function (err){
    if (err) throw err;
    const use_db = "USE opdopdopd";
    const create_users = "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT, login VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, permissions INT CHECK (permissions = 1 OR permissions = 0) NOT NULL, PRIMARY KEY (id))";
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
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'OPDOPDOPD.html');
    res.sendFile(htmlFilePath);
});
app.get('/scripts.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/scripts.js');
});
app.get('/styling.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/styling.css');
});
app.get('/professionCSS.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/professionCSS.css');
});
app.get('/GameDesigner.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'GameDesigner.html');
    res.sendFile(htmlFilePath);
});
app.get('/SysAdmin.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAdmin.html');
    res.sendFile(htmlFilePath);
});
app.get('/SysAnal.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAnal.html');
    res.sendFile(htmlFilePath);
});
app.get('/OPDOPDOPD.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'OPDOPDOPD.html');
    res.sendFile(htmlFilePath)
});

app.get('/popug.jpg', (req, res) => {
    res.sendFile(__dirname + '/popug.jpg');
});

app.use(bodyParser.json());

app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    console.log('Полученные данные нового пользователя:', jsonData.login, jsonData.password);
    res.json({
        status: "success",
    });
    let user_login = jsonData.login.toString();
    let user_password = jsonData.password.toString();

    //функция регистрации
    function registration(connection, user_login, user_password){
        connection.connect(function (err){
            console.log("БД успешно подняты!");
            if (err) throw err;
            connection.query("SELECT login FROM users", function (err, result, fields){ //запрашиваем все логины
                if (err) throw err;
                let flag = true;
                for (let log in result){ //проверяем нет ли юзера с таким логином
                    if (log.login === user_login){
                        flag = false;
                    }
                }
                if (!(flag)){ //если есть - шлём нахуй, хотя надо попросить придумать другой логин
                    console.log("User already exist!");
                }else{ //если нет - делаем новую запись в бд и все круто классно
                    connection.query(`INSERT INTO users (login, password, permissions) VALUES ('${user_login}', '${user_password}', 0)`, function (err, result){
                        if (err) throw err;
                        console.log("Registration success!");
                    });
                }
            });
        });
    }
    registration(connection, jsonData.login, jsonData.password);
});
app.listen(PORT2, () => {
    console.log(`Сервер запущен на порту ${PORT2}`);
});