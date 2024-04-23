const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 1488;
const PORT2 = 5252;
let usertype = "null";
let checkisreg = false;

const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321"
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
    const create_users = "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT, login VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, avatar CHAR(255), permissions INT CHECK (permissions = 2 or permissions = 1 OR permissions = 0) NOT NULL, PRIMARY KEY (id))";
    const create_professions = "CREATE TABLE IF NOT EXISTS professions(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
    const create_categories = "CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
    const create_PIQ = "CREATE TABLE IF NOT EXISTS piq(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, category_id INT NOT NULL, FOREIGN KEY fk_category_id (category_id) REFERENCES categories(id), PRIMARY KEY (id))";
    const create_opinions = "CREATE TABLE IF NOT EXISTS opinions(user_id INT NOT NULL, piq_id INT NOT NULL, profession_id INT NOT NULL, position INT CHECK (position > 0), FOREIGN KEY fk_user_id (user_id) REFERENCES users(id), FOREIGN KEY fk_piq_id (piq_id) REFERENCES piq(id), FOREIGN KEY fk_profession_id (profession_id) REFERENCES professions(id))";
    const alta = "alter table users add column avatar text";
    const add_users = "INSERT INTO `users` (`login`, `password`, `name`, `permissions`) VALUES ('dvoeglasova_n@opdopdopd.com', '19842024', 'nadvoe', 1), ('egorova_varvara@opdopdopd.com', '27122005', 'bapehuk', 1), ('maks1488@opdopdopd.com', '413029', 'masema', 1), ('gerger@opdopdopd.com', '14881995', 'sexinstructor', 1), ('tatti@opdopdopd.com' , '444555666777', 'Mr.Marihuan4ik', 1), ('sniyaq@opdopdopd.com', '88005553535', 'naku0', 1), ('kivisd3n@opdopdopd.com', 'chonadosucca', 'Kivisdenchyk', 1)";
    const add_sniyaq_ava = "UPDATE users SET avatar = '/sniyaq.jpg' WHERE login = 'sniyaq@opdopdopd.com';";
    const add_nadvoe_ava = "UPDATE users SET avatar = '/nadvoe.jpg' WHERE login = 'dvoeglasova_n@opdopdopd.com';";
    const add_bapehuk_ava = "UPDATE users SET avatar = '/bapehuk.jpg' WHERE login = 'egorova_varvara@opdopdopd.com';";
    const add_maks_ava = "UPDATE users SET avatar = '/maks.jpg' WHERE login = 'maks1488@opdopdopd.com';";
    const add_ger_ava = "UPDATE users SET avatar = '/ger.jpg' WHERE login = 'gerger@opdopdopd.com';";
    const add_tatti_ava = "UPDATE users SET avatar = '/tatti.jpg' WHERE login = 'tatti@opdopdopd.com';";
    const add_kivi_ava = "UPDATE users SET avatar = '/Kivisdenchyk.jpg' WHERE login = 'kivisd3n@opdopdopd.com';";
    connection.query(use_db, function (err, result) {
        if (err) throw err;
        console.log("DB is in use!");
    });
    console.log("Connected!");
    connection.query(create_users, function (err, result){
        if (err) throw err;
        console.log("Table users created!");
    });
    // connection.query(alta);
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
    if (connection.query("SELECT login FROM users") === null){
        connection.query(add_users, function (err, result){
            if (err) throw err;
            console.log("Table users created!");
        });
    }
        connection.query(add_bapehuk_ava, function (err) {
            if (err) throw err;
            console.log("Bapehuk ava added!");
        });
        connection.query(add_kivi_ava, function (err) {
            if (err) throw err;
            console.log("Kivi Ava added!");
        });
        connection.query(add_maks_ava, function (err) {
            if (err) throw err;
            console.log("Maks Ava added!");
        });
        connection.query(add_ger_ava, function (err) {
            if (err) throw err;
            console.log("Ger Ava added!");
        });
        connection.query(add_nadvoe_ava, function (err) {
            if (err) throw err;
            console.log("Nadvoe Ava added!");
        });
        connection.query(add_sniyaq_ava, function (err) {
            if (err) throw err;
            console.log("Sinyaq Ava added!");
        });
        connection.query(add_tatti_ava, function (err) {
            if (err) throw err;
            console.log("Tatti Ava added!");
        });
});
function registration(connection, user_login, user_password, data){
    jsonData = data;
    user_login = jsonData.login.toString();
    user_password = jsonData.password.toString();
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
                connection.query(`INSERT INTO users (login, password, permissions, name) VALUES ('${user_login}', '${user_password}', 0, 'user')`, function (result){
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
                    connection.query("SELECT permissions FROM users WHERE login = " + mysql.escape(login) + " UNION SELECT id FROM users", function(err, res, fields){
                        if (err) throw err;
                        usertype = res[0].permissions;
                        console.log(usertype);
                    })
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


app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
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
app.get('/script_test1.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test1.js');
});
app.get('/script_test2.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test2.js');
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
app.get('/profile.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'profile.html');
    res.sendFile(htmlFilePath);
});
app.get('/profileCSS.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/profileCSS.css');
});
app.get('/test1.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'test1.html');
    res.sendFile(htmlFilePath);
});
app.get('/test2.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'test2.html');
    res.sendFile(htmlFilePath);
});
app.get('/style_test.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/style_test.css');
});
app.get('/profiles.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'profiles.html');
    res.sendFile(htmlFilePath);
})
// app.get('/Kivisdenchyk.jpg', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Kivisdenchyk.jpg'));
// });
app.use(bodyParser.json());
app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    const login = jsonData.login ? jsonData.login.toString() : null;
    const password = jsonData.password ? jsonData.password.toString() : null;

    if (!login || !password) {
        return res.status(400).json({ error: 'Отсутствуют данные для аутентификации' });
    }

    let username = "";
    let permissions = "";
    let avatar = "";
    let test_attempts = [];
    let piq_opinions = [];
    let status = "";

    if (jsonData.window === 'registration') {
        registration(connection, login, password, jsonData);
        status = 'success';
        permissions = '0';
        app.use(express.static(path.join(__dirname, 'public')));
        return res.json({ login: login, status: status, username: username, permissions: permissions, avatar: avatar, test_attempts: test_attempts, piq_opinions: piq_opinions });
    }

    connection.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, password], function (err, result) {
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
        }

        if (result.length === 0) {
            status = "error";
            return res.json({login: login, status: status, username: username, permissions: permissions, avatar: avatar, test_attempts: test_attempts, piq_opinions: piq_opinions });
        }

        status = "success";
        username = result[0].name.toString();
        permissions = result[0].permissions.toString();
        avatar = result[0].avatar.toString();
        const user_id = result[0].id;

        connection.query("SELECT test.name, test_attempt.average_value, test_attempt.number_of_passes, test_attempt.number_of_mistakes, test_attempt.stadart_deviation FROM test_attempt INNER JOIN test ON test_attempt.test_id = test.id WHERE test_attempt.user_id = ?", [user_id], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
            }

            result.forEach(res => {
                test_attempts.push([res.name.toString(), res.average_value.toString(), res.number_of_passes.toString(), res.number_of_mistakes.toString(), res.standart_deviation.toString()]);
            });

            connection.query("SELECT professions.name, piq.name, opinions.position FROM opinions JOIN professions ON professions.id = opinions.profession_id JOIN piq ON piq.id = opinions.piq_id WHERE user_id = ?", [user_id], function (err, result) {
                if (err) {
                    console.error('Ошибка выполнения запроса к базе данных:', err);
                    return res.status(500).json({ error: 'Ошибка выполнения запроса к базе данных' });
                }

                result.forEach(res => {
                    piq_opinions.push([res.professions.name.toString(), res.piq.name.toString(), res.position.toString()]);
                });

                res.json({ login: login, status: status, username: username, permissions: permissions, avatar: avatar, test_attempts: test_attempts, piq_opinions: piq_opinions });
            });
        });
        app.get(`${avatar}`, (req, res) => {
            res.sendFile(path.join(__dirname, '/pictures', `${avatar}`));
        });
    });

});
/*app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    console.log('Полученные данные нового пользователя:', jsonData.login, jsonData.password);
    let user_login = jsonData.login.toString();
    let user_password = jsonData.password.toString();
    let check = false;
    let st,pm;

    if (jsonData.window.toString() === 'enter'){
        authorisation(connection, user_login, user_password);
        connection.query("SELECT * FROM users WHERE login = " + mysql.escape(user_login) + " AND password = " + mysql.escape(user_password), function (err, result, fields){
            if (result === []){
                st = 'error';
                pm = '';
            }else{
                st = 'success';
                pm = result[0].permissions.toString();
                console.log(pm);
            }
            res.json({status:  st, permissions: pm});
        });
    }else if (jsonData.window.toString() === 'registration'){
        registration(connection, user_login, user_password);
        st = 'success';
        pm = '0';
        res.json({status:  st, permissions: pm});
    }
});*/

app.post('/pvkpoint', (req, res) =>{
    const jsonData = req.body;
    console.log(jsonData)
});

app.listen(PORT2, () => {
    console.log(`Сервер запущен на порту ${PORT2}`);
});