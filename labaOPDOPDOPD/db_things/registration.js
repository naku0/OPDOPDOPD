const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty0987654321",
    database: "opdopdopd"
});
//функция регистрации
export function registration(connection, login, password, name, surname){

    connection.connect(function (err){
        if (err) throw err;
        connection.query("SELECT login FROM users", function (err, result, fields){ //запрашиваем все логины
            if (err) throw err;
            let flag = true;
            for (let log in result){ //проверяем нет ли юзера с таким логином
                if (log.login === login){
                    flag = false;
                }
            }
            if (!(flag)){ //если есть - шлём нахуй, хотя надо попросить придумать другой логин
                console.log("User already exist!");
            }else{ //если нет - делаем новую запись в бд и все круто классно
                connection.query("INSERT INTO users (login, password, name, surname, permissions) VALUES (login, password, name, surname, 0)", function (err, result){
                    if (err) throw err;
                    console.log("Registration success!");
                });
            }
        });
        connection.end();
    });
}
export default function (){registration()};