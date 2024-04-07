const express = require("express");
const cors = require('cors');
const app = express();
const aboutUs=require('./routes/aboutus');
const article=require('./routes/articles');
const contactUs=require('./routes/contact');
const home=require('./routes/home');
const login=require('./routes/logIn');
const signUp=require('./routes/signUp');
const payments=require('./routes/payment');
const admin=require('./routes/admin');
const courses=require('./routes/courses');
const summaries=require('./routes/summaries');
const universities=require('./routes/universities');
const teacherProfile=require('./routes/teacherProfile');
const studentProfile=require('./routes/studentProfile');
const todo=require('./routes/todo');
const cart =require('./routes/cart');
const resetPassword = require('./routes/reSetPassword');
const coursesAndsummaries=require('./routes/summaryAndCourses');


const dotenv =require('dotenv');
dotenv.config({path:'.env'});
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));
app.use("/reports", express.static("reports"));



app.use(aboutUs);
app.use(article);
app.use(contactUs);
app.use(home);
app.use(login);
app.use(signUp);
app.use(payments);
app.use(admin);
app.use(summaries);
app.use(universities);
app.use(teacherProfile);
app.use(studentProfile);
app.use(courses);
app.use(todo);
app.use(cart);
app.use(resetPassword);
app.use(coursesAndsummaries);



app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});