const express = require('express');
morgan = require('morgan');
const app = express();


let topMovies = [
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

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.use(express.static('public'));
app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:movieTitle', (req, res) => {
  let movie = topMovies.find(m => m.title === req.params.movieTitle)
  res.json(movie)
}); 

app.get('/genres/:genre', (req, res) => {
  res.send('Successful GET request of all major genres in the movie field.');
}); 

app.get('/directors/:directorName', (req, res) => {
  res.send('Successful GET request of directors information.');
}); 

app.post('/register', (req, res) => {
  res.send('Successful POST to the server a new users information.');
}); 

app.put('/users/:ID/:infoToUpdate/:newValue', (req, res) => {
  res.send('Successful PUT to update users username information.');
}); 

app.post('/users/:ID/favorites/:newFavorite', (req, res) => {
  res.send('Successful POST to the server for a new favorite movie on a specific users profile.');
}); 

app.delete('/users/:id/unregister', (req, res) => {
  res.send('Successful DELETE to the server that removes a user from the database.');
}); 

app.delete('/users/:ID/favorites/:deleteFavorite', (req, res) => {
  res.send('Successful DELETE of a movie from an individual users favorite list on the database.');
}); 


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});