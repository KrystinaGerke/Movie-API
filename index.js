const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');

const Movie = Models.Movie;
const Users = Models.Users;
const Genres = Models.Genre;
const Directors = Models.Directors;

mongoose.connect('mongodb://localhost:27017/myFlix', {
  useNewUrlParser: true, useUnifiedTopology: true
});

const express = require('express');
morgan = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('common'));

//READ
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

//READ
app.use(express.static('public'));
app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

//READ
app.get('/movies', (req, res) => {
  Movies.find({Title:req.params.movieTitle})
  .then(result => res.json(result))
  .catch(e => console.error(e))
});

//READ
app.get('/movies/:movieTitle', (req, res) => {
  const {movieTitle} = req.params;
  const movies = Movies.find(Movies => Movies.Title === title );

  if (movies) {
    res.status(200).json(movies);
  } else {
    res.status(400).send('This movie is not in our database')
  }
}); 

//READ
app.get('/genres/:genre', (req, res) => {
  const {genreName} = req.params;
  const genre = Movies.find(Movies => Movies.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('This genre is not in our database')
  }
}); 

//READ
app.get('/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const directors = movies.find(movie => movie.Director.Name === directorName).Director;

  if (directors) {
    res.status(200).json(directors);
  } else {
    res.status(400).send('This director is not in our database')
  }
}); 

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('All users need a Username')
  }
}); 

//UPDATE
app.put('/users/:ID/:infoToUpdate/:newValue', (req, res) => {
  res.send('Successful PUT to update users username information.');
}); 

//CREATE
app.post('/users/:ID/favorites/:newFavorite', (req, res) => {
  res.send('Successful POST to the server for a new favorite movie on a specific users profile.');
}); 

//DELETE
app.delete('/users/:id/unregister', (req, res) => {
  res.send('Successful DELETE to the server that removes a user from the database.');
}); 

//DELETE
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