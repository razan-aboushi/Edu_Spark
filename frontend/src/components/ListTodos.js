import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import EditTodo from "./EditTodo";
import jwt_decode from 'jwt-decode';

function ListTodos() {
  const [todos, setTodos] = useState([]);

  const [loggedInUserId, setLoggedInUserId] = useState(1);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;

  const deleteTodo = async (todo_id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${todo_id}`);
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const getTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/todos/${user_id}`);
      setTodos(response.data);
      console.log(todos);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Fragment>
      <div className="d-flex justify-content-center mt-5">
        <table className="table w-75">
          <thead>
            <tr className="text-center">
              <th>المهمة</th>
              <th>تعديل المهمة</th>
              <th>حذف المهمة</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.todo_id}>
                <td>{todo.description}</td>
                <td>
                  <EditTodo todo={todo} userId={user_id} />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTodo(todo.todo_id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default ListTodos;
