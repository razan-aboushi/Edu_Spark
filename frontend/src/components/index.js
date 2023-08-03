import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HashLink } from "react-router-hash-link";
import "../css/style.css";
import "../css/bootstrap.min.css";
import about from "../img/about.jpg";
import slider2 from "../img/carousel-2.jpg";
import homeSlider from "../img/homeSlider.jpg";
import vedio1 from "../img/v1.jpg";
import vedio2 from "../img/v2.jpg";
import vedio3 from "../img/v3.png";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ArticlesHome from './ArticlesHome';
import UniversityHome from './UniversityHome';
import SummariesHome from './SummariesHome';
import CoursesHome from './CoursesHome';
import Swal from 'sweetalert2';

function Index() {

  const [aboutUsData, setAboutUsData] = useState({});

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      Swal.fire({
        title: '<img src="https://static.hellooha.com/uploads/thumbs/articles/original/naiioloaplm32_article.jpg" style="width: 100%; margin-bottom: 10px;" alt="Image" /> <br> إيديو سبارك يتمنى لك يوماً جميلاً',
        html: 'أهلاً بك في بيتك الثاني ... دُمتَ شرارةً و شغفاً للتعلم <i class="fas fa-heart"></i>',
        color: '#06BBCC',
        timer: 6000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      sessionStorage.setItem('hasVisited', true);
    }
  }, []);


  useEffect(() => {
    const getAboutUsData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/aboutUsGet');
        setAboutUsData(response.data);

      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getAboutUsData();
  }, []);




  return (
    <>
      <div dir="ltr">
        <div className="container-fluid p-0" style={{ overflow: "hidden", textAlign: "right" }}>
          <OwlCarousel className="owl-theme" items={1} loop nav autoplay autoplayTimeout={7000}>
            <div className="item">
              <div className="header-carousel position-relative">
                <img
                  className="img-fluid"
                  src={homeSlider}
                  alt="slider of the home page"
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end"
                  style={{ background: "rgba(24, 29, 56, .7)" }}
                >
                  <div className="container">
                    <div className="row justify-content-end">
                      <div className="col-sm-10 col-lg-8">
                        <h5 className="text-primary text-uppercase mb-3 animated slideInDown">
                          أفضل ملخصات الجامعات
                        </h5>
                        <h1 className="display-3 text-white animated slideInDown">
                          علامتك الكاملة علينا
                        </h1>
                        <p className="fs-5 text-white mb-4 pb-2" style={{ fontSize: "1.6rem" }}>
                          احصل على ملخصات مواد الجامعة الخاصة بك للحصول على درجات عالية
                        </p>
                        <div className="d-flex justify-content-end">
                          <Link to="/Summaries">
                            <button className="btn-primary rounded-pill px-5 py-3 mt-3 animated slideInUp">
                              المُلخصات
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="item">
              <div className="header-carousel position-relative">
                <img
                  className="img-fluid"
                  src={slider2}
                  alt="صورة"
                  style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end"
                  style={{ background: "rgba(24, 29, 56, .7)" }}
                >
                  <div className="container">
                    <div className="row justify-content-end">
                      <div className="col-sm-10 col-lg-8">
                        <h5 className="text-primary text-uppercase mb-3 animated slideInDown">
                          أفضل مراجعات عبر الإنترنت
                        </h5>
                        <h1 className="display-3 text-white animated slideInDown">
                          تعلم دوراتك عبر الإنترنت من منزلك
                        </h1>
                        <p className="fs-5 text-white mb-4 pb-2" style={{ fontSize: "1.6rem" }}>
                          أفضل طريقة للتعلم هي تعليم الآخرين بما تعلمته
                        </p>
                        <div className="d-flex justify-content-end">
                          <Link to={"/Courses"}>
                            <button className="btn-primary rounded-pill px-5 py-3 mt-3 animated slideInUp">
                              الدورات
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </div>


      {/* Features Start */}
      <div className="container-xxl py-5 mt-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3 mb-5">
            المميزات
          </h6>
        </div>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x bi bi-book text-primary mb-4" />
                  <h5 className="mb-3">الكورسات و المُلخصات</h5>
                  <p>
                    مُلخصات سلسة ومنظمة لموادك الجامعية.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-globe text-primary mb-4" />
                  <h5 className="mb-3">مراجعات عبر الإنترنت</h5>
                  <p>
                    يقوم زملائك في الجامعة بتقديم مراجعات للمواد المختلفة
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-home text-primary mb-4" />
                  <h5 className="mb-3">المقالات</h5>
                  <p>
                    أنها تحتوي على مواضيع مختلفة تهم الطلاب في
                    الجوانب العلمية والعملية
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-book-open text-primary mb-4" />
                  <h5 className="mb-3">المواد الجامعية</h5>
                  <p>إشتري المُلخصات و الكتب الجامعية بأسعار مميزة عبر الإنترنت</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features End */}



      {/* About us Start */}
      <div className="container-xxl py-5" style={{ marginTop: "55px" }}>
        <div className="container">
          <div className="row g-5">
            <div
              className="col-lg-6 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ minHeight: 400 }}
            >
              <div className="position-relative h-100">
                <img
                  className="img-fluid position-absolute w-100 h-100"
                  src={about}
                  alt="about us"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h1 className="mb-4 mt-3" >  {aboutUsData.aboutus_title}</h1>
              <p className="mb-4">
                {aboutUsData.aboutpargraph1}
              </p>
              <p className="mb-4">
                {aboutUsData.aboutpargraph2}

              </p>
              <HashLink className="py-2 px-3 mt-2" to={"/about/#"}>
                <button className="learn-more">
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow" />
                  </span>
                  <span className="button-readMoreAbout me-2">إقرأ المزيد</span>
                </button>
              </HashLink>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}




      {/* قسم الملخصات */}
      <SummariesHome />
      {/* انتهى قسم الملخصات */}



      {/* قسم الدورات الدراسية يبدأ */}
      <CoursesHome />
      {/* قسم الدورات الدراسية ينتهي */}


      <div dir="rtl" style={{ marginTop: "110px", textAlign: "center" }}>
        <section className="card123">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3 mb-5">
              انضم إلى الحصص التفاعلية عبر الإنترنت
            </h6>
          </div>
          <div className="container d-flex align-items-center justify-content-center position-relative flex-wrap">
            <div className="card d-flex position-relative flex-column">
              <div className="imgContainer">
                <img src={vedio1} alt="صورة الفيديو 1" />
              </div>
              <div className="content">
                <h4>وفّر المال</h4>
                <p>
                  يمكنك شرح المواد عبر الإنترنت بدلاً من استئجار غرفة لهذا الغرض.
                </p>
              </div>
            </div>
            <div className="card d-flex position-relative flex-column">
              <div className="imgContainer">
                <img src={vedio2} alt="صورة الفيديو 2" />
              </div>
              <div className="content">
                <h4>محاضرة جماعية</h4>
                <p>يمكن أن يكون الشرح لمجموعة من الطلاب معًا.</p>
              </div>
            </div>
            <div className="card d-flex position-relative flex-column">
              <div className="imgContainer">
                <img src={vedio3} alt="صورة الفيديو 3" />
              </div>
              <div className="content">
                <h4>شرح فردي</h4>
                <p>
                  يمكن إجراء الشرح فرديًا للطالب بعد الاتفاق بينهما.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* نهاية الكارت للفيديو المباشر */}




        {/* University section */}
        <UniversityHome />
        {/* End of university section */}
      </div>




      {/* ======= قسم الأسئلة المتكررة ======= */}
      < section id="faq" className="faq" style={{ marginTop: "110px" }}>
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            <div className="col-lg-8 order-lg-1 order-2">
              <div
                className="accordion accordion-flush"
                id="faqlist"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-content-1"
                    >
                      <span className="num">1.</span>
                      كيف يمكنني الدفع لشراء الملخصات والكتب ؟
                    </button>
                  </h3>
                  <div
                    id="faq-content-1"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqlist"
                  >
                    <div className="accordion-body mt-2">
                      يمكنك الدفع للمواد والملخصات من خلال صفحة الدفع على الموقع عند النقر على المادة المطلوبة.
                    </div>
                  </div>
                </div>
                {/* # بند الأسئلة المتكررة */}
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-content-2"
                    >
                      <span className="num">2.</span>
                      ما هو موقع EduSpark ؟
                    </button>
                  </h3>
                  <div
                    id="faq-content-2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqlist"
                  >
                    <div className="accordion-body mt-2">
                      إنه منصة تعليمية توفر شروحات لطلاب الجامعة في مراحل مختلفة، وتقدمها الطالب كمعلم للمتعلم، من خلال تقديم وشرح الملخصات. وتوفر مواد لجامعات مختلفة في أكثر من فئة واحدة.
                    </div>
                  </div>
                </div>
                {/* # بند الأسئلة المتكررة */}
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-content-3"
                    >
                      <span className="num">3.</span>
                      هل يمكنني إضافة ملخص أو كتاب للبيع؟ هل هناك رسوم لذلك ؟
                    </button>
                  </h3>
                  <div
                    id="faq-content-3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqlist"
                  >
                    <div className="accordion-body mt-2">
                      نعم، يمكنك إضافة ملخصات أو مواد للبيع أو مجانًا على الموقع، بالإضافة إلى القدرة على إضافة أسئلة ومصارف اختبار للعديد من المواد. وسيتم خصم نسبة من المال كرسوم عند البيع عبر الموقع.
                    </div>
                  </div>
                </div>
                {/* # بند الأسئلة المتكررة */}
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-content-4"
                    >
                      <span className="num">4.</span>
                      كيف يمكنني التسجيل كمعلم أو موضح على الموقع ؟
                    </button>
                  </h3>
                  <div
                    id="faq-content-4"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqlist"
                  >
                    <div className="accordion-body mt-2">
                      يمكنك فتح حساب كمعلم أو موضح عند التسجيل على الموقع.
                    </div>
                  </div>
                </div>
                {/* # بند الأسئلة المتكررة */}
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-content-5"
                    >
                      <span className="num">5.</span>
                      ما هي الطرق المعتمدة للتواصل مع الموضحين ؟
                    </button>
                  </h3>
                  <div
                    id="faq-content-5"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqlist"
                  >
                    <div className="accordion-body mt-2">
                      في الصفحة الشخصية لكل موضح، ستجد معلومات الاتصال، بما في ذلك البريد الإلكتروني ورقم الهاتف، يمكنك التواصل معه من خلالهما.
                    </div>
                  </div>
                </div>
                {/* # بند الأسئلة المتكررة */}
              </div>
            </div>
            <div className="col-lg-4 order-lg-2 order-1 ">
              <div className="content px-xl-5">
                <h3>
                  الأسئلة المتكررة <strong>الشائعة</strong>
                </h3>
                <p>
                  هل لديك سؤال في ذهنك؟ هنا يمكنك العثور على أجوبة لأسئلتك المختلفة ، إذا كنت ترغب في رؤية المزيد من  <HashLink to="/faq/#">الأسئلة الشائعة</HashLink>، وإذا واجهت أي ابتعاد، نحن هنا من أجلك.
                  <br />
                  <HashLink
                    to={"/contact/#"}
                    style={{ color: "blue", fontWeight: "bold" }}>
                    تواصل معنا الآن
                  </HashLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >
      {/* نهاية قسم الأسئلة المتكررة */}



      {/* Some articles */}
      <section className="ftco-section mb-5" dir="ltr" style={{ marginTop: "110px" }}>
        <ArticlesHome />
      </section>
      {/* End articles section */}

    </>

  )
}

export default Index;