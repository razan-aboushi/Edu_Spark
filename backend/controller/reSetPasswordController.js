const connection = require('../models/dbConnect');


// Check if the email and phone number exist in the user table
const checkUserExist= (req, res) => {
    const { email, phone } = req.body;

    // Check if the user exists in the database or not
    const query = 'SELECT * FROM users WHERE email = ? AND phone_number = ?';
    connection.query(query, [email, phone], (err, results) => {
        if (err) 
        {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            if (results.length > 0) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        }
    });
}




// Reset the password for the user with the provided email and phone number
const ResetPassword= (req, res) => {
    const { email, phone, password } = req.body;

    // Update the password in the database
    const query = 'UPDATE users SET password = ? WHERE email = ? AND phone_number = ?';
    connection.query(query, [password, email, phone], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        } else {
            res.sendStatus(200);
        }
    });
}







module.exports = {

    ResetPassword,checkUserExist

}