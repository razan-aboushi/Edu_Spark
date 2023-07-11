// import React, { Fragment, useState } from "react";
// import axios from "axios";
// import { useParams } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';



// function InputTodo () 
// {
//   const [description, setDescription] = useState("");

//   const token = localStorage.getItem('token');
//   const decodedToken = token ? jwt_decode(token) : null;
//   const loggedInUserId = decodedToken?.userId;

//   const onSubmitForm = async (e) => {
//     e.preventDefault();
//     if (!description || !loggedInUserId) {
//       return;
//     }
//     try {
//       const body ={ description, user_id: loggedInUserId };
//       await axios.post("http://localhost:4000/todos", body, {
//         headers: { "Content-Type": "application/json" },
//       });
//       setDescription("");
//     } catch (err) {
//       console.error(err.message);
//     }
//   };




//   return (
//     <Fragment>
//       <div className="text-center wow fadeInUp mt-5" data-wow-delay="0.1s">
//         <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
//           قائمة المهام
//         </h6>
//       </div>
//       <div className="d-flex justify-content-center mt-5">
//         <form className="w-75" onSubmit={onSubmitForm}>
//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="أضف مهمة جديدة..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <button className="btn-success p-3" type="submit">
//               إضافة
//             </button>
//           </div>
//         </form>
//       </div>
//     </Fragment>
//   );
// }

// export default InputTodo;
