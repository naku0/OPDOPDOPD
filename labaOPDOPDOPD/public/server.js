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
