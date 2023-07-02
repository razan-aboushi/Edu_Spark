const connection = require('../models/dbConnect');


const aboutUsGet= (req, res) => {
  const query = 'SELECT * FROM about_us LIMIT 1';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results[0]);
    }
  });
}


module.exports={

aboutUsGet

}