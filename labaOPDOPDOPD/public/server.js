const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require("mysql2");
const {resolve} = require("path");

//const host = "::"||process.env.IP||"fd00::5:7e7b";
const app = express();
const PORT = "1488";
const PORT2 = "5252";

const connection = mysql.createConnection(
    {
        port: "1337",
        host: "localhost",
        user: "root",
        password: "1234",
        database: "opdopdopd"
    }
);

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL database!");
    createTables();
});

function createTables() {
    connection.query("CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT, login VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, avatar VARCHAR(255), permissions INT CHECK (permissions = 2 or permissions = 1 OR permissions = 0) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table users created!");
    });
    connection.query("CREATE TABLE IF NOT EXISTS professions(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table professions created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table categories created!");
    });


    connection.query("CREATE TABLE IF NOT EXISTS piq(id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, category_id INT NOT NULL, FOREIGN KEY fk_category_id (category_id) REFERENCES categories(id), PRIMARY KEY (id))", function (err) {
        if (err) throw err;
        console.log("Table PIQ created!");
    });

    connection.query("CREATE TABLE IF NOT EXISTS opinions(user_id INT NOT NULL, piq_id INT NOT NULL, profession_id INT NOT NULL, position INT CHECK (position > 0), FOREIGN KEY fk_user_id (user_id) REFERENCES users(id), FOREIGN KEY fk_piq_id (piq_id) REFERENCES piq(id), FOREIGN KEY fk_profession_id (profession_id) REFERENCES professions(id))", function (err) {
        if (err) throw err;
        console.log("Table opinions created!");
    });
}

app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

function registration(connection, user_login, user_password, data) {
    jsonData = data;
    user_login = jsonData.login.toString();
    user_password = jsonData.password.toString();
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT login FROM users", function (err, result, fields) { //запрашиваем все логины
            if (err) throw err;
            let flag = true;
            for (let log in result) { //проверяем нет ли юзера с таким логином
                if (log.login === user_login) {
                    flag = false;
                }
            }
            if (!(flag)) { //если есть - шлём нахуй, хотя надо попросить придумать другой логин
                console.log("User already exist!");
            } else { //если нет - делаем новую запись в бд и все круто классно
                connection.query(`INSERT INTO users (login, password, permissions, name)
                                  VALUES ('${user_login}', '${user_password}', 0, 'user')`, function (result) {
                    console.log("Registration success!");
                });
            }
        });
    });
}

function calculateStandardDeviation(arr) {
    const n = arr.length;
    const avg = arr[1];
    let sum = 0;
    for (let number in arr) {
        sum += Math.pow(number - avg, 2);
    }
    return Math.sqrt(sum / (n - 1));
}

function authorisation(connection, user_login, user_password) {
    let message; //итоговое сообщение
    let result = false; //результат авторизации
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT login, password FROM users", function (err, result, fields) { //выбираем из бд логины и пароли
            if (err) throw err;
            let logs_and_pass = result; //получаем массив объектов
            let flag = false;
            let login;
            let password;
            for (let log of logs_and_pass) { //проверяем есть ли вообще такой логин
                if (log.login === user_login) {
                    flag = true;
                    login = log.login;
                    password = log.password;
                    break;
                }
            }
            if (!(flag)) { //Если нет такого логина - шлем нахуй
                message = "No such user!";
                result = false;
                console.log(message);
                return result;
            } else {
                if (user_password === password) { //если есть и пароль совпадает - все заебись
                    message = "Authorisation successful!";
                    connection.query("SELECT permissions FROM users WHERE login = " + mysql.escape(login) + " UNION SELECT id FROM users", function (err, res, fields) {
                        if (err) throw err;
                        usertype = res[0].permissions;
                        console.log(usertype);
                    })
                    result = true;
                    console.log(message);
                    return result;
                } else { //если не совпадает пароль - тоже шлем нахуй, хотя надо бы еще раз пароль запросить
                    message = "Wrong password!";
                    result = false;
                    console.log(message);
                    return result;
                }
            }
        });
    });
}

