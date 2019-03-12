
// Todo Model //////////////////////////////////////////////////////////////////

const Todo = require('./datastore');
var Promise = require('bluebird');
var todoHelper = Promise.promisifyAll(require('./datastore/index'));

// Configure Express ///////////////////////////////////////////////////////////

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, './public')));

// RESTful Routes for CRUD operations //////////////////////////////////////////

// Create (Crud) -- collection route
app.post('/todo', (req, res) => {
  Todo.create(req.body.todoText, (err, newTodo) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.status(201).json(newTodo);
    }
  });
});

// Read all (cRud) -- collection route
app.get('/todo', (req, res) => {
  exports.readAllFiles()
    .then((todos) => {
      res.status(200).json(todos);
    })
    .catch(() => {
      res.sendStatus(400);
    }); 
  // Todo.readAll((err, todos) => {
  //   if (err) {
  //     res.sendStatus(400);
  //   } else {
  //     res.status(200).json(todos);
  //   }
  // });
});

// Read one (cRud) -- member route
app.get('/todo/:id', (req, res) => {
  Todo.readOne(req.params.id, (err, todo) => {
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.sendStatus(404);
    }
  });
});

// Update (crUd) -- member route
app.put('/todo/:id', (req, res) => {
  Todo.update(req.params.id, req.body.todoText, (err, todo) => {
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.sendStatus(404);
    }
  });
});

// Delete (cruD) -- member route
app.delete('/todo/:id', (req, res) => {
  Todo.delete(req.params.id, (err) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});


// Promisify fucntion //////////////////////////////////////////////////////////

exports.readAllFiles = () => {
  return todoHelper.readAllAsync()
    .then((allTodos) => {
      var finalArr = [];
      allTodos.forEach((singleTodo) => {
        finalArr.push(todoHelper.readOneAsync(singleTodo.id));
      });
      return Promise.all(finalArr).then((allTodos) => {
        return allTodos;
      });
    });
};







// Start & Initialize Web Server ///////////////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log('CRUDdy Todo server is running in the terminal');
  console.log(`To get started, visit: http://localhost:${port}`);
});

Todo.initialize();
