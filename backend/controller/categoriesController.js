const connection = require('../models/dbConnect');


// get all categories in university
const getAllCategories= (req, res) => {
    const selectQuery = 'SELECT * FROM categories';
  
    connection.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  }
  














module.exports={
    getAllCategories
    
    
}