function add_piq_opinion(connection, piq, user_login, profession_name, position) {
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT id FROM piq WHERE name = " + mysql.escape(piq) + " UNION SELECT id FROM users WHERE login = " + mysql.escape(user_login) + " UNION SELECT id FROM professions WHERE name = " + mysql.escape(profession_name), function (err, result, fields) {
            //Находим айдишники ПВК, юзера и профессии
            if (err) throw err;
            let piq_id;
            let user_id;
            let profession_id;
            let counter = 0;
            for (let id in result) {
                if (counter === 0) {
                    piq_id = id.id;
                } else if (counter === 1) {
                    user_id = id.id;
                } else {
                    profession_id = id.id;
                }
            }
            connection.query("SELECT position FROM opinions WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err, result, fields) {
                //Проверяем нет ли уже такого мнения у данного пользователя по данной профессии с данным ПВК
                if (result === []) { //если такого мнения еще нет, добавляем новое
                    connection.query("INSERT INTO opinions (user_id, piq_id, profession_id, position) VALUES (" + mysql.escape(user_id) + ", " + mysql.escape(piq_id) + ", " + mysql.escape(profession_id) + ", " + mysql.escape(position), function (err) {
                        if (err) throw err;
                        console.log("Opinion inserted!");
                    });
                } else { //если есть, то обновляем позицию
                    connection.query("UPDATE opinions SET position = " + mysql.escape(position) + " WHERE piq_id = " + mysql.escape(piq_id) + " AND user_id = " + mysql.escape(user_id) + " AND profession_id = " + mysql.escape(profession_id), function (err) {
                        if (err) throw err;
                        console.log("Opinion updated!");
                    })
                }
            });
        });
    });
}

function writeResult(user_id, test_id) {
    let itog = 0;
    connection.query("SELECT formulas.piq_id FROM formulas JOIN arguments ON arguments.formula_id = formulas.formula_id JOIN test ON ? = arguments.test_id", [test_id], function (err, res, fields) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let piq_id = res[i].piq_id;
            let result = countPiqUserCompatibility(piq_id, user_id, itog);
            connection.query("SELECT * FROM results WHERE user_id = ? AND piq_id = ?", [user_id, piq_id], function (err, res, fields) {
                if (err) throw err;
                if (result.length === 0) {
                    connection.query("INSERT INTO results (user_id, piq_id, result) VALUES (?, ?, ?)", [user_id, piq_id, result], function (err, res, fields) {
                        if (err) throw err;
                        console.log("Result inserted")
                    })
                } else {
                    connection.query("UPDATE results SET result = ? WHERE user_id = ? and piq_id = ?", [result, user_id, piq_id], function (err, res, fields) {
                        if (err) throw err;
                        console.log("Result updated")
                    })
                }
            });
        }
    })
}

// считаем на сколько юзеру подходит данный пвк по формуле
function countPiqUserCompatibility(piq_id, user_id, itog) {
    connection.query("SELECT formula_id FROM formulas WHERE piq_id = ?", [piq_id], function (err, result) {
        if (err) throw err;
        const form_id = result[0];
        connection.query("SELECT test_id, test_value, coefficient, abs FROM args WHERE formula_id = ?", [form_id], function (err, result) {
            if (err) throw err;
            let abs = result[0].abs;
            for (let i = 0; i < result.length; i++) {
                let a;
                connection.query("SELECT ?, test_attempt FROM test_attempt WHERE test_id = ? AND user_id = ?", [result[i][1], result[i][0], user_id], function (err, result) {
                    if (err) throw err;
                    let max_att = 0;
                    let val;
                    for (let j = 0; j < result.length; j++) {
                        if (result[j][1] > max_att) {
                            max_att = result[j][1];
                            val = result[j][0];
                        }
                    }
                    if (abs) {
                        val = Math.abs(val);
                    }
                    a = val * result[i][2];
                    itog += a;
                })
            }
        })
    })
    return itog;
}

