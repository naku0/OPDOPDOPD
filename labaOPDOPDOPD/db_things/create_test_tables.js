const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321"
});
//файл для создания таблиц тестов и их попыток у юзеров
connection.connect(function(err){
    if (err) throw err;
    const use_db = "USE opdopdopd";
    const create_test = "CREATE TABLE IF NOT EXISTS test(id INT AUTO_INCREMENT, name VARCHAR(250) NOT NULL UNIQUE, PRIMARY KEY (id))";
    const create_test_attempt = "CREATE TABLE IF NOT EXISTS test_attempt(user_id INT NOT NULL, test_id INT NOT NULL, attempt_number INT NOT NULL, average_value DOUBLE NOT NULL, number_of_passes INT NOT NULL, number_of_mistakes INT, FOREIGN KEY fk_user_id (user_id) REFERENCES users(id), FOREIGN KEY fk_test_id (test_id) REFERENCES test(id))";
    console.log("Connected!");

    connection.query(use_db, function (err, result){
        if (err) throw err;
        console.log("DB is in use!");
    });
    connection.query(create_test, function (err, result){
        if (err) throw err;
        console.log("Test table created!");
    });
    connection.query(create_test_attempt, function (err, result){
        if (err) throw err;
        console.log("Test_attempt table created!");
    });
})