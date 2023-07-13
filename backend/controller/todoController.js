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
  const { todo_id } = req.params;
  const { description } = req.body;

  const updateQuery = 'UPDATE todos SET description = ? WHERE todo_id = ?';
  connection.query(updateQuery, [description, todo_id], (error, results) => {
    if (error) {
      console.error('Error updating todo:', error);
      return res.status(500).json({ error: 'Error updating todo' });
    }

    res.json({ success: true, message: 'Todo updated successfully' });
  });
}






// Delete a to-do
const deleteTodo = (req, res) => {
  const { todo_id } = req.params;

  const deleteQuery = 'DELETE FROM todos WHERE todo_id = ?';
  connection.query(deleteQuery, [todo_id], (error, results) => {

    if (error) {
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Error deleting todo' });
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  });
}




// Get a specific to-do
const getTodoTask = (req, res) => {
  try {
    const { id, user_id } = req.params;

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
        console.log(result)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while retrieving todos.' });
  }
};






// GET /todos/:id - Retrieve a specific todo by its ID
// Use the connection pool to execute queries
const getTodoId = async (req, res) => {
  try {
    const todo = await new Promise((resolve, reject) => {
      // Use the connection object to execute the query
      connection.query('SELECT * FROM todos', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};










module.exports = {
  updateTodo,
  deleteTodo,
  getTodoTask,
  getAllTodoTasks,
  postTodoTasks, getTodoId
};
