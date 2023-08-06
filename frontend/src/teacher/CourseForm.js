import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import "../css/UserProfile.css";
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';

function CourseForm() {
    const [categories, setCategories] = useState([]);
    const [universities, setUniversities] = useState([]);
    const { universityId } = useParams();


    const [courseData, setCourseData] = useState({
        course_title: "",
        course_image: "",
        course_brief: "",
        course_description: "",
        connection_channel: "",
        course_type: "",
        sell_or_free: "",
        course_price: 0,
        course_duration: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        course_category: "",
        course_university: "",
        facebook_link: "",
        linkedin_link: ""
    });




    useEffect(() => {
        handleInputChange();
    }, [universityId]);


    // get universities
    useEffect(() => {
        axios.get("http://localhost:4000/universities").then((response) => {
            setUniversities(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);



    const handleInputChange = (event = {}) => {
        const { name, value } = event.target || {};
        setCourseData({ ...courseData, [name]: value });

        // get the categories based on selected university to render them in dropdown list
        if (name === "course_university") {
            const universityId = value;
            axios.get(`http://localhost:4000/universities/${universityId}/categories`).then((response) => {
                console.log(response)
                setCategories(response.data);
            }).catch((error) => {
                console.error(error);
            });
        }
    };


    const handleFileChangeCourseImage = (event) => {
        const file = event.target.files[0];
        setCourseData({ ...courseData, course_image: file });
    };



    // submit the course form to add a new course
    const handleSubmitCourseForm = (event) => {
        event.preventDefault();


        const formData = new FormData();

        for (const [key, value] of Object.entries(courseData)) {
            formData.append(key, value);
        }

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            const user_id = decodedToken.userId;
            console.log(user_id)

            axios.post(`http://localhost:4000/addCourseForm/${user_id}`, formData).then((response) => {
                console.log(response.data);
                setCourseData({
                    course_title: "",
                    course_image: "",
                    course_brief: "",
                    course_description: "",
                    connection_channel: "",
                    course_type: "",
                    sell_or_free: "",
                    course_price: "",
                    course_duration: "",
                    start_date: "",
                    end_date: "",
                    start_time: "",
                    end_time: "",
                    course_category: "",
                    course_university: "",
                    facebook_link: "",
                    linkedin_link: ""

                });
                Swal.fire({
                    title: "تم إضافة الدورة بنجاح!",
                    text: " سيتم إرسال الدورة للمشرف للمراجعة والموافقة عليها ، شكراً لك",
                    icon: "success",
                    button: "حسناً",
                });
            }).catch((error) => {
                    console.log(error);
                    Swal.fire({
                        title: "حدث خطأ!",
                        text: "حدث خطأ أثناء إضافة الدورة. يرجى المحاولة مرة أخرى.",
                        icon: "error",
                        button: "حسناً",
                    });
                });
        } else {
            Swal.fire({
                title: "خطأ في المصادقة!",
                text: "يجب تسجيل الدخول لإضافة دورة.",
                icon: "error",
                button: "حسناً",
            });
        }
    };



    // Mark the inputs as required
    const isRequiredField = (field) => {
        return (
            field === "course_title" ||
            field === "course_image" ||
            field === "course_brief" ||
            field === "course_description" ||
            field === "sell_or_free" ||
            field === "course_file" ||
            field === "connection_channel" ||
            field === "course_type" ||
            field === "sell_or_free" ||
            field === "start_date" ||
            field === "end_date" ||
            field === "start_time" ||
            field === "end_time" ||
            field === "course_duration" ||
            field === "course_category" ||
            field === "course_university" ||
            field === "facebook_link" ||
            field === "linkedin_link"

        );
    };

    const isFilledField = (field) => {
        return courseData[field] !== "";
    };


    const getInputClass = (field) => {
        if (isRequiredField(field) && !isFilledField(field)) {
            return "required-input";
        } else if (isFilledField(field)) {
            return "filled-input";
        }
        return "";
    };




    return (
        <div className="page-wrapper p-t-100 p-b-50">
            <div className="container">
                <div className="cardCourse card-6">
                    <div className="card-heading">
                        <h2 className="title text-center">إضافة دورة "محاضرة مباشرة"</h2>
                    </div>
                    <div className="card-body">
                        <form id="courseForm" onSubmit={handleSubmitCourseForm}>
                            <div className={`form-group mt-3 ${getInputClass("course_title")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_title">عنوان الدورة:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="أدخل عنواناً مناسباً للدورة التي ستقدمها"
                                    name="course_title"
                                    id="course_title"
                                    value={courseData.course_title}
                                    onChange={handleInputChange}
                                    required/>
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("course_image")}`}>
                                <label htmlFor="course_image">صورة تعبّر عن الدورة المقدمة :</label>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="course_image"
                                        id="course_image"
                                        onChange={handleFileChangeCourseImage}
                                        required />
                                </div>
                                <small className="form-text text-muted">
                                    رفع صورة الدورة. الحجم الأقصى للملف هو 50 ميغابايت.
                                </small>
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("course_brief")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_brief">وصف موجز:</label>
                                <textarea
                                    className="form-control"
                                    name="course_brief"
                                    id="course_brief"
                                    rows={4}
                                    placeholder="وصف الدورة"
                                    value={courseData.course_brief}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("course_description")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_description">تفاصيل الدورة:</label>
                                <textarea
                                    className="form-control"
                                    name="course_description"
                                    id="course_description"
                                    rows={6}
                                    placeholder="تفاصيل الدورة"
                                    value={courseData.course_description}
                                    onChange={handleInputChange}
                                    required/>
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("connection_channel")}`}>
                                <label className="mb-2 mt-2" htmlFor="connection_channel">قناة الاتصال:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="اكتب قناة الاتصال المستخدمة في الدورة (مثال: Goole Meet, Microsoft Teams ,Zoom)"
                                    name="connection_channel"
                                    id="connection_channel"
                                    value={courseData.connection_channel}
                                    onChange={handleInputChange}
                                    required/>
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("course_type")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_type">نوع الدورة:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="اكتب نوع الدورة (مثال: تدريب، ورشة عمل ، شرح لمادة معينة)"
                                    name="course_type"
                                    id="course_type"
                                    value={courseData.course_type}
                                    onChange={handleInputChange}
                                    required/>
                            </div>

                            {/* Sell or Free */}
                            <div className={`form-group mt-3 ${getInputClass("sell_or_free")}`}>
                                <label className="control-label" htmlFor="course_sell">
                                    السعر:
                                </label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="sell_or_free"
                                        id="course_sell_free"
                                        value="free"
                                        checked={courseData.sell_or_free === 'free'}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="course_sell_free">
                                        مجاني
                                    </label>
                                </div>
                                <div className="form-check  mt-3" >
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="sell_or_free"
                                        id="course_sell_paid"
                                        value="paid"
                                        checked={courseData.sell_or_free === 'paid'}
                                        onChange={handleInputChange}

                                    />
                                    <label className="form-check-label" htmlFor="course_sell_paid">
                                        مدفوع
                                    </label>
                                </div>
                            </div>

                            <div className={`form-group mt-3 ${getInputClass("course_price")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_price">سعر الدورة:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="اكتب سعر الدورة"
                                    name="course_price"
                                    id="course_price"
                                    value={courseData.course_price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={`form-group mt-3 ${getInputClass("course_duration")}`}>
                                <label className="mb-2 mt-2" htmlFor="course_duration">مدة الدورة:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="اكتب مدة الدورة (مثال: لمدة أسبوع أو 3 ساعات ...)"
                                    name="course_duration"
                                    id="course_duration"
                                    value={courseData.course_duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>


                            <div className={`form-group mt-3 mb-3 ${getInputClass("start_date")}`}>
                                <label className="mb-2 mt-2" htmlFor="">تحديد تاريخ بدء و إنتهاء الدورة :</label>
                                <div className="input-group">
                                    <span className="input-group-text">من</span>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="start_date"
                                        id="start_date"
                                        value={courseData.start_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="input-group-text">إلى</span>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="end_date"
                                        id="end_date"
                                        value={courseData.end_date}
                                        onChange={handleInputChange}
                                        required />
                                </div>
                            </div>


                            <div className={`form-group mt-3 mb-3 ${getInputClass("start_time")}`}>
                                <label className="mb-2 mt-2" htmlFor="">وقت بدء و نهاية الدورة :</label>
                                <div className="input-group">
                                    <span className="input-group-text">وقت البدء  </span>
                                    <input
                                        className="form-control"
                                        type="time"
                                        name="start_time"
                                        id="start_time"
                                        value={courseData.start_time}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="input-group-text">وقت الإنتهاء</span>
                                    <input
                                        className="form-control"
                                        type="time"
                                        name="end_time"
                                        id="end_time"
                                        value={courseData.end_time}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* course University */}
                            <div className={`form-group mt-3 mb-3 ${getInputClass("course_university")}`}>
                                <label className="control-label" htmlFor="course_university">
                                    الجامعة
                                </label>
                                <select
                                    className="form-control"
                                    name="course_university"
                                    id="course_university"
                                    value={courseData.course_university}
                                    onChange={(e) => handleInputChange(e)}>
                                    <option value="">اختر الجامعة</option>
                                    {universities.map((university) => (
                                        <option key={university.university_id} value={university.university_id}>
                                            {university.university_name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* course Category */}
                            <div className={`form-group mt-3 mb-3 ${getInputClass("course_category")}`}>
                                <label className="control-label" htmlFor="course_category">
                                    التخصص                                </label>
                                <select
                                    className="form-control"
                                    name="course_category"
                                    id="course_category"
                                    value={courseData.course_category}
                                    onChange={handleInputChange}
                                    disabled={!courseData.course_university}
                                >
                                    <option value="">اختر التخصص</option>
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>

                            </div>



                            <div className={`form-group mt-3 mb-3 ${getInputClass("facebook_link")}`}>
                                <label className="mb-2 mt-2" htmlFor="facebook_link">رابط الفيسبوك:</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    placeholder="اكتب رابط صفحة الفيسبوك "
                                    name="facebook_link"
                                    id="facebook_link"
                                    value={courseData.facebook_link}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            <div className={`form-group mt-3 mb-3 ${getInputClass("linkedin_link")}`}>
                                <label className="mb-2 mt-2" htmlFor="linkedin_link">رابط لينكد إن:</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    placeholder="اكتب رابط صفحة لينكد إن"
                                    name="linkedin_link"
                                    id="linkedin_link"
                                    value={courseData.linkedin_link}
                                    onChange={handleInputChange}
                                    required />
                            </div>


                            <div className="d-flex justify-content-center mt-3">
                                <button
                                    className="mb-2 mt-2 AddCourseSummary btn-primary btn-block mt-2"
                                    type="submit"
                                    id="AddCourseButton">
                                    إضافة الدورة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseForm;