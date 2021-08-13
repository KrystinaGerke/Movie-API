const express = require('express');
const app = express();

let topMoves = [
  {
    title: 'Dune',
    director: 'Frank Herbert'
  },
  {
    title: 'Stargate',
    director: 'Ronald Emmerich'
  },
  {
    title: 'Underworld',
    director: 'Len Wiseman'
  },
  {
    title: 'The Neverending Story',
    director: 'Wolfgang Petersen'
  },
  {
    title: 'The Princess Bride',
    director: 'Rob Reiner'
  },
  {
    title: 'The Goonies',
    director: 'Joe Dante'
  },
  {
    title: 'Van Helsing',
    director: 'Stephen Sommers'
  },
  {
    title: 'Serenity',
    director: 'Joss Whedon'
  },
  {
    title: 'The Fifth Element',
    director: 'Luc Besson'
  },
  {
    title: 'Star Trek Into Darkness',
    director: 'JJ Abrams'
  },
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});