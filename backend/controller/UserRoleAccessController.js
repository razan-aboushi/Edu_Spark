const connection = require('../models/dbConnect');



// Get user data by user ID
const checkUserRole = (req, res) => {
    const userId = req.params.id;
  
    const query = `
      SELECT users.*, roles.name AS role_name
      FROM users
      INNER JOIN roles ON users.role_id = roles.id
      WHERE users.user_id = ?
    `;
  
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.length > 0) {
          const userData = {
            user_id: result[0].user_id,
            name: result[0].name,
            email: result[0].email,
            gender: result[0].gender,
            phone_number: result[0].phone_number,
            birthdate: result[0].birthdate,
            password: result[0].password,
            flags: result[0].flags,
            avatar: result[0].avatar,
            role_id: result[0].role_id,
            role_name: result[0].role_name,
            created_at: result[0].created_at,
          };
          res.json(userData);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      }
    });
  }
  



  
module.exports={

    checkUserRole
}