const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 1488;
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
})
app.get('/SysAdmin.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAdmin.html');
    res.sendFile(htmlFilePath);
})
app.get('/SysAnal.html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'SysAnal.html');
    res.sendFile(htmlFilePath);
})

app.use(bodyParser.json());

app.post('/endpoint', (req, res) => {
    const jsonData = req.body;
    console.log('Полученные данные:', jsonData);
    res.send('Данные успешно получены на сервере');
    console.log(req.body)
});

app.listen(1337, () => {
    console.log('Сервер запущен на порту 3000');
});