const  express = require('express');
const app =  express();
const path = require('path');
const PORT = 1488;
app.use( express.static(path.join(__dirname, 'public')));
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