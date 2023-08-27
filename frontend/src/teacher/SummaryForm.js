import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import "../css/UserProfile.css";
import jwt_decode from 'jwt-decode';



function SummaryForm() {
    const [summaryData, setSummaryData] = useState({
        summary_title: "",
        summary_image: "",
        summary_brief: "",
        summary_description: "",
        sell_or_free: "",
        summary_price: 0,
        summary_category: "",
        summary_university: "",
        summary_file: "",
        facebook_link: "",
        linkedin_link: "",
    });

    const [categories, setCategories] = useState([]);
    const [university, setUniversity] = useState([]);



    // Handle the add and change the PDF file of the summary
    const handleFilePDFChange = (event) => {
        setSummaryData({
            ...summaryData,
            summary_file: event.target.files[0],
        });
    };

    // Handle the add and change the image of the summary
    const handleFileimageChange = (event) => {
        setSummaryData({
            ...summaryData,
            summary_image: event.target.files[0],
        });
    };


    useEffect(() => {
        handleInputChange();
    }, []);



    // get universities
    useEffect(() => {
        axios.get("http://localhost:4000/universities").then((response) => {
            setUniversity(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);


// Handle the change of the inputs 
    const handleInputChange = (event) => {
        if (event && event.target) {
            const { name, value } = event.target;
            if (name && value) {
                setSummaryData({ ...summaryData, [name]: value });

                if (name === "summary_university") {
                    const universityId = value;
                    axios.get(`http://localhost:4000/universities/${universityId}/categories`).then((response) => {
                        setCategories(response.data);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }
        }
    };


    // Handle the submit of the add summary form
    const handleFormSubmitSummary = (event) => {
        event.preventDefault();

        const {
            summary_title,
            summary_image,
            summary_description,
            summary_brief,
            sell_or_free,
            summary_price,
            summary_category,
            summary_university,
            summary_file,
            facebook_link,
            linkedin_link
        } = summaryData;

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            const user_id = decodedToken.userId;

            if (summary_file && summary_image) {
                const formData = new FormData();
                formData.append('summary_title', summary_title);
                formData.append('summary_image', summary_image);
                formData.append('summary_description', summary_description);
                formData.append('summary_brief', summary_brief);
                formData.append('sell_or_free', sell_or_free);
                formData.append('summary_price', summary_price);
                formData.append('summary_category', summary_category);
                formData.append('summary_university', summary_university);
                formData.append('summary_file', summary_file);
                formData.append('facebook_link', facebook_link);
                formData.append('linkedin_link', linkedin_link);

                axios.post(`http://localhost:4000/submitSummaryForm/${user_id}`, formData).then((response) => {
                    console.log(response.data);
                    // Reset form fields
                    setSummaryData({
                        summary_title: "",
                        summary_image: "",
                        summary_brief: "",
                        summary_description: "",
                        sell_or_free: "",
                        summary_price: "",
                        summary_category: "",
                        summary_university: "",
                        summary_file: "",
                        facebook_link: "",
                        linkedin_link: "",
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'تم إرسال الدورة بنجاح!',
                        text: 'سيتم إرسال المُلخص إلى للمُشرف للمراجعة والموافقة عليه.',
                    });
                }).catch((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'حدث خطأ أثناء إرسال الدورة',
                        text: 'يرجى المحاولة مرة أخرى.',
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'يجب إدخال جميع الحقول',
                    text: 'يرجى ملء جميع الحقول المطلوبة.',
                });
            }
        }
    };

    
    const isRequiredField = (field) => {
        return (
            field === "summary_title" ||
            field === "summary_image" ||
            field === "summary_brief" ||
            field === "summary_description" ||
            field === "sell_or_free" ||
            field === "summary_category" ||
            field === "summary_university" ||
            field === "summary_file" ||
            field === "facebook_link" ||
            field === "linkedin_link"

        );
    };

    const isFilledField = (field) => {
        return summaryData[field] !== "";
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
                        <h2 className="title text-center">إضافة مُلخص</h2>
                    </div>
                    <div className="card-body">
                        <form
                            method="POST"
                            id="summaryForm"
                            encType="multipart/form-data"
                            onSubmit={handleFormSubmitSummary}>
                            {/* Summary Title */}
                            <div className={`form-group mt-3 ${getInputClass("summary_title")}`}>
                                <label className="control-label" htmlFor="summary_title">
                                    عنوان المُلخص
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="أدخل عنواناً مناسباً للمُلخص"
                                    name="summary_title"
                                    id="summary_title"
                                    value={summaryData.summary_title}
                                    onChange={handleInputChange}
                                  required   />
                            </div>

                            {/* Summary Image */}
                            <div className={`form-group mt-3 ${getInputClass("summary_image")}`}>
                                <label className="control-label" htmlFor="summary_image">
                                    صورة توصف المُلخص
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    name="summary_image"
                                    id="summary_image"
                                    accept="image/*"
                                    onChange={handleFileimageChange}
                                    required/>
                            </div>

                            {/* Summary Description */}
                            <div className={`form-group mt-3 ${getInputClass("summary_brief")}`}>
                                <label className="control-label" htmlFor="summary_brief">
                                    وصف المُلخص
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder="أدخل وصفاً للمُلخص"
                                    name="summary_brief"
                                    id="summary_brief"
                                    value={summaryData.summary_brief}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            {/* Summary Details */}
                            <div className={`form-group mt-3 ${getInputClass("summary_description")}`}>
                                <label className="control-label" htmlFor="summary_description">
                                    تفاصيل عن المُلخص
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder="أدخل تفُاصيل الملخص"
                                    name="summary_description"
                                    id="summary_description"
                                    value={summaryData.summary_description}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            {/* Sell or Free */}
                            <div className={`form-group mt-3 ${getInputClass("sell_or_free")}`}>
                                <label className="control-label" htmlFor="summary_sell">
                                    السعر:
                                </label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="sell_or_free"
                                        id="summary_sell_free"
                                        value="free"
                                        checked={summaryData.sell_or_free === 'free'}
                                        onChange={handleInputChange}
                                        required />
                                    <label className="form-check-label" htmlFor="summary_sell_free">
                                        مجاني
                                    </label>
                                </div>
                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="sell_or_free"
                                        id="summary_sell_paid"
                                        value="paid"
                                        checked={summaryData.sell_or_free === 'paid'}
                                        onChange={handleInputChange}/>
                                    <label className="form-check-label" htmlFor="summary_sell_paid">
                                        مدفوع
                                    </label>
                                </div>
                            </div>

                            {/* Summary Price */}
                            <div className={`form-group mt-3 ${getInputClass("summary_price")}`}>
                                <label className="control-label" htmlFor="summary_price">
                                    أدخل السعر:
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="أدخل السعر"
                                    name="summary_price"
                                    id="summary_price"
                                    value={summaryData.summary_price}
                                    onChange={handleInputChange}
                                    disabled={summaryData.sell_or_free==="free"} />
                            </div>


                            {/* course University */}
                            <div className={`form-group mt-3 ${getInputClass("summary_university")}`}>
                                <label className="control-label" htmlFor="summary_university">
                                    الجامعة
                                </label>
                                <select
                                    className="form-control"
                                    name="summary_university"
                                    id="summary_university"
                                    value={summaryData.summary_university}
                                    onChange={(e) => handleInputChange(e)}
                                    required>
                                    <option value="">اختر الجامعة</option>
                                    {university.map((university) => (
                                        <option key={university.university_id} value={university.university_id}>
                                            {university.university_name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* course Category */}
                            <div className={`form-group mt-3 ${getInputClass("summary_category")}`}>
                                <label className="control-label" htmlFor="summary_category">
                                    التخصص
                                </label>
                                <select
                                    className="form-control"
                                    name="summary_category"
                                    id="summary_category"
                                    value={summaryData.summary_category}
                                    onChange={handleInputChange}
                                    disabled={!summaryData.summary_university}
                                    required>
                                    <option value="">اختر التخصص</option>
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            {/* Summary File */}
                            <div className={`form-group mt-3 ${getInputClass("summary_file")}`}>
                                <label className="control-label" htmlFor="summary_file">
                                    حمّل ملف PDF
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    name="summary_file"
                                    id="summary_file"
                                    accept=".pdf"
                                    onChange={handleFilePDFChange}
                                    required/>
                            </div>


                            {/* Facebook Link */}
                            <div className={`form-group mt-3 ${getInputClass("facebook_link")}`}>
                                <label className="control-label" htmlFor="summary_facebook">
                                    رابط الفيسبوك
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="أدخل رابط الفيسبوك الخاص بك"
                                    name="facebook_link"
                                    id="summary_facebook"
                                    value={summaryData.facebook_link}
                                    onChange={handleInputChange}
                                    required/>
                            </div>

                            {/* LinkedIn Link */}
                            <div className={`form-group mt-3 ${getInputClass("linkedin_link")}`}>
                                <label className="control-label" htmlFor="summary_linkedin">
                                    رابط LinkedIn
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder=" أدخل رابط حسابك على لينكد إن"
                                    name="linkedin_link"
                                    id="summary_linkedin"
                                    value={summaryData.linkedin_link}
                                    onChange={handleInputChange}
                                    required/>
                            </div>


                            {/* Submit Button */}
                            <div className="d-flex justify-content-center mt-3">
                                <button
                                    className="mb-2 mt-2 AddCourseSummary btn-primary btn-block mt-2"
                                    id="addSummaryButton"
                                    type="submit">
                                    إضافة الملخص
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryForm;