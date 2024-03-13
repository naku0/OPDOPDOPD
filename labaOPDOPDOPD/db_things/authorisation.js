const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "opdopdopd"
});
//функция авторизации
function authorisation(connection, get_login, get_password){
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
            for (let log in logs_and_pass){ //проверяем есть ли вообще такой логин
                if (log.login === get_login){
                    flag = true;
                    login = log.login;
                    password = log.password;
                }
            }
            if (!(flag)){ //Если нет такого логина - шлем нахуй
                message = "No such user!";
                result = false;
            }else{
                if (get_password === password){ //если есть и пароль совпадает - все заебись
                    message = "Authorisation successful!";
                    result = true;
                }else{ //если не совпадает пароль - тоже шлем нахуй, хотя надо бы еще раз пароль запросить
                    message = "Wrong password!";
                    result = false;
                }
            }
        });
    });
    console.log(message);
    return result;
}
export {authorisation};