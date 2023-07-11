import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import EditTodo from "./EditTodo";
import jwt_decode from 'jwt-decode';

function ListTodos() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");


  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;



  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!description) {
      return;
    }
    try {
      const body ={ description, user_id};
      await axios.post("http://localhost:4000/todos", body, {
        headers: { "Content-Type": "application/json" },
      });
      getTodos();
      setDescription("");
    } catch (err) {
      console.error(err.message);
    }
  };


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
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);





  return (
    <>
      <Fragment>
        <div className="text-center wow fadeInUp mt-5" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
            قائمة المهام
          </h6>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <form className="w-75" onSubmit={onSubmitForm}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="أضف مهمة جديدة..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className="btn-success p-3" type="submit">
                إضافة
              </button>
            </div>
          </form>
        </div>
      </Fragment>


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
    </>
  );
}

export default ListTodos;
