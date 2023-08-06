const express = require('express');
const router = express.Router();
const todoController = require('../controller/todoController');

// Post a to do to the database
router.post("/todos", todoController.postTodoTasks);

// Get all todos
router.get("/todos/:user_id", todoController.getAllTodoTasks);


// Update a to do
router.put("/todos/:todo_id", todoController.updateTodo);

// Delete a to do
router.delete("/todos/:todo_id", todoController.deleteTodo);



module.exports = router;