app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/css8.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/css8.css');
});
app.get('/css9.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/css9.css');
});
app.get('/script_test1.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test1.js');
});
app.get('/script_test2.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test2.js');
});
app.get('/script_test3.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test3.js');
});
app.get('/script_test4.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test4.js');
});
app.get('/script_test5.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test5.js');
});
app.get('/script_test6.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test6.js');
});
app.get('/script_test7.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test7.js');
});
app.get('/script_test8.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test8.js');
});
app.get('/script_test9.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test9.js');
});
app.get('/script_test10.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test10.js');
});
app.get('/script_test11.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test11.js');
});
app.get('/script_test12.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test12.js');
});
app.get('/script_test13.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test13.js');
});
app.get('/script_test14.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test14.js');
});
app.get('/script_test15.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test15.js');
});
app.get('/script_test16.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test16.js');
});
app.get('/script_test17.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.sendFile(__dirname + '/script_test17.js');
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
app.get('/sidepanel.css', (req, res) => {
    res.setHeader("Content-Type", "text/css"); // Use setHeader instead of header
    res.sendFile(__dirname + '/sidepanel.css');
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
    const htmlFilePath = path.join(__dirname, '/test1.html');
    res.sendFile(htmlFilePath);
});
app.get('/test2.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test2.html');
    res.sendFile(htmlFilePath);
});
app.get('/style_test.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/style_test.css');
});
app.get('/profiles.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/profiles.html');
    res.sendFile(htmlFilePath);
})
app.get('/testPage.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/testPage.html');
    res.sendFile(htmlFilePath);
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/pictures' + '/icons' + '/favicon.ico');
});
app.get('/apple-touch-icon.png', (req, res) => {
    res.sendFile(__dirname + '/apple-touch-icon.png');
});
app.get('/testPage.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/testPage.css');
});
// app.get('/Kivisdenchyk.jpg', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Kivisdenchyk.jpg'));
// });
app.get('/1.png', (req, res) => {
    res.sendFile(__dirname + '/1.png');
});
app.get('/2.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/2.png'));
});
app.get('/3.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/3.png'));
});
app.get('/4.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/4.png'));
});
app.get('/5.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/5.png'));
});
app.get('/6.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/6.png'));
});
app.get('/sleep.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/sleep.png'));
});
app.get('/test3.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test3.html');
    res.sendFile(htmlFilePath);
});
app.get('/test4.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test4.html');
    res.sendFile(htmlFilePath);
});
app.get('/test5.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test5.html');
    res.sendFile(htmlFilePath);
});
app.get('/sound.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sound.mp3'));
});
app.get('/sounds/1.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/1.mp3'));
});
app.get('/sounds/2.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/2.mp3'));
});
app.get('/sounds/3.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/3.mp3'));
});
app.get('/sounds/4.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/4.mp3'));
});
app.get('/sounds/5.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/5.mp3'));
});
app.get('/sounds/6.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/6.mp3'));
});
app.get('/sounds/7.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/7.mp3'));
});
app.get('/sounds/8.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/8.mp3'));
});
app.get('/sounds/9.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/9.mp3'));
});
app.get('/sounds/10.mp3', (req, res) => {
    res.sendFile(path.join(__dirname, '/sounds/10.mp3'));
});

app.get('/test6.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test6.html');
    res.sendFile(htmlFilePath);
});

app.get('/test7.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test7.html');
    res.sendFile(htmlFilePath);
});

app.get('/test8.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test8.html');
    res.sendFile(htmlFilePath);
});

app.get('/test9.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test9.html');
    res.sendFile(htmlFilePath);
});

app.get('/test10.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test10.html');
    res.sendFile(htmlFilePath);
});

app.get('/test11.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test11.html');
    res.sendFile(htmlFilePath);
});

app.get('/test12.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test12.html');
    res.sendFile(htmlFilePath);
});

app.get('/test13.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test13.html');
    res.sendFile(htmlFilePath);
});

app.get('/test14.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test14.html');
    res.sendFile(htmlFilePath);
});

app.get('/test15.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test15.html');
    res.sendFile(htmlFilePath);
});

app.get('/test16.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test16.html');
    res.sendFile(htmlFilePath);
});

app.get('/test17.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, '/test17.html');
    res.sendFile(htmlFilePath);
});

app.get('/15.css', (req, res) => {
    res.header("Content-Type", "text/css");
    res.sendFile(__dirname + '/15.css');
});


