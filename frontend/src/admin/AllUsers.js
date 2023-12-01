import React, {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/style.css";


function UserForm() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [userNameFilter, setUserNameFilter] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delay);
    }, [userNameFilter, userRoleFilter]);


    // get all the registered users in the website
    async function fetchUsers() {
        try {
            const response = await axios.get(`http://localhost:4000/usersRegistered?userName=${userNameFilter}&userRole=${userRoleFilter}`);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    // delete the user from the website "soft delete"
    async function deleteUser(user_id) {
        try {
            const result = await Swal.fire({
                icon: "warning",
                title: "هل أنت متأكد؟",
                text: "سيتم الأن حذف المُستخدم !",
                confirmButtonText: "نعم، احذفه!",
                cancelButtonText: "لا",
                showCancelButton: true,
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                await axios.put(`http://localhost:4000/usersRegistered/${user_id}`, {is_deleted: true});
                setUsers(users.filter((user) => user.user_id !== user_id));
                Swal.fire({
                    icon: "success",
                    title: "تم الحذف",
                    text: "تم حذف المُستخدم بنجاح!",
                    confirmButtonText: "موافق",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }


    // Update user role
    async function updateUserRole(userId, newRole) {
        const result = await Swal.fire({
            icon: "warning",
            title: "هل أنت متأكد؟",
            text: "هل ترغب في تحديث دور المستخدم؟",
            confirmButtonText: "نعم، قم بالتحديث!",
            cancelButtonText: "لا",
            showCancelButton: true,
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:4000/usersRegistered/updateUserRole/${userId}`, {newRole});
                Swal.fire({
                    icon: 'success',
                    title: 'تم التحديث',
                    text: 'تم تحديث دور المستخدم بنجاح!',
                    confirmButtonText: 'موافق',
                });
                fetchUsers();
            } catch (error) {
                console.log(error);
            }
        }
    }


    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);


    // TO loop on the courses and number of pages
    const totalPages = Math.ceil(users.length / usersPerPage);
    const pageNumbers = [];
    for (let r = 1; r <= totalPages; r++) {
        pageNumbers.push(r);
    }


    // Change page
    function paginate(pageNumber) {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="container-fluid">
            <div className="text-center mt-5">
                <div className="row justify-content-center">
                    <div className="form-group d-flex justify-content-around mb-4 gap-4">
                        <input
                            type="text"
                            placeholder="البحث بالإسم"
                            className="form-control"
                            value={userNameFilter}
                            onChange={(e) => setUserNameFilter(e.target.value)}
                        />

                        <select
                            className="form-control"
                            value={userRoleFilter}
                            onChange={(e) => setUserRoleFilter(e.target.value)}
                        >
                            <option value="">البحث بدّور المستخدم</option>
                            <option value="admin">أدمن</option>
                            <option value="student">طالب</option>
                            <option value="teacher">مُعلم</option>
                        </select>

                    </div>

                    <div className="col-12 col-md-10 col-lg-12">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>الإسم</th>
                                    <th>دور المستخدم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>رقم الهاتف</th>
                                    <th>حذف المستخدم</th>
                                    <th>تغيير الدور</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.user_id} className="user-row">

                                        <td>{user.name}</td>
                                        <td>{user.role === "admin" ? "أدمن" : user.role === "student" ? "طالب" : user.role === "teacher" ? "معلم" : null}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td className="text-center">
                                            <button className="UserRegisteredButton"
                                                    onClick={() => deleteUser(user.user_id)}>
                                                <svg viewBox="0 0 448 512" className="svgIcon">
                                                    <path
                                                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                </svg>
                                            </button>
                                        </td>
                                        <td>
                                            <select className="text-center"
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.user_id, e.target.value)}>
                                                <option>إختر الدور</option>
                                                <option value="1">أدمن</option>
                                                <option value="2">طالب</option>
                                                <option value="3">مُعلم</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.length > usersPerPage && (
                            <div className="d-flex justify-content-center">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination">
                                        {pageNumbers.map((pageNumber) => (
                                            <li key={pageNumber}
                                                className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => paginate(pageNumber)}>
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserForm;