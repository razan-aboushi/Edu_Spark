import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from 'jwt-decode';

function ListTodos() 
{
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;


  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!description) {
      return;
    }
    try {
      const body = { description, user_id };
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



  const handleEditTodoModalOpen = (todo_id) => {
    const selectedTodo = todos.find((todo) => todo.todo_id === todo_id);
  console.log(selectedTodo)
    if (!selectedTodo) {
      console.error(`Todo with todo_id ${todo_id} not found.`);
      return;
    }
  

    setSelectedTodo(selectedTodo);

    Swal.fire({
      title: "تعديل على المهمة",
      html: `
        <input
          type="text"
          class="swal2-input"
          value="${selectedTodo.description}"
          id="swal-description"
        />
      `,
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      confirmButtonText: "تعديل",
      focusConfirm: false,
      preConfirm: () => {
        const updatedDescription = document.getElementById("swal-description").value;
        if (!updatedDescription) {
          Swal.showValidationMessage("يجب إدخال وصف المهمة");
        }
        return updatedDescription;
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          const updatedDescription = result.value;
          const updatedTodo = { ...selectedTodo, description: updatedDescription };
          setSelectedTodo(updatedTodo);
          updateTodo();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };




  const handleTodoUpdate = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todo_id === updatedTodo.todo_id ? updatedTodo : todo
      )
    );
  };



  

  const updateTodo = async () => {
    if (!selectedTodo || !selectedTodo.todo_id) {
      console.error("Selected todo or todo_id is null");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/todos/${selectedTodo.todo_id}`,
        {
          description: selectedTodo.description,
        }
      );
      console.log(response.data);
      handleTodoUpdate(response.data);
      getTodos();
      Swal.fire({
        icon: "success",
        title: "تم التعديل",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تحديث المهمة",
      });
    }
  };

  return (
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
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => handleEditTodoModalOpen(todo.todo_id)}
                  >
                    تعديل
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTodo(todo.todo_id)}>
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