import React, { Fragment, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function EditTodo({ todo }) {
  const [description, setDescription] = useState(todo.description);

  const { user_id } = useParams();

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const loggedInUserId = decodedToken?.userId;

  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const body = { description, user_id: loggedInUserId };
      await axios.put(`http://localhost:4000/todos/${todo.todo_id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
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
                onClick={(e) => {
                  e.stopPropagation();
                  updateDescription(e);
                }}
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
    </Fragment>
  );
}

export default EditTodo;
