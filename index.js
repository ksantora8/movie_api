const express = require('express'),
      morgan = require ('morgan'),
      uuid = require ('uuid'),
      bodyParser = require ('body-parser'),
      mongoose = require('mongoose'),
      Models = require('./models.js'),
      passport = require ('passport'),
      cors = require ('cors'),
      {check, validationResult} = require ('express-validator');

require('./passport');

const app = express(),
      Movies = Models.Movie,
      Users = Models.User;

app.use(cors());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('/public'));
let auth = require('./auth')(app);


mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//test to make sure DB is connected
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connectionasdf error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoDB!');
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});


//get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get a movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ title: req.params.title })
   .then((movie) => {
      res.json(movie);
    })
   .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//get information on a specific director
app.get('/movies/director/:name', (req, res) => {
	Movies.findOne({'Director.name': req.params.name})
	.then((movie) => {
		res.json(movie.Director);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});


//get information on a genre
app.get('/movies/genre/:name', (req, res) => {
	Movies.findOne({'Genre.name': req.params.name})
	.then((movie) => {
		res.json(movie.Genre);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});


// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
   .then((user) => {
      res.json(user);
    })
   .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//allows registration
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  name: String,
  email: String,
  password: String,
  birthday: Date
}*/
app.post('/users',
  [
  check('Username', 'Username is required').isLength({min:4}),
  check('Username', 'Username must be alphanumeric').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email is invalid').isEmail()], (req,res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()});
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
            Email: req.body.Email,
            Password: hashedPassword,
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

// PUT REQUESTS
// Update a user's info, by username
/* We’ll expect JSON in this format
{
  name: String,
  (required)
  email: String,
  (required)
  password: String,
  (required)
  birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Email: req.body.Email,
      Password: hashedPassword,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params._id }
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


//delete titles from favorites
//Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({Username: req.params.Username},
    { $pull: { Favorites: req.params._id} },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
			} else {
        res.json(updatedUser);
      }
    });
});

// Delete by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.get("/documentation" , (req,res) =>{
    res.sendFile("public/documentation.html",{root:__dirname});
});


//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! try again!!');
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port " + port);
});
