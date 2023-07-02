const connection = require('../models/dbConnect');




// Get all the universities in the uni page
const getAllUniversities = (req, res) => {
  const query = 'SELECT * FROM universities';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching universities:', error);
      res.status(500).json({ error: 'An error occurred while fetching universities.' });
    } else {
      res.json(results);
    }
  });
}



// get all the categories related to specific university
const getAllCategoriesInUniversity = (req, res) => {
  const { universityId } = req.params;

  // Execute the SQL query to retrieve categories
  connection.query(
    'SELECT * FROM categories WHERE university_id = ?',
    [universityId],
    (error, results) => {
      if (error) {
        console.error('Error while get the university categories:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    }
  );
}


module.exports = {

  getAllUniversities, getAllCategoriesInUniversity

}