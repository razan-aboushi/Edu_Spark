import React, { useState } from "react";
import "../css/UserProfile.css";
import SummaryForm from "./SummaryForm";
import CourseForm from "./CourseForm";

function CourseSummaryForm() {
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [showAddSummaryForm, setShowAddSummaryForm] = useState(false);

    const handleButtonClick = (formType) => {
        if (formType === "AddCourse") {
            setShowAddCourseForm(true);
            setShowAddSummaryForm(false);
        } else if (formType === "AddSummary") {
            setShowAddCourseForm(false);
            setShowAddSummaryForm(true);
        } else {
            setShowAddCourseForm(false);
            setShowAddSummaryForm(false);
        }

    }


    return (
        <div>
            {/* Add summary or course buttons section */}
            <section className="text-center" id="AddCourseOrSummary">
                <div>
                    <h6 className="section-title bg-white text-center text-primary px-3 mt-5 mb-5">
                        أضف مُلخص أو دورة "مادة"
                    </h6>
                </div>
                <div className="d-flex justify-content-center mb-3">
                    <button id="add-course-btn" className="btn btn-primary btn-lg mx-2" onClick={() => handleButtonClick("AddCourse")}>
                        إضافة دورة
                    </button>
                    <button id="add-summary-btn" className="btn btn-primary btn-lg mx-2" onClick={() => handleButtonClick('AddSummary')}>
                        إضافة مُلخص
                    </button>
                </div>
            </section>
            {/* End Add summary or course buttons section */}




            {/* Start add summary form */}
            <section id="AddSummary" className={showAddSummaryForm ? "visible" : "hidden"}>
                <SummaryForm />
            </section>
            {/* End add summary form */}


            {/* Start add course form */}
            <section id="AddCourse" className={showAddCourseForm ? "visible" : "hidden"}>
                <CourseForm />
            </section >
            {/* End add course section */}



        </div >
    );
}

export default CourseSummaryForm;