const connection = require('../models/dbConnect');



// Define the route to get courses by category and university
const getCoursesByCategoryAndUni = (req, res) => {
    const { university_id } = req.params;
    const { category_id } = req.params;

    const query = `
    SELECT c.*, u.name AS publisher_name
    FROM courses AS c
    JOIN universities  ON c.university_id = universities.university_id
    JOIN categories AS cat ON c.category_id = cat.category_id
    JOIN users AS u ON c.user_id = u.user_id
    WHERE c.university_id = ? AND c.category_id = ?
    `;

    // Execute the query with the provided category and university IDs
    connection.query(query, [university_id, category_id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no courses are found, handle it accordingly
        if (results.length === 0) {
            return res.status(404).json({ error: 'No courses found' });
        }

        res.json(results);
    });
};




const getSummariesByCategoryAndUni = (req, res) => {

    const { university_id } = req.params;
    const { category_id } = req.params;

    const query = `
    SELECT summaries.*, u.name AS publisher_name
    FROM summaries 
    JOIN universities  ON summaries.university_id = universities.university_id
    JOIN categories AS cat ON summaries.category_id = cat.category_id
    JOIN users AS u ON summaries.user_id = u.user_id
    WHERE summaries.university_id = ? AND summaries.category_id = ?`;

    // Execute the query with the provided category and university IDs
    connection.query(query, [university_id, category_id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no summaries are found, handle it accordingly
        if (results.length === 0) {
            return res.status(404).json({ error: 'No summaries found' });
        }

        res.json(results);
    });

}




// Handle the search request
const searchCoursesSummary = (req, res) => {
    const searchQuery = req.params.query;
  
    // Perform the search in the summaries table and join with the users table
    const summariesQuery = `
      SELECT summaries.*, users.name AS publisher_name
      FROM summaries
      INNER JOIN users ON summaries.user_id = users.user_id
      WHERE summary_title LIKE '%${searchQuery}%' OR users.name LIKE '%${searchQuery}%';
    `;
  
    // Perform the search in the courses table and join with the users table
    const coursesQuery = `
      SELECT courses.*, users.name AS publisher_name
      FROM courses
      INNER JOIN users ON courses.user_id = users.user_id
      WHERE course_title LIKE '%${searchQuery}%' OR users.name LIKE '%${searchQuery}%';
    `;
  
    connection.query(summariesQuery, (error, summaryResults) => {
      if (error) {
        console.error('Error executing the summaries search query: ', error);
        res.status(500).json({ error: 'An error occurred while executing the search query' });
      } else {
        connection.query(coursesQuery, (error, courseResults) => {
          if (error) {
            console.error('Error executing the courses search query: ', error);
            res.status(500).json({ error: 'An error occurred while executing the search query' });
          } else {
            res.json({ summaries: summaryResults, courses: courseResults });
          }
        });
      }
    });
  };
  





module.exports = {


    getCoursesByCategoryAndUni, getSummariesByCategoryAndUni,searchCoursesSummary
}