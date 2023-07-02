const connection = require('../models/dbConnect');


const getTransferAndBuy = (req, res) => {
  const user_id = req.params.user_id;
  
  const query = `
    SELECT DISTINCT users.name, transactions.amount, summary_enrollments.summary_id, summary_enrollments.enrollment_date, courses.course_title, summaries.summary_title
    FROM users
    JOIN transactions ON users.user_id = transactions.user_id
    JOIN summary_enrollments ON transactions.user_id = summary_enrollments.user_id
    JOIN course_enrollments ON transactions.user_id = course_enrollments.user_id
    JOIN courses ON course_enrollments.course_id = courses.course_id
    JOIN summaries ON summary_enrollments.summary_id = summaries.summary_id
    WHERE users.user_id = ?
  `;

  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
};






  module.exports = {
    getTransferAndBuy
  };
  





















// module.exports = {

//     getAllTrasfersOperations

// }