const mysql = require("mysql2");

const connection = mysql.createConnection({
    port: "1337",
    host: "localhost",
    user: "root",
    password: "1234"
});
//файл для заполнения таблицы с категориями пвк
connection.connect(function (err){
    if (err) throw err;
    const use_db = "USE opdopdopd";                                             //1                                                 2                                      3                                 4                                 5                               6                         7                                     8                                     9                             10                             11                            12                                              13                             14                                                             15
    const add_categories = "INSERT INTO `categories` (`name`) VALUES ('Ценностно-побудительные качества личности'), ('Регуляторные качества личности'), ('Индивидуально-типологические ПВК'), ('Свойства восприятия'), ('Свойства представления и воображения'), ('Свойства мышления'), ('Зрительная долговременная память'), ('Зрительная оператевная память'), ('Слуховая долговременная память'), ('Слуховая оператевная память'), ('Кинестетическая память'), ('Энергопластический потенциал индивида'), ('Общие операциональные качества'), ('Физиологические ПВК  (Регуляторные качества организма)'), ('Физические ПВК ( Морфологические качества индивида)')";
    console.log("Connected!");
    connection.query(use_db, function (err){
        if (err) throw err;
        console.log("DB is in use!");
    });
    connection.query(add_categories, function (err){
        if (err) throw err;
        console.log("Values are inserted!");
    })
});
