const connection = require('../models/dbConnect');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');


// Configure Multer to specify the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, './images');
    }
    else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });




// Get user ID from user data in the User Prodile Links
const getIdFromUserData = async (req, res) => {
  try {
    // Perform a database query to fetch the user data
    const userData = await connection.query('SELECT user_id FROM users');

    // Return the user ID
    res.json({ userId: userData.user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




// post the data of user bank account into database
const postUserBankAccounts = (req, res) => {
  const { accountNumber, cvv } = req.body;
  const userId = req.params.userId;

  // Hash the account number and cvv using bcrypt
  const hashedAccountNumber = bcrypt.hashSync(accountNumber, 10);
  const hashedcvv = bcrypt.hashSync(cvv, 10);

  const query = 'INSERT INTO bank_accounts (account_number, cvv, user_id) VALUES ( ?, ?, ?)';
  connection.query(query, [ hashedAccountNumber, hashedcvv, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while saving bank account information' });
    } else {
      res.status(200).json({ message: 'Bank account information saved successfully' });
    }
  })}








  // get the student information in the student profile
  const getStudentProfileInfo = (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'User ID is missing' });
      return;
    }
    const query = 'SELECT * FROM users WHERE user_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Error fetching user profile' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userProfile = results[0];
        res.json(userProfile);
      }
    });
  };




  // edit student information
  const editStudentInfo = (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, phone_number, birthdate, password } = req.body;

    const query = 'UPDATE users SET name = ?, email = ?, phone_number = ?, birthdate = ?, password = ? WHERE user_id = ?';

    connection.query(query, [name, email, phone_number, birthdate, password, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while updating the user profile' });
      }

      return res.status(200).json({ message: 'User profile updated successfully' });
    });
  }




 
  // Endpoint to get all the summaries bought by a specific user
const getUserBuySummaries = (req, res) => {
    const { user_id } = req.params;
  
    const query = `
      SELECT summaries.*, summary_enrollments.enrollment_date AS purchaseDate
      FROM summaries
      INNER JOIN summary_enrollments ON summaries.summary_id = summary_enrollments.summary_id
      WHERE summary_enrollments.user_id = ?
    `;
  
    connection.query(query, [user_id], (error, results) => {
      if (error) {
        console.error('Error retrieving summaries:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the summaries.' });
      } else {
        res.json(results);
      }
    });
  }




  const getCourseTheUserJoined = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      // Fetch the courses joined by the user
      const [courses] = await connection.promise().query(
        `SELECT c.course_id, c.course_title, c.start_date, c.end_date, c.start_time, c.end_time, c.connection_channel ,c.course_brief
         FROM course_enrollments ce
         INNER JOIN courses c ON c.course_id = ce.course_id
         WHERE ce.user_id = ?`,
        [user_id]
      );
  
      res.json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the courses.' });
    }
  }
  





  module.exports = {

    getIdFromUserData, postUserBankAccounts, getStudentProfileInfo, editStudentInfo ,getUserBuySummaries,getCourseTheUserJoined

  }