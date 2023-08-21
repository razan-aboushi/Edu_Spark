const connection = require('../models/dbConnect');


// get all courses in courses page
const getAllCourses = (req, res) => {
  const query = `
    SELECT courses.*, universities.university_name, categories.category_name, users.name AS publisher_name
    FROM courses 
    INNER JOIN universities ON courses.university_id = universities.university_id
    INNER JOIN categories ON courses.category_id = categories.category_id
    INNER JOIN users ON courses.user_id = users.user_id
    WHERE courses.course_status = 'مقبول'
    ORDER BY courses.course_id DESC
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Failed to fetch courses from the database' });
      return;
    }

    res.json(results);
  });
};





// In course details page
const getCourseDetails = (req, res) => {
  const { course_id } = req.params;

  const query = `
  SELECT courses.*, universities.university_name, categories.category_name, users.name AS course_publisher, users.email
  FROM courses
  INNER JOIN universities ON courses.university_id = universities.university_id
  INNER JOIN categories ON courses.category_id = categories.category_id
  INNER JOIN users ON courses.user_id = users.user_id
  WHERE courses.course_id = ?
`;


  connection.query(query, [course_id], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Error fetching course details' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Course not found' });
      } else {
        const courseData = results[0];
        res.json(courseData);
      }
    }
  });
};










module.exports = {

  getAllCourses,getCourseDetails

}