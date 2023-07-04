import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from 'jwt-decode';

function EditTodo() {
  const [description, setDescription] = useState('');
  const [todo, setTodo] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;

  const { todo_id } = useParams();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/todos`);
        console.log(response)
        setTodo(response.data.todo_id);
        setDescription(response.data.description);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodo();
  }, [todo_id]);



  const updateTodo = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/todos/${todo.todo_id}`, { description });
      console.log(response.data);

      setTodo({
        ...todo,
        description: description
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <Fragment>
      {todo && (
        <>
          <button
            type="button"
            className="btn btn-warning"
            data-toggle="modal"
            data-target={todo.todo_id}
          >
            تعديل
          </button>

          <div
            className="modal"
            id={todo.todo_id}
            onClick={() => setDescription(todo.description)}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">تعديل على المهمة</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDescription(todo.description);
                    }}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-warning"
                    data-dismiss="modal"
                    onClick={updateTodo}
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDescription(todo.description);
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
}

export default EditTodo;