app.post('/tes1res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const results = jsonData.res;
    const test_id = 1;
    const sum = results.reduce((acc, cur) => acc + parseFloat(cur), 0);
    const avg = sum / results.length;
    const deviation = calculateStandardDeviation(results);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes2res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const results = jsonData.res;
    const test_id = 2;
    const sum = results.reduce((acc, cur) => acc + parseFloat(cur), 0);
    const avg = sum / results.length;
    const deviation = calculateStandardDeviation(results);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes3res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 3;
    console.log(jsonData);
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation, number_of_mistakes], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes4res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 4;
    console.log(jsonData);
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation, number_of_mistakes], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes5res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    console.log(jsonData);
    const test_id = 5;
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation, number_of_mistakes], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes6res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 6;
    const avg = result.reduce((acc, cur) => acc + parseFloat(cur), 0) / result.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
})

app.post('/tes7res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 7;
    const number_of_mistakes = result[0];
    const results = result.slice(1);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation, number_of_mistakes], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
})

app.post('/tes8res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 8;
    const avg = result.reduce((acc, cur) => acc + parseFloat(cur), 0) / result.length;
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, avg, 0, deviation, 0], function (err, result) {
            if (err) throw err;
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes9res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 9;
    const avg = result[1];
    let max_val = result[0];
    const deviation = calculateStandardDeviation(result);
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        console.log(max_val)
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes, max_value) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, avg, 0, deviation, 0, max_val], function (err, result) {
            if (err) throw err;
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes11res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 10;
    const number_of_mistakes = result[0];
    const results = result.slice(1).filter(x => x !== null);
    const avg = results.reduce((acc, cur) => acc + parseFloat(cur), 0) / results.length;
    const deviation = calculateStandardDeviation(results);
    const amount_of_answers = results.length;
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, stadart_deviation, number_of_mistakes, answers_amount) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?, ?);", [user_name, test_id, attempt_number, avg, 0, deviation, number_of_mistakes, amount_of_answers], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes12res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const number_of_mistakes = 49 - result[0];
    console.log(result);
    const spent_time = result[1] / 100;
    const test_id = 11;
    const amount_of_answers = result[0];
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation, time_spent, answers_amount) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, 0, number_of_mistakes, 0, spent_time, amount_of_answers], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
})

app.post('/tes13res', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const user_name = jsonData.name;
    const result = jsonData.res;
    const number_of_mistakes = result[0];
    const number_of_passes = result[1];
    const test_id = 12;
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, number_of_passes, number_of_mistakes, 0], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes14res', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData)
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 13;
    const amount_of_mistakes = result[1];
    const amount_of_answers = result[0];
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation, answers_amount) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, 0, amount_of_mistakes, 0, amount_of_answers], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes15res', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 14;
    const amount_of_mistakes = result[1];
    const amount_of_answers = result[0];
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation, answers_amount) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, 0, amount_of_mistakes, 0, amount_of_answers], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes16res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 15;
    const amount_of_mistakes = result[0];
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, 0, amount_of_mistakes, 0], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});

app.post('/tes17res', (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    const result = jsonData.res;
    const test_id = 16;
    const amount_of_mistakes = result[0];
    let attempt_number = 1;
    connection.query("SELECT attempt_number FROM test_attempt WHERE user_id = (SELECT id FROM users WHERE name = ?) AND test_id = ?", [user_name, test_id], function (err, result) {
        if (result.length !== 0) {
            for (let i = 0; i < result.length; i++) {
                attempt_number = Math.max(attempt_number, result[i].attempt_number + 1);
            }
        }
        connection.query("INSERT INTO test_attempt (user_id, test_id, attempt_number, average_value, number_of_passes, number_of_mistakes, stadart_deviation) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?, ?, ?, ?)", [user_name, test_id, attempt_number, 0, 0, amount_of_mistakes, 0], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }
            console.log("Test attempt added to db");
            // let user_id;
            // connection.query("SELECT id FROM users WHERE name = ?", [user_name], function (err, result) {
            //     if (err) throw err;
            //     user_id = result[0].id;
            //     writeResult(user_id, test_id);
            // });
        });
    });
});


app.use(bodyParser.json());
app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    const login = jsonData.login ? jsonData.login.toString() : null;
    const password = jsonData.password ? jsonData.password.toString() : null;

    if (!login || !password) {
        return res.status(400).json({error: 'Отсутствуют данные для аутентификации'});
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
        return res.json({
            login: login,
            status: status,
            username: username,
            permissions: permissions,
            avatar: avatar,
            test_attempts: test_attempts,
            piq_opinions: piq_opinions
        });
    }

    connection.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, password], function (err, result) {
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }

        if (result.length === 0) {
            status = "error";
            return res.json({
                login: login,
                status: status,
                username: username,
                permissions: permissions,
                avatar: avatar,
                test_attempts: test_attempts,
                piq_opinions: piq_opinions
            });
        }

        status = "success";
        username = result[0].name.toString();
        permissions = result[0].permissions.toString();
        avatar = result[0].avatar.toString();
        const user_id = result[0].id;

        connection.query("SELECT test.name, test_attempt.average_value, test_attempt.number_of_passes, test_attempt.number_of_mistakes, test_attempt.stadart_deviation FROM test_attempt INNER JOIN test ON test_attempt.test_id = test.id WHERE test_attempt.user_id = ?", [user_id], function (err, result) {
            if (err) {
                console.error('Ошибка выполнения запроса к базе данных:', err);
                return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
            }

            connection.query("SELECT professions.name, piq.name, opinions.position FROM opinions JOIN professions ON professions.id = opinions.profession_id JOIN piq ON piq.id = opinions.piq_id WHERE user_id = ?", [user_id], function (err, result) {
                if (err) {
                    console.error('Ошибка выполнения запроса к базе данных:', err);
                    return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                }

                res.json({
                    login: login,
                    status: status,
                    username: username,
                    permissions: permissions,
                    avatar: avatar,
                    test_attempts: test_attempts,
                    piq_opinions: piq_opinions
                });
            });
        });

    });
});
app.get('/users', async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            connection.query("SELECT login, avatar, permissions, name FROM users", function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });

        const usersJsons = users.map(user => (
            {
                login: user.login,
                avatar: user.avatar == null ? "/default.jpg" : user.avatar.toString(),
                permission: user.permissions,
                username: user.name !== 'user' ? user.name : user.login.split('@')[0]
            }));

        usersJsons.forEach(user => {
            const name = user.username;
            app.get(`/${name}`, (req, res) => {
                const htmlFilePath = path.join(__dirname, 'profile.html');
                res.sendFile(htmlFilePath);
            });
        });

        res.json(usersJsons);
    } catch (error) {
        console.error('Ошибка при получении данных о пользователях:', error);
        res.status(500).json({error: 'Ошибка при получении данных о пользователях'});
    }
});
app.post('/avatars', (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    let avatar = jsonData.avatar;
    app.get(`${avatar}`, (req, res) => {
        res.sendFile(path.join(__dirname, '/pictures', `${avatar}`));
    });
    res.sendFile(path.join(__dirname, '/pictures', `${avatar}`));
});
app.get('/myStat', (req, res) => {
    const name = req.query.username;
    const testNum = req.query.testNum;

    connection.query("SELECT id FROM users WHERE name = ?", [name], function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send('User not found');
        }
        const user_id = result[0].id;

        connection.query("SELECT test_attempt.average_value FROM test_attempt WHERE test_attempt.user_id = ? AND test_attempt.test_id = ?", [user_id, testNum], function (err, result) {
            if (err) throw err;
            res.json(result.map(row => row.average_value));
        });
    });
});

app.post('/pvkpoint', (req, res) => {
    const jsonData = req.body;
    // console.log(jsonData);
    const user_name = jsonData.name;
    const profession_id = jsonData.prof;
    const order = jsonData.order;
    connection.query("DELETE FROM opinions WHERE profession_id = ?", [profession_id], function (err, result) {
        if (err) throw err;
        console.log("opinions in update");
    });
    for (let i = 0; i < order.length; i++) {
        //ВОТ ТУТ ВОПРОСЫ
        connection.query("SELECT id FROM piq WHERE name = ?", [order[i].id], function (err, result) {
            //ВОПРОСЫ ВОТ ТУТ
            if (err) throw err;
            console.log(result);
            let piqId = result[0].id;
            connection.query("INSERT INTO opinions (user_id, piq_id, profession_id, position) VALUES ((SELECT id FROM users WHERE name = ?), ?, ?, ?)", [user_name, piqId, profession_id, i + 1], function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            })
        })
    }
});
app.get('/api/pvk-items', (req, res) => {
    console.log('aaaa');
    connection.query('SELECT id, name FROM piq', (err, results) => {
        if (err) {
            console.error('Error fetching PVK items:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
            console.log(results);
        }
    });
});
app.get('/pictures/tests/:subfolder/:filename', (req, res) => {
    const {subfolder, filename} = req.params;
    const filePath = path.join(__dirname, 'pictures', 'tests', subfolder, filename);
    console.log(filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});
app.get('/pictures/tests/differences/:filename', (req, res) => {
    const {subfolder, filename} = req.params;
    const filePath = path.join(__dirname, 'pictures', 'tests', subfolder, filename);
    console.log(filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});
app.post('/suka', (req, res) => {
    console.log('aaaaa');
    const jsonData = req.body;
    const profession_id = jsonData.profession_id;
    connection.query("SELECT piq.name, opinions.position FROM opinions JOIN piq ON piq.id = opinions.piq_id WHERE profession_id = ?", [profession_id], function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});


// сохранение новой формулы
app.post('/api/save-formulas', (req, res) => {
    const jsonData = req.body;
    const piq = jsonData.piq;
    const args = jsonData.args;
    console.log(args);
    connection.query("SELECT formula_id FROM formulas WHERE piq_id = (SELECT id FROM piq WHERE name = ?)", [piq], function (err, result) {
        if (err) {
            console.error('Ошибка выполнения запроса к базе данных:', err);
            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
        }
        if (result.length === 0) {
            connection.query("INSERT INTO formulas (piq_id) VALUES ((SELECT id FROM piq WHERE name = ?))", [piq], function (err, result) {
                if (err) {
                    console.error('Ошибка выполнения запроса к базе данных:', err);
                    return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                }
                let formula_id = result.insertId;
                for (let i = 0; i < args.length; i++) {
                    const test_id = args[i].test_id;
                    const test_value = args[i].test_value;
                    const coef = args[i].coef;
                    const abs = args[i].abs;
                    connection.query("INSERT INTO arguments (formula_id, test_id, test_value, coefficient, abs) VALUES (?, ?, ?, ?, ?)", [formula_id, test_id, test_value, coef, abs], function (err, result) {
                        if (err) {
                            console.error('Ошибка выполнения запроса к базе данных:', err);
                            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                        }
                    });
                }
            });
        } else {
            let formula_id = result[0].formula_id;
            connection.query("DELETE FROM arguments WHERE formula_id = ?", [formula_id], function (err, result) {
                if (err) {
                    console.error('Ошибка выполнения запроса к базе данных:', err);
                    return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                }
                for (let i = 0; i < args.length; i++) {
                    const test_name = args[i].test_id;
                    const test_value = args[i].test_value;
                    const coef = args[i].coef;
                    const abs = args[i].abs;
                    connection.query("INSERT INTO arguments (formula_id, test_id, test_value, coefficient, abs) VALUES (?, ?, ?, ?, ?)", [formula_id, test_name, test_value, coef, abs], function (err, result) {
                        if (err) {
                            console.error('Ошибка выполнения запроса к базе данных:', err);
                            return res.status(500).json({error: 'Ошибка выполнения запроса к базе данных'});
                        }
                    });
                }
            })
        }
    })
});



app.get("/res", (req, res) => {
    const jsonData = req.body;
    const user_name = jsonData.name;
    connection.query("SELECT piq.name, results.result FROM results JOIN piq ON piq.id = results.piq_id WHERE user_id = (SELECT user_id WHERE name = ?)", [user_name], function (err, result) {
        if (err) throw err;
        const resultsJson = result.map(item => (
            {
                piq_name : item.name,
                result : item.result
            }
        ));
    });
        connection.query("SELECT results.result FROM results JOIN piq ON piq.id = results.piq_id WHERE user_id = (SELECT user_id WHERE name = ?)", [user_name], function (err, result){
            if (err) throw err;
            let sum = 0;
            result.forEach(item => sum += item.result);
            let resJson =   {sum : sum};
        });

});


app.listen(PORT2, () => {
    console.log("Сервер запущен на порту " + PORT2);
});

