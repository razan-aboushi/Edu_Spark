const connection = require('../models/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'a0cd951a5ac8e6fdd53e5b2e2ca9360f2e3f5501f3ab400b7e93cf21f0a71323';

const SignUpRegister = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const phoneNumber = req.body.phone_number;
  const birthdate = req.body.birthdate;
  const gender = req.body.gender;

  // Check if email already exists
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkEmailQuery, [email], (emailError, emailResults) => {
    if (emailError) {
      console.error(emailError);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }

    if (emailResults.length > 0) {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }

    // Hash the password
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }

      const sql = 'INSERT INTO users (name, email, gender, phone_number, birthdate, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [name, email, gender, phoneNumber, birthdate, hashedPassword, role];

      connection.query(sql, values, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            error: 'Internal server error'
          });
        }

        if (results.affectedRows > 0) {
          const userId = results.insertId;

          try {
            const token = jwt.sign(
              { userId, email, role },
              secretKey , { expiresIn: '3h' }
            );

            const tokenSql = 'INSERT INTO user_access_tokens (user_id, token) VALUES (?, ?)';
            const tokenValues = [userId, token];

            connection.query(tokenSql, tokenValues, (tokenError, tokenResults) => {
              if (tokenError) {
                console.error(tokenError);
                return res.status(500).json({
                  error: 'Failed to save token in the database'
                });
              }

              res.json({
                message: 'User Data Inserted Successfully',
                token,
                role
              });
            });
          } catch (error) {
            console.error('Error signing JWT:', error);
            res.status(500).json({ error: 'Failed to sign JWT' });
          }
        } else {
          res.status(404).json({ error: 'No user found' });
        }
      });
    });
  });
};

module.exports = {
  SignUpRegister
};