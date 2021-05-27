const express = require('express'),
      morgan = require ('morgan'),
      uuid = require ('uuid'),
      bodyParser = require ('body-parser'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express(),
      Movies = Models.Movie,
      Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

//requests full list of movies
app.get('/movies',(req,res) => {
  res.json(movies);
});

//requests information about specifc movie by title
app.get('/movies/:title',(req,res) => {
  res.json(movies.find( (movie) =>
    { return movie.title === req.params.title }));
});

//requests information about a specific director
app.get('/movies/directors/:name', (req,res) => {
  res.send('Information about specfic director');
});

//requests genre information
app.get('/movies/genres/:genre', (req,res) => {
  res.send('Information about specific genre');
});

// Get all users
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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

//update username
app.put('/users/:username', (req, res) => {
  res.send(req.params.username + ', Your profile has been updated!');
});

//add titles to favorites
app.post('/users/:username/favorites', (req, res) => {
  res.send(req.params.title + ' added to your favorites!');
});

//delete titles from favorites
app.delete('/users/:username/favorites/:title', (req, res) => {
  res.send('You removed ' + req.params.title + ' from your favorites.');
});

//delete profile
app.delete('/users/:username', (req, res) => {
  res.send('You successfully deleted your profile');
});

app.get('/documenation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname
  });
});

app.use(express.static('/public'));

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! try again!!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
