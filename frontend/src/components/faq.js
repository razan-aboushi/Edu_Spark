import React from 'react';
import { Link } from 'react-router-dom';
import "../css/style.css";


function Faq() 
{
  return (
    <div>
      <main>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#06bbcc"
            fillOpacity={1}
            d="M0,192L20,165.3C40,139,80,85,120,69.3C160,53,200,75,240,117.3C280,160,320,224,360,213.3C400,203,440,117,480,85.3C520,53,560,75,600,90.7C640,107,680,117,720,154.7C760,192,800,256,840,282.7C880,309,920,299,960,293.3C1000,288,1040,288,1080,256C1120,224,1160,160,1200,160C1240,160,1280,224,1320,256C1360,288,1400,288,1420,288L1440,288L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
          ></path>
        </svg>


        {/* ======= Frequently Asked Questions page ======= */}
        <section id="faq" className="faq">
          <div className="container" data-aos="fade-up">
            <div className="row gy-4">
              <div className="col-lg-12 order-lg-1 order-2">
                <h2>
                  الأسئلة المتكررة <strong>FAQ</strong>
                </h2>
                <p>
                  هل لديك سؤال في ذهنك؟ هنا يمكنك العثور على الأسئلة المتكررة، وإذا واجهتك أي
                  ارتباك، نحن هنا من أجلك.
                  <br />
                  <Link
                    to={"/contact"}
                    style={{ color: "blue", fontWeight: "bold" }}>
                    اتصل بنا الآن!
                  </Link>
                </p>
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
                        data-bs-target="#faq-content-1">
                        <span className="num">1.</span>
                        كيف يمكنني الدفع لشراء الملخصات والكتب؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-1"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist">
                      <div className="accordion-body mt-4">
                        يمكنك الدفع للمواد والملخصات من خلال صفحة الدفع في الموقع عند النقر على المادة المطلوبة.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-2"
                      >
                        <span className="num">2.</span>
                        ما هو موقع إدوسبارك؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        إنه منصة تعليمية توفر شروحات لطلاب الجامعات من مراحل مختلفة، يقدمها الطالب بوصفه مدرسًا للمتعلم، من خلال تقديم وشرح ملخصاتهم. وتوفير مواد لجامعات مختلفة في أكثر من تخصص. إذا كنت ترغب في معرفة المزيد عنا، يمكنك زيارة صفحة <Link to="/about">من نحن</Link>.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-3"
                      >
                        <span className="num">3.</span>
                        هل يمكنني إضافة ملخص أو كتاب للبيع؟ هل هناك رسوم على ذلك؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-3"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        نعم، يمكنك إضافة ملخصات أو مواد للبيع أو مجانًا على الموقع، بالإضافة إلى القدرة على إضافة أسئلة ومصارف امتحانية للعديد من المواد. وسيتم خصم نسبة من المال كرسوم عند البيع عبر الموقع.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-4"
                      >
                        <span className="num">4.</span>
                        كيف يمكنني الحصول على دورة أو ملخص؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        يمكنك الحصول على دورة أو ملخص عبر الموقع. على سبيل المثال، يمكنك حجز دورة وحضورها في الوقت المحدد المشار إليه لكل دورة. ويمكنك الحصول على ملخص بعد الشراء وتنزيله بصيغة PDF، ويمكنك طباعته أيضًا.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-5"
                      >
                        <span className="num">5.</span>
                        ما هي الطرق المعتمدة للتواصل مع الشارحين؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-5"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        في الصفحة الشخصية لكل موضح، ستجد معلومات الاتصال بما في ذلك البريد الإلكتروني ورقم الهاتف، يمكنك التواصل معه من خلالهما.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}

                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-6"
                      >
                        <span className="num">6.</span>
                        هل يمكنني طباعة الملف بصيغة PDF؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-6"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        نعم ، يمكنك طباعة الملف بصيغة PDF ، ولكن بعد أن تدفع مقابل هذه الخدمة.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-7"
                      >
                        <span className="num">7.</span>
                        ما هي التصنيفات المتاحة في الموقع؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-7"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        هناك العديد من التصنيفات المتعلقة بالكليات في الجامعات المختلفة، يمكنك مشاهدتها من هنا <Link to="coursesCategories">تصنيفات رئيسية</Link>.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-8"
                      >
                        <span className="num">8.</span>
                        كيف يمكنني الوصول إلى الملخصات والدورات؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-8"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        يمكنك العثور عليها من شريط التنقل في الفئات، حيث يوجد العديد من الفئات.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-9"
                      >
                        <span className="num">9.</span>
                        هل جميع الدورات لها نفس وقت الشرح أم تختلف؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-9"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        تختلف الأوقات من دورة إلى أخرى حسب حجمها وحسب ما يحدده الشخص الذي يشرحها.
                      </div>
                    </div>
                  </div>
                  {/* # فقرة الأسئلة المتكررة */}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-10"
                      >
                        <span className="num">10.</span>
                        هل هناك شيء آخر يمكنني الاستفادة منه على الموقع؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-10"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        نعم يمكنك الاستفادة من العديد من الموضوعات الموجودة
                        المنشورة في المقالات ، ويمكنك كتابة المهام التي تريد القيام بها في قائمة المهام في ملف التعريف الخاص بك ، وتحديد ما تم إنجازه وسيتم إنجازه.
                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-11"
                      >
                        <span className="num">11.</span>
                        ما هي اللغات التي يتم تقديم الموقع بها ؟                      </button>
                    </h3>
                    <div
                      id="faq-content-11"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        يتم تقديم الموقع الأن باللغة العربية بسبب إستهدافه لهذه الفئة ، لكن سيتم دعم الموقع باللغة الإنجليزية و غيرها في المستقبل
                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-12"
                      >
                        <span className="num">12.</span>
                        هل يمكن لأي شخص أن يشرح ويعرض دورة من خلال الموقع؟
                        {" "}
                      </button>
                    </h3>
                    <div
                      id="faq-content-12"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        نعم ، إذا كان لديك القدرة والمعرفة الكاملة ببرنامج
                        الدورة التي تريد أن تشرحها للطلاب ولديك المهارات التي تؤهلك للقيام بذلك ، فلماذا لا؟
                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-13"
                      >
                        <span className="num">13.</span>
                        هل يتقاضى الشخص الذي يشرح الدورات مقابل ذلك؟
                      </button>
                    </h3>
                    <div
                      id="faq-content-13"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        نعم بعد تحديد سعر الدورة التي سيقدمها أو الملخص الذي يريد بيعه سنحصل على نسبة معينة والباقي له.
                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-14"
                      >
                        <span className="num">14.</span>
                        من هم الفئة المستهدفة من خلال الموقع؟{" "}
                      </button>
                    </h3>
                    <div
                      id="faq-content-14"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        هم طلاب الجامعات الأردنية المختلفة ،
                        فيمكنهم الاستفادة من الملخصات و الدورات التي تشرح المواد خلال فترة دراستهم من أجل تحقيق أعلى العلامات و تحقيق أكبر قدر ممكن الفهم لها.

                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq-content-15"
                      >
                        <span className="num">15.</span>
                        ما هي الطرق المعتمدة للتواصل مع الشارحين
                        {" "}
                      </button>
                    </h3>
                    <div
                      id="faq-content-15"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqlist"
                    >
                      <div className="accordion-body mt-4">
                        في التفاصيل الإضافية لكل دورة أو مُلخص تم إضافته ، ستكون هناك معلومات الاتصال الخاصة بالشارح، بما في ذلك البريد الإلكتروني و حساب فيسبوك و لينكد إن ، والتي يمكنك من خلالها التواصل معه .

                      </div>
                    </div>
                  </div>
                  {/* # Faq item*/}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Frequently Asked Questions Section */}
      </main>
    </div>

  )
}

export default Faq;