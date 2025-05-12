const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

app.use(express.static(__dirname));

app.get(['/:categorie/:masina-:id', '/:masina-:id'], (req, res) => {
    let { categorie, masina, id } = req.params;

    console.log('Categorie:', categorie);
    console.log('Masina:', masina);
    console.log('ID:', id);

    if (masina && !masina.startsWith(':')) {
        res.sendFile(path.join(__dirname, 'piese-details.html'));
    } else {
        res.sendFile(path.join(__dirname, 'masini-details.html'));
    }
});


// Rute pentru filtre de categorii
app.get('/:tip', (req, res, next) => {
    if (req.params.tip.includes('-')) return next(); // Dacă e de forma masina-id, trece mai departe
    console.log('Tip:', req.params.tip);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:tip/:categorie', (req, res, next) => {
    if (req.params.categorie.includes('-')) return next();
    console.log('Tip:', req.params.tip);
    console.log('Categorie:', req.params.categorie);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:tip/:categorie/:subcategorie', (req, res, next) => {
    console.log('Tip:', req.params.tip);
    console.log('Categorie:', req.params.categorie);
    console.log('Subcategorie:', req.params.subcategorie);
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Pornim serverul
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});





