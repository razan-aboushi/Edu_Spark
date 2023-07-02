const connection = require('../models/dbConnect');

// Post to-dos
const postTodoTasks = (req, res) => {
  try {
    const { description, user_id } = req.body;
    connection.query(
      "INSERT INTO todos (description, user_id) VALUES (?, ?)",
      [description, user_id],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'An error occurred while creating a new todo.' });
        } else {
          res.json({ id: result.insertId, description });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while creating a new todo.' });
  }
};

// Update a to-do
const updateTodo = (req, res) => {
  try {
    const { id } = req.params;
    const { description, user_id } = req.body;
    
    
    connection.query(
      "UPDATE todos SET description = ? WHERE todo_id = ? AND user_id = ?",
      [description, id, user_id],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'An error occurred while updating the todo.' });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Todo not found or unauthorized.' });
        } else {
          res.json({ message: 'Todo was updated!' });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while updating the todo.' });
  }
};

// Delete a to-do
const deleteTodo = (req, res) => {
  try {
    const { id ,  user_id} = req.params;

    connection.query("DELETE FROM todos WHERE todo_id = ? AND user_id = ?", [id, user_id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while deleting the todo.' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Todo not found or unauthorized.' });
      } else {
        res.json({ message: 'Todo was deleted!' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while deleting the todo.' });
  }
};


// Get a specific to-do
const getTodoTask = (req, res) => {
  try {
    const { id  , user_id } = req.params;

    connection.query("SELECT * FROM todos WHERE todo_id = ? AND user_id = ?", [id, user_id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while retrieving the todo.' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Todo not found or unauthorized.' });
      } else {
        res.json(result[0]);
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while retrieving the todo.' });
  }
};

// Get all to-dos for a specific user
const getAllTodoTasks = (req, res) => {
  try {
    const { user_id } = req.params;
    
    connection.query("SELECT * FROM todos WHERE user_id = ?", [user_id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'An error occurred while retrieving todos.' });
      } else {
        res.json(result);
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while retrieving todos.' });
  }
};

module.exports = {
  updateTodo,
  deleteTodo,
  getTodoTask,
  getAllTodoTasks,
  postTodoTasks
};
