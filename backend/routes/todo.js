const express = require('express');
const router = express.Router();
const todoController = require('../controller/todoController');

// Post a to do to the database
router.post("/todos", todoController.postTodoTasks);

// Get all todos
router.get("/todos/:user_id", todoController.getAllTodoTasks);

// Get a specific to do
router.get("/todos/:user_id/:id", todoController.getTodoTask);

// Update a to do
router.put("/todos/:id", todoController.updateTodo);

// Delete a to do
router.delete("/todos/:id/:user_id", todoController.deleteTodo);

module.exports = router;
