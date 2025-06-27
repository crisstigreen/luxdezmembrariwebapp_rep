const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// 1. Servește fișiere statice din folderul 'public'
app.use(express.static(__dirname));
//app.use(express.static(path.join(__dirname, 'public')));

// 2. Servește favicon explicit (ca să nu intre în /:tip)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// pentru DEV TOOLS
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end(); // No Content
});


//***************************RUTE DETALII************************************  */

app.get(/^\/:([a-z0-9\-]+)-(\d+)$/i, (req, res, next) => {
  const url = req.originalUrl;           // ex: '/:daihatsu-boon-3-generation-2016---2019-548'
  const parts = url.split('-');          // split după cratimă
  const last = parts[parts.length - 1];  // ultimul segment (ex: '548')

  // Verifică numeric, lungimea ID-ului și să înceapă cu /:
  if (!/^\d+$/.test(last) || last.length < 3 || !url.startsWith('/:')) {
    return next();
  }

  // Verifică dacă URL-ul se termină cu ---<cifre>-<cifre>
  if (!/---\d+-\d+$/i.test(url)) {
    return next();
  }

  // Se potrivește structura regex din ruta
  const match = url.match(/^\/:([a-z0-9\-]+)-(\d+)$/i);
  if (!match) return next();

  const masina = match[1];
  const id = match[2];

  // ✅ Totul valid → trimite pagina de detalii
  return res.sendFile(path.join(__dirname, 'masini-details.html'));
});




// 4. Rute specifice pentru detalii piese 
app.get(/^\/(([^\/]+-)?[^\/]+-)?([a-z0-9\-]+)-(\d+)$/i, (req, res, next) => {
    const url = req.originalUrl;
    const parts = url.split('-');
    const lastPart = parts[parts.length - 1];

    // Verificăm dacă ultima parte e numerică
    const isNumeric = /^\d+$/.test(lastPart);

    // Dacă NU e numeric => clar NU e detaliu piesă
    if (!isNumeric) return next();

    // Dacă numărul are mai puțin de 5 cifre => probabil model, nu ID (ex: 147, 2010)
    if (lastPart.length < 5) return next();

    // Verificăm expresia completă
    const match = url.match(/^\/(([^\/]+-)?[^\/]+-)?([a-z0-9\-]+)-(\d+)$/i);
    if (!match) return next();

    const masina = match[3];
    const id = match[4];

    return res.sendFile(path.join(__dirname, 'piese-details.html'));
});


//***************************RUTE FILTRARE MASINI************************************  */

// Ruta pentru marca (ex: http://.../:alfa-romeo)
app.get('/::marca', (req, res, next) => {
  const { marca } = req.params;
  const isMarcaOk = /^[a-z0-9\-]+$/i.test(marca);
  if (!isMarcaOk) return next();
  res.sendFile(path.join(__dirname, 'masini.html'));
});





//***************************RUTE FILTRARE PIESE************************************  */
app.get('/:marca', (req, res, next) => {
    const { marca } = req.params;
    const isMarcaOk = /^[a-z0-9\-]+$/i.test(marca);
    if (!isMarcaOk) return next();
    res.sendFile(path.join(__dirname, 'piese.html'));
});


// Ruta pentru marca-model (ex: /alfa-romeo-147)
app.get('/:marca-:model', (req, res, next) => {
    const { marca, model } = req.params;
    const isValid = /^[a-z0-9\-]+$/i.test(marca) && /^[a-z0-9\-]+$/i.test(model);
    if (!isValid) return next();

    // Trimitem pagina piese pentru marca și model
    res.sendFile(path.join(__dirname, 'piese.html'));
});

// Ruta pentru marca-model-generatie
app.get('/:marca-:model-:generatie', (req, res, next) => {
    const { marca, model, generatie } = req.params;
    const isValid = /^[a-z0-9\-]+$/i.test(marca)
        && /^[a-z0-9\-]+$/i.test(model)
        && /^[a-z0-9\-]+$/i.test(generatie);

    if (!isValid) return next();

    return res.sendFile(path.join(__dirname, 'piese.html'));
});



//***************************RUTE CATEGORII************************************  */

// 5. Rute pentru meniul în 3 nivele (ex: /interior/sistem-siguranta/senzor-impact)
app.get('/:tip/:categorie/:subcategorie', (req, res) => {
    res.sendFile(path.join(__dirname, 'piese.html'));
});


// 6. Ruta pentru 2 nivele (ex: /interior/sistem-siguranta)
app.get('/:tip/:categorie', (req, res) => {
    res.sendFile(path.join(__dirname, 'piese.html'));
});


// 7. Ruta pentru 1 nivel (ex: /interior)
app.get('/:tip', (req, res, next) => {  
    res.sendFile(path.join(__dirname, 'piese.html'));
});

// 8. Rută fallback pentru orice altceva
app.use((req, res) => {
    console.log('404 la URL:', req.originalUrl);
    res.status(404).send('Pagina nu a fost găsită.');
});

// 9. Start server
app.listen(PORT, () => {
    console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});