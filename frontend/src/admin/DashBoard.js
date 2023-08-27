import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';


function Dashboard() {
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [numberOfExplainers, setNumberOfExplainers] = useState(0);
  const [numberOfContactMessages, setNumberOfContactMessages] = useState(0);
  const [revenue, setRevenue] = useState('0 JD');
  const [sales, setSales] = useState('0 JD');
  const [numberOfUniversity, setNumberOfUniversity] = useState(0);
  const [numberOfCourses, setNumberOFCourses] = useState(0);
  const [numberOfSummariess, setNumberOFSummaries] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the number of students
        const studentsResponse = await axios.get('http://localhost:4000/students');
        const studentsCount = studentsResponse.data.count;
        setNumberOfStudents(studentsCount);

        // Fetch the number of explainers
        const explainersResponse = await axios.get('http://localhost:4000/explainers');
        const explainersCount = explainersResponse.data.count;
        setNumberOfExplainers(explainersCount);

        // Fetch the number of contact messages
        const messagesResponse = await axios.get('http://localhost:4000/messages');
        const messagesCount = messagesResponse.data.count;
        setNumberOfContactMessages(messagesCount);



        // Fetch the number of courses in the website
        const coursesResponse = axios.get('http://localhost:4000/coursesCount');
        const coursesCount = (await coursesResponse).data.count;
        setNumberOFCourses(coursesCount);




        // Fetch the number of summaries in the website
        const summariesResponse = axios.get('http://localhost:4000/summariesCount');
        const summariesCount = (await summariesResponse).data.count;
        setNumberOFSummaries(summariesCount);




        // Fetch the revenue
        const revenueResponse = await axios.get('http://localhost:4000/revenue');
        const revenueData = revenueResponse.data.revenue;
        setRevenue(revenueData);


        // Fetch the sales
        const salesResponse = await axios.get('http://localhost:4000/sales');
        const salesData = salesResponse.data.sales;
        setSales(salesData);


        // Fetch the university
        const universityResponse = await axios.get('http://localhost:4000/universityNumber');
        const universityData = universityResponse.data.count;
        setNumberOfUniversity(universityData);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard mt-5">
      <Card title="الطلاب" value={numberOfStudents} icon={<i className="fas fa-users"></i>} />
      <Card title="الطلاب 'معلمين' " value={numberOfExplainers} icon={<i className="fas fa-chalkboard-teacher"></i>} />
      <Card title="رسائل التواصل معنا" value={numberOfContactMessages} icon={<i className="fas fa-envelope"></i>} />
      <Card title="الجامعات" value={numberOfUniversity} icon={<i className="fa fa-graduation-cap"></i>} />
      <Card title="المُلخصات" value={numberOfSummariess} icon={<i className="fa fa-book"></i>} />
      <Card title="الدورات" value={numberOfCourses} icon={<i className="fa fa-book"></i>} />
      <Card title="الإيرادات" value={`${revenue} د.أ`} icon={<i className="fas fa-dollar-sign"></i>} />
      <Card title="المبيعات" value={`${sales} د.أ`} icon={<i className="fas fa-dollar-sign"></i>} />
    </div>
  );
}

export default Dashboard;



// Card component that take the title , value and icon as props from the dashboard component
function Card({ title, value, icon }) {
  return (
    <div className="DashboardCards with-box-shadow">
      <div className="card-icon">{icon}</div>
      <h4>{title}</h4>
      <p className="paragraph">{value}</p>
    </div>

  );
}