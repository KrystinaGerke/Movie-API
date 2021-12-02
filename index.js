const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// mongoose.connect('mongodb://localhost:27017/myFlix', {
//   useNewUrlParser: true, 
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connects the auth file for log ins to connect to this file
const passport = require('passport');
require('./passport');
require('./auth')(app);

//adding cors
const cors = require('cors');
app.use(cors());

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
//Gets all information about all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error: ' + err);
    });
});

// app.get("/movies", function (req, res) {
//   Movies.find()
//     .then(function (movies) {
//       res.status(201).json(movies);
//     })
//     .catch(function (error) {
//       console.error(error);
//       res.status(500).send("Error: " + error);
//     });
// });

//READ
//Gets movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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
app.put('/users/:ID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ id: req.params.id }, { $set:
    {
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
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
app.post('/users/:ID/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ user_name: req.params.ID }, {
    $push: { FavoriteMovies: req.params.movieID }
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
app.delete('/users/:id/unregister', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:ID/:deleteFavorite', passport.authenticate('jwt', { session: false }), (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});