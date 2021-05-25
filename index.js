const express = require('express'),
      morgan = require ('morgan'),
      uuid = require ('uuid'),
      bodyParser = require ('body-parser'),
      app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
  {
    title: 'Us',
    year: 2019,
    director: 'Jordan Peele',
    genres:['horror','thriller']
  },
  {
    title: 'Get Out',
    year: 2017,
    director: 'Jordan Peele',
    genres:['horror','thriller']
  },
  {
    title: 'A Quiet Place',
    year: 2018,
    director: 'John Krazinski',
    genres:['horror','thriller']
  },
  {
    title: 'The Cabinet of Doctor Calgari',
    year: 1921,
    director: 'Robert Wiene',
    genres:['horror']
  },
  {
    title: 'Nosferatu',
    year: 1922,
    director: 'F.W. Murnau',
    genres:['horror']
  },
  {
    title:'King Kong',
    year: 1933,
    director: ['Merian C. Cooper', 'Ernest B. Schoedsack'],
    genres:['adventure', 'fantasy']
  },
  {
    title: 'Psycho',
    year: 1960,
    director: 'Alfred Hitchcock',
    genres:['horror', 'thriller']
  },
  {
    title:'The Invisible Man',
    year: 2020,
    director: 'Leigh Whannell',
    genres:['horror', 'thriller']
  },
  {
    title:'The Bride of Frankenstein',
    year: 1935,
    director: 'James Whale',
    genres:['horror']
  },
  {
    title: 'The Babadook',
    year: 2014,
    director: 'Jennifer Kent',
    genres:['horror','thriller']
  }
]

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

//allows registration
app.post('/users', (req, res) => {
  res.send('Registration successful!')
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
