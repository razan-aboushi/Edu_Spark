const connection = require('../models/dbConnect');



// get courses by category and university
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

    if (results.length === 0) {
      return res.status(404).json({ error: 'No courses found' });
    }

    res.json(results);
  });
};




// get summaries by category and university
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

    if (results.length === 0) {
      return res.status(404).json({ error: 'No summaries found' });
    }

    res.json(results);
  });

}






module.exports = {


  getCoursesByCategoryAndUni, getSummariesByCategoryAndUni
}