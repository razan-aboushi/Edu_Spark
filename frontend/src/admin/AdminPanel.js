import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../css/style.css";

function AdminPanel() {
    const [mission, setMission] = useState('');
    const [missionTitle, setMissionTitle] = useState('');
    const [vision, setVision] = useState('');
    const [visionTitle, setVisionTitle] = useState('');
    const [aboutUsTitle, setAboutUsTitle] = useState('');
    const [aboutParagraph1, setAboutParagraph1] = useState('');
    const [aboutParagraph2, setAboutParagraph2] = useState('');
    const [activeTab, setActiveTab] = useState('visionMission');


    useEffect(() => {
        fetchData();
    }, []);

    // Get the data from the about us table
    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:4000/about_missionVisionData');
            const data = response.data[0];
            setMission(data.mission);
            setMissionTitle(data.mission_title);
            setVision(data.vision);
            setVisionTitle(data.vision_title);
            setAboutUsTitle(data.aboutus_title);
            setAboutParagraph1(data.aboutpargraph1);
            setAboutParagraph2(data.aboutpargraph2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    // Handle update the vision and mission
    async function handleVisionMissionSave(e) {
        e.preventDefault();

        try {
            await axios.put('http://localhost:4000/save_vision_mission', {
                vision: vision,
                vision_title: visionTitle,
                mission: mission,
                mission_title: missionTitle
            });

            Swal.fire({
                icon: 'success',
                title: 'تم التحديث',
                text: 'تم حفظ التغييرات بنجاح!',
                confirmButtonText: 'موافق',
            });
        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء حفظ التغييرات',
                confirmButtonText: 'موافق',
            });
        }
    }


    // Handle update the about us
    async function handleAboutUsSave(e) {
        e.preventDefault();
        try {
            await axios.put('http://localhost:4000/Editabout_us', {
                aboutus_title: aboutUsTitle,
                aboutpargraph1: aboutParagraph1,
                aboutpargraph2: aboutParagraph2
            });
            // Show success message using SweetAlert
            Swal.fire('نجاح', 'تم حفظ بيانات "من نحن" بنجاح!', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            // Show error message using SweetAlert
            Swal.fire('خطأ', 'فشل في حفظ بيانات "من نحن"!', 'error');
        }
    }

    function updateVisionTitle(visionTitle) {
        setVisionTitle(visionTitle);
    }

    function updateVisionContent(vision) {
        setVision(vision);
    }

    function updateMissionTitle(missionTitle) {
        setMissionTitle(missionTitle);
    }

    function updateMissionContent(mission) {
        setMission(mission);
    }

    function updateAboutUsTitle(aboutUsTitle) {
        setAboutUsTitle(aboutUsTitle);
    }

    function updateAboutUsParagraph1(aboutParagraph1) {
        setAboutParagraph1(aboutParagraph1);
    }


    function updateAboutUsParagraph2(aboutParagraph2) {
        setAboutParagraph2(aboutParagraph2);
    }



    // Handle update tab of two forms
    function navigateTabs(tab) {
        setActiveTab(tab);
    }


    return (
        <div className="containerDashPanel mt-5">
            <h1 className="adminPanelTitle">لوحة التحكم الإدارية</h1>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link
                        className={`nav-link ${activeTab === 'visionMission' ? 'active' : ''}`}
                        to="#"
                        onClick={() => navigateTabs('visionMission')}
                    >
                        تعديل الرؤية والرسالة
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link ${activeTab === 'aboutUs' ? 'active' : ''}`}
                        to="#"
                        onClick={() => navigateTabs('aboutUs')}>
                        تعديل من نحن
                    </Link>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'visionMission' ? 'show active' : ''}`}>
                    <form className="formAdminPanel" onSubmit={handleVisionMissionSave}>
                        <h2>تعديل الرؤية</h2>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formVisionTitle">عنوان الرؤية</label>
                            <input
                                type="text"
                                className="form-controlDashboardPanel"
                                id="formVisionTitle"
                                value={visionTitle}
                                onChange={(e) => updateVisionTitle(e.target.value)}/>
                        </div>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formVisionContent">محتوى الرؤية</label>
                            <textarea
                                className="form-controlDashboardPanel"
                                id="formVisionContent"
                                rows="3"
                                onChange={(e) => updateVisionContent(e.target.value)}
                                value={vision} ></textarea>
                        </div>

                        <h2>تعديل الرسالة</h2>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formMissionTitle">عنوان الرسالة</label>
                            <input
                                type="text"
                                className="form-controlDashboardPanel"
                                id="formMissionTitle"
                                value={missionTitle}
                                onChange={(e) => updateMissionTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formMissionContent">محتوى الرسالة</label>
                            <textarea
                                className="form-controlDashboardPanel"
                                id="formMissionContent"
                                rows="3"
                                onChange={(e) => updateMissionContent(e.target.value)}
                                value={mission}>

                            </textarea>
                        </div>

                        <button className="ButtonDashBordPanel btn-primary buttonSaveDash" type="submit">
                            حفظ
                        </button>
                    </form>
                </div>

                <div className={`tab-pane fade ${activeTab === 'aboutUs' ? 'show active' : ''}`}>
                    <form className="formAdminPanel" onSubmit={handleAboutUsSave}>
                        <h2>من نحن</h2>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formAboutUsTitle">عنوان من نحن</label>
                            <input
                                type="text"
                                className="form-controlDashboardPanel"
                                id="formAboutUsTitle"
                                value={aboutUsTitle}
                                onChange={(e) => updateAboutUsTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formAboutUsContent"> الفقرة الأولى </label>
                            <textarea
                                className="form-controlDashboardPanel"
                                id="formAboutUsContent"
                                rows="3"
                                onChange={(e) => updateAboutUsParagraph1(e.target.value)}
                                value={aboutParagraph1}
                            ></textarea>
                        </div>
                        <div className="form-groupPanelDash">
                            <label htmlFor="formAboutUsContent">الفقرة الثانية </label>
                            <textarea
                                className="form-controlDashboardPanel"
                                id="formAboutUsContent1"
                                rows="3"
                                onChange={(e) => updateAboutUsParagraph2(e.target.value)}
                                value={aboutParagraph2}
                            ></textarea>
                        </div>

                        <button className="ButtonDashBordPanel btn-primary buttonSaveDash" type="submit">
                            حفظ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;