const express = require('express'),
      morgan = require ('morgan'),
      app = express();

app.use(morgan('common'));
app.use(express.static('/public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies',(req,res) => {
  res.json([
    {movie1:'info1'},
    {movie2:'info2'},
    {movie3:'info3'},
    {movie4:'info4'},
    {movie5:'info5'},
    {movie6:'info6'},
    {movie7:'info7'},
    {movie8:'info8'},
    {movie9:'info9'},
    {movie10:'info10'}
  ]);
});

app.get('/documenation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname
  });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
