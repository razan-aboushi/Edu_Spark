const connection = require('../models/dbConnect');
const router = require('../routes/payment');



// Store summaries enrollment
const postSummariesIdEnrollment = (req, res) => {
    const { user_id } = req.params;
    const { summariesId } = req.body;

    // Store summariesId in the summary enrollment table for the user with user_id
    const query = `INSERT INTO summary_enrollments (user_id, summary_id, enrollment_date) VALUES ?`;
    const values = summariesId.map((summaryId) => [user_id, summaryId, new Date()]);

    connection.query(query, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to store summaries enrollment' });
        }

        console.log('Summaries enrollment stored successfully');
        res.status(200).json({ message: 'Summaries enrollment stored successfully' });
    });
}



// Store courses enrollment
const postCourseIdEnrollment = (req, res) => {
    const { user_id } = req.params;
    const { coursesId } = req.body;

    // Store coursesId in the course enrollment table for the user with user_id
    const query = `INSERT INTO course_enrollments (user_id, course_id, enrollment_date) VALUES ?`;
    const values = coursesId.map((courseId) => [user_id, courseId, new Date()]);

    connection.query(query, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to store courses enrollment' });
        }

        console.log('Courses enrollment stored successfully');
        res.status(200).json({ message: 'Courses enrollment stored successfully' });
    });
}




// Route for inserting a transaction into the 'transactions' table
const postTransaction = (req, res) => {
    const { payment_methods_id, date } = req.body;
    const { user_id } = req.params;
    const {amount} =req.body;

    connection.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database: ', err);
            res.status(500).json({ error: 'Failed to connect to the database' });
            return;
        }

        const query = 'INSERT INTO transactions (payment_methods_id, date, user_id,amount) VALUES (?, ?, ?,?)';
        const values = [payment_methods_id, new Date(date).toISOString().slice(0, 19).replace('T', ' '), user_id,amount];


        connection.query(query, values, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing the query: ', error);
                res.status(500).json({ error: 'Failed to insert the transaction' });
                return;
            }

            res.status(200).json({ message: 'Transaction inserted successfully' });
        });
    });
}






// Route to get the payment method ID based on the slug
const getPaymentIdOfCreditCard = (req, res) => {
    const { paymentMethodName } = req.query;

    // Query the database to retrieve the payment method ID
    connection.query('SELECT id FROM payment_methods WHERE slug = ?', [paymentMethodName], (error, results) => {
        if (error) {
            console.error('Error querying the database: ', error);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }

        if (results.length > 0) {
            const paymentMethodId = results[0].id;
            res.json({ id: paymentMethodId });
        } else {
            res.status(404).json({ error: 'Payment method not found' });
        }
    });
}





// Get the three summaries for the home page
// const getTransactionsData = (req, res) => {

//     const query = 'SELECT * FROM transactions';

//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Failed to fetch summaries' });
//         } else {
//             res.json(results);
//         }
//     });
// };




// handling form submission and storing transaction details
// const postTransactionDetails = (req, res) => {
//     const { transaction_id, amount } = req.body;

//     // Create a new transaction details object
//     const transactionDetails = {
//         transaction_id: transaction_id,
//         amount: amount,
      
//     };

//     connection.query('INSERT INTO transaction_details SET ?', transactionDetails, (error, results) => {

//         if (error) {
//             console.error('Error inserting transaction details:', error);
//             res.status(500).json({ error: 'Failed to insert transaction details' });
//         } else {
//             console.log('Transaction details inserted successfully:', results);
//             res.status(200).json({ message: 'Transaction details inserted successfully' });
//         }
//     });
// }









module.exports = {
    postSummariesIdEnrollment,
    postCourseIdEnrollment, postTransaction, getPaymentIdOfCreditCard,
    //  getTransactionsData,postTransactionDetails
};
