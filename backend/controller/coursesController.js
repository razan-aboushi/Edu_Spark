const connection = require('../models/dbConnect');
const router = require('../routes/courses');


// get all courses in courses page
const getAllCourses = (req, res) => {
  const query = `
    SELECT courses.*, universities.university_name, categories.category_name, users.name AS publisher_name
    FROM courses 
    INNER JOIN universities ON courses.university_id = universities.university_id
    INNER JOIN categories ON courses.category_id = categories.category_id
    INNER JOIN users ON courses.user_id = users.user_id
    WHERE courses.course_status = 'approve'

  `;

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Failed to connect to the database' });
      return;
    }

    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses from the database' });
        return;
      }

      res.json(results);
    });
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


  // Execute the query
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




// get the number of subscribers for a course
const getCountOfSubsucribers = (req, res) => {
  const { course_id } = req.params;

  const query = `SELECT COUNT(*) AS subscriberCount FROM course_enrollments WHERE course_id = ?`;

  connection.query(query, [course_id], (error, results) => {
    if (error) {
      console.error('Error retrieving subscriber count:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the subscriber count.' });
    } else {
      const subscriberCount = results[0].subscriberCount;
      res.json({ subscriberCount });
    }
  });
}









module.exports = {

  getAllCourses,getCourseDetails,getCountOfSubsucribers

}