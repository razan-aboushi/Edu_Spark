const connection = require('../models/dbConnect');

const getAllSummaries = (req, res) => {
  const query = `
      SELECT summaries.summary_id, summaries.summary_title, summaries.summary_brief, summaries.summary_price, summaries.summary_image,
             universities.university_name, categories.category_name, users.name AS summary_publisher
      FROM summaries
      INNER JOIN universities ON summaries.university_id = universities.university_id
      INNER JOIN categories ON summaries.category_id = categories.category_id
      INNER JOIN users ON summaries.user_id = users.user_id
      WHERE summaries.summary_status = 'approve'

    `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching summaries:', error);
      res.status(500).json({ error: 'Error fetching summaries' });
    } else {
      res.json(results);
    }
  });
};


// get summary details in summary details page
const getSummaryDetails = (req, res) => {
  const { summaryId } = req.params;
  const query = `
      SELECT summaries.*, uni.university_name, cate.category_name, users.name AS summary_publisher, users.email
      FROM summaries 
      JOIN universities uni ON summaries.university_id = uni.university_id
      JOIN categories cate ON summaries.category_id = cate.category_id
      JOIN users ON summaries.user_id = users.user_id
      WHERE summaries.summary_id = ?
    `;

  // Execute the query
  connection.query(query, [summaryId], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Error fetching summary details' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Summary not found' });
      } else {
        const summaryData = results[0];
        res.json(summaryData);
      }
    }
  });
};







module.exports = {
  getAllSummaries, getSummaryDetails


}