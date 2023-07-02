import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import EditTodo from "./EditTodo";
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function ListTodos() {
  const [todos, setTodos] = useState([]);
  const { user_id } = useParams(); 

  const [loggedInUserId, setLoggedInUserId] = useState(1);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const decodedUserId = decodedToken?.userId;
  
  // Delete todo function
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${user_id}/${id}`); 
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  
  const getTodos = async () => { 
    try {
      const response = await axios.get(`http://localhost:4000/todos/${user_id}`);
      console.log(response);
      setTodos(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  console.log(todos);

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
