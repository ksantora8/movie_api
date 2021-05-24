const express = require('express'),
      morgan = require ('morgan'),
      uuid = require ('uuid'),
      bodyParser = require ('body-parser'),
      app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('/public'));
//app.use((err, req, res, next) => {
//  console.error(err.stack);
  //res.status(500).send('Something broke!');
//});
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
  res.send('Welcome to my app!');
});

app.get('/movies',(req,res) => {
  res.json(movies);
});

app.get('/documenation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname
  });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
