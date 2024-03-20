const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 1488;
const PORT2 = 5252;

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
function registration(connection, user_login, user_password){
    connection.connect(function (err){
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
                connection.query(`INSERT INTO users (login, password, permissions) VALUES ('${user_login}', '${user_password}', 0)`, function (result){
                    console.log("Registration success!");
                });
            }
        });
    });
}

function authorisation(connection, user_login, user_password){
    let message; //итоговое сообщение
    let result = false; //результат авторизации
    connection.connect(function (err){
        if (err) throw err;
        connection.query("SELECT login, password FROM users", function(err, result, fields){ //выбираем из бд логины и пароли
            if (err) throw err;
            let logs_and_pass = result; //получаем массив объектов
            let flag = false;
            let login;
            let password;
            for (let log of logs_and_pass){ //проверяем есть ли вообще такой логин
                if (log.login === user_login){
                    flag = true;
                    login = log.login;
                    password = log.password;
                    break;
                }
            }
            if (!(flag)){ //Если нет такого логина - шлем нахуй
                message = "No such user!";
                result = false;
                console.log(message);
                return result;
            }else{
                if (user_password === password){ //если есть и пароль совпадает - все заебись
                    message = "Authorisation successful!";
                    result = true;
                    console.log(message);
                    return result;
                }else{ //если не совпадает пароль - тоже шлем нахуй, хотя надо бы еще раз пароль запросить
                    message = "Wrong password!";
                    result = false;
                    console.log(message);
                    return result;
                }
            }
        });
    });
}
function add_piq_opinion(connection, piq, user_login, profession_name, position){
    connection.connect(function (err){
        if (err) throw err;
        connection.query("SELECT id FROM piq WHERE name = " + mysql.escape(piq) + " UNION SELECT id FROM users WHERE login = " + mysql.escape(user_login) + " UNION SELECT id FROM professions WHERE name = " + mysql.escape(profession_name), function (err, result, fields){
            //Находим айдишники ПВК, юзера и профессии
            if (err) throw err;
            let piq_id;
            let user_id;
            let profession_id;
            let counter = 0;
            for (let id in result){
                if (counter === 0){
                    piq_id = id.id;
                }else if (counter === 1){
                    user_id = id.id;
                }else{
                    profession_id = id.id;
                }
            }
            connection.query("SELECT position FROM opinions WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err, result, fields){
                //Проверяем нет ли уже такого мнения у данного пользователя по данной профессии с данным ПВК
                if (result === []){ //если такого мнения еще нет, добавляем новое
                    connection.query("INSERT INTO opinions (user_id, piq_id, profession_id, position) VALUES (" + mysql.escape(user_id) + ", " + mysql.escape(piq_id) + ", " + mysql.escape(profession_id) + ", " + mysql.escape(position), function (err){
                        if (err) throw err;
                        console.log("Opinion inserted!");
                    });
                }else{ //если есть, то обновляем позицию
                    connection.query("UPDATE opinions SET position = " + mysql.escape(position) + " WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err){
                        if (err) throw err;
                        console.log("Opinion updated!");
                    })
                }
            });
        });
    });
}

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

    if(!(authorisation(connection, user_login, user_password))){
        registration(connection, user_login, user_password);
    }else{
        authorisation(connection, user_login, user_password);
    }

});

app.listen(PORT2, () => {
    console.log(`Сервер запущен на порту ${PORT2}`);
});