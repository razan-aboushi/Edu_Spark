// import React, { Fragment, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// function EditTodo({ todo, user_id, onUpdate, onClose }) {
//   const [description, setDescription] = useState('');

//   // const updateTodo = async () => {
//   //   try {
//   //     const response = await axios.put(
//   //       `http://localhost:4000/todos/${todo.todo_id}`,
//   //       {
//   //         description: description,
//   //       }
//   //     );
//   //     console.log(response.data);
//   //     onUpdate(response.data);
//   //     Swal.fire({
//   //       icon: "success",
//   //       title: "تم التعديل",
//   //       showConfirmButton: false,
//   //       timer: 1500,
//   //     });
//   //     onClose();
//   //   } catch (error) {
//   //     console.error("Error updating todo:", error);
//   //     Swal.fire({
//   //       icon: "error",
//   //       title: "خطأ",
//   //       text: "حدث خطأ أثناء تحديث المهمة",
//   //     });
//   //   }
//   // };

//   // const openEditConfirmation = () => {
//   //   Swal.fire({
//   //     title: "هل أنت متأكد؟",
//   //     text: "سيتم تحديث المهمة",
//   //     icon: "question",
//   //     showCancelButton: true,
//   //     confirmButtonText: "نعم",
//   //     cancelButtonText: "لا",
//   //     reverseButtons: true,
//   //   }).then((result) => {
//   //     if (result.isConfirmed) {
//   //       // updateTodo();
//   //     }
//   //   });
//   // };

//   return (
//     <Fragment>
//       <div id={todo.todo_id}>
//         <div>
//           <div>
//             <div>
//               <h4>تعديل على المهمة</h4>
//               <button
//                 type="button"
//                 className="close"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onClose();
//                 }}
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="modal-body">
//               <input
//                 type="text"
//                 className="form-control"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             <div>
//               <button
//                 type="button"
//                 className="btn btn-warning"
//                 // onClick={openEditConfirmation}
//               >
//                 تعديل
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-danger"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setDescription(todo.description);
//                   onClose();
//                 }}
//               >
//                 إغلاق
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// }

// export default EditTodo;
