const connection = require('../models/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'a0cd951a5ac8e6fdd53e5b2e2ca9360f2e3f5501f3ab400b7e93cf21f0a71323';

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT * FROM users WHERE email = ?';

  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (compareError, isMatch) => {
      if (compareError) {
        console.error(compareError);
        return res.status(500).json({
          error: 'Internal server error'
        });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role_id },
        secretKey
      );

      res.json({
        message: 'Login Successful',
        token,
        role: user.role_id,
        userId: user.user_id
      });
    });
  });
};

















module.exports = {
  login
};
