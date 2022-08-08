const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { json } = require('express');

const PORT = process.env.PORT || 3003;

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved for Notes`);
  res.sendFile(path.join(__dirname, './db/db.json'))
});

app.get('/api/trails', (req, res) => {
    console.info(`${req.method} request recieved for Notes`);
    res.sendFile(path.join(__dirname, './db/trails.json'))
  });



app.get('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request recieved for Notes`);
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data)
      const result = notes.filter((note) => note.id === noteId);
      return result.length > 1
        ? res.json(result)
        : res.json('No note with that ID');
    }});
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved for Notes`);
  console.log(req.body)
  const { title, text } = req.body
  const newNote = {
    title: title,
    text: text,
    id: uuidv4(),
  }
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);
      console.log(notes);
      fs.writeFile('./db/db.json', JSON.stringify(notes),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });
  const response = {
    status: 'Success!',
    body: newNote,
  };
  console.log(response);
  res.json(response);
});

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request recieved for Notes`);
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      const newNotes = notes.filter(note => note.id !== noteId)
      fs.writeFile('./db/db.json', JSON.stringify(newNotes), function(err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log(data)
          res.json(`Note ${noteId} has been delted`) 
        } 
      })
    }
        
  })
 
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);


module.exports = app;