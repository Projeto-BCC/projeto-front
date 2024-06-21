const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy', (req, res) => {
    const request = require('request');
    const url = 'https://info.dengue.mat.br/api/alertcity/?geocode=3506003&disease=dengue&format=json&ew_start=21&ey_start=2024&ew_end=25&ey_end=2024';
    request(url).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});