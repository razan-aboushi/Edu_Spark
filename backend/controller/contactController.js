const connection = require('../models/dbConnect');



const PostContactMessages = (req, res) => {
  const { name, email, subject, message } = req.body;

  const newMessage = {
    name: name,
    email: email,
    subject: subject,
    message: message
  };

  const sql = 'INSERT INTO contact_us (name, email, subject, message) VALUES (?, ?, ?, ?)';
  const values = [name, email, subject, message];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error inserting message into the database:', error);
      return res.status(500).json({ error: 'Failed to insert message into the database' });
    }

    res.json({ message: 'Message received successfully' });
  });
}





// Handle GET request to get the users data
const getUsersDataInContactUsPage = (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Error in fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    } else {
      console.log('User data fetched successfully:', results);
      res.status(200).json(results);
    }
  });
}















module.exports = {

  PostContactMessages, getUsersDataInContactUsPage

}