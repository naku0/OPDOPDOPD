const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321"
});
//файл для заполнения таблицы тестов
connection.connect(function (err){
    if (err) throw err;
    const use_db = "USE opdopdopd";
    const add_professions = "INSERT INTO `professions` (`name`) VALUES ('Гейм-дизайнер'), ('Системный аналитик'), ('Системный администратор')";
    console.log("Connected!");

    connection.query(use_db, function (err) {
        if (err) throw err;
        console.log("DB is in use!");
    });
    connection.query(add_professions, function (err){
        if (err) throw err;
        console.log("Professions are inserted!");
    });
});