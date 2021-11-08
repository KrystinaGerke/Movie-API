const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlix', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//logs requests to server
app.use(morgan('common'));

//
app.use(express.static('public'));
app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

//READ- innitial text response when going to the site
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

//READ
//Gets all information about a movie
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

//READ
//Gets movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title : req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ
//Gets info about a specific genre
app.get('/movies/genre/:name', (req, res) => {
  Movies.findOne({ "Genre.Name" : req.params.name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ
//Gets information about a specific director
app.get('/movies/director/:name', (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ 
//Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//UPDATE
//update user info
app.put('/users/:ID', (req, res) => {
  Users.findOneAndUpdate({ id: req.params.id }, { $set:
    {
      id: req.body.id,
      Password: req.body.Password,
      Email: req.body.Email,
      birth_day: req.body.birth_day
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//CREATE
//adds a favorite movie to a specific user's profile 
app.post('/users/:ID/:movieTitle', (req, res) => {
  Users.findOneAndUpdate({ user_name: req.params.id }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, 
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});

//DELETE
//removes a user from the db
app.delete('/users/:id/unregister', (req, res) => {
  Users.findOneAndRemove({ id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.user_name + ' was not found');
      } else {
        res.status(200).send(req.params.user_name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//DELETE
//deletes a favorite movie from the users favorites list
app.delete('/users/:ID/favorites/:deleteFavorite', (req, res) => {
  Users.findOneAndUpdate({ user_name: req.params.id }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});