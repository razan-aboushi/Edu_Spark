const connection = require('../models/dbConnect');



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




// Insert a transaction into the 'transactions' table
const postTransaction = (req, res) => {
  const { payment_methods_id, date } = req.body;
  const { user_id } = req.params;
  const { amount } = req.body;


    const query = 'INSERT INTO transactions (payment_methods_id, date, user_id,amount) VALUES (?, ?, ?,?)';
    const values = [payment_methods_id, new Date(), user_id, amount];


    connection.query(query, values, (error, results) => {

      if (error) {
        console.error('Error executing the query: ', error);
        res.status(500).json({ error: 'Failed to insert the transaction' });
        return;
      }

      res.status(200).json({ message: 'Transaction inserted successfully' });
    });
}






// Get the payment method ID based on the slug
const getPaymentIdOfCreditCard = (req, res) => {
  const { paymentMethodName } = req.query;

  // Retrieve the payment method ID
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




// Get cart items
const getAllCartItems = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [cartItems] = await connection.promise().query(`
        SELECT c.course_id, c.course_title, c.course_price, s.summary_id, s.summary_title, s.summary_price, cart.type
        FROM cart
        LEFT JOIN courses c ON cart.course_id = c.course_id
        LEFT JOIN summaries s ON cart.summary_id = s.summary_id
        WHERE cart.user_id = ?
      `, [user_id]);

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};





// delete the items from the carts 
const deleteCartItem = async (req, res) => {
  const { user_id, item_id } = req.params;

  // Check if item_id is undefined
  if (typeof item_id === 'undefined') {
    res.status(400).json({ error: 'Invalid item_id' });
    return;
  }

  try {
    const [result] = await connection.promise().query(`
      DELETE FROM cart WHERE user_id = ? AND (course_id = ? OR summary_id = ?)
    `, [user_id, item_id, item_id]);

    if (result.affectedRows === 0) {
      // No matching cart item found
      res.status(404).json({ message: 'Cart item not found' });
    } else {
      // Cart item deleted successfully
      res.json({ message: 'Cart item deleted' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};






// delete the items from the cart after payment process
const deleteCartsAfterPayment = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [result] = await connection.promise().query(
      'DELETE FROM cart WHERE user_id = ?',
      [user_id]
    );

    if (result.affectedRows === 0) {
      // No matching cart item found
      res.status(404).json({ message: 'Cart item not found' });
    } else {
      // Cart item(s) deleted successfully
      res.json({ message: 'Cart item deleted' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};


module.exports = {
  postSummariesIdEnrollment,
  postCourseIdEnrollment, postTransaction,
  getPaymentIdOfCreditCard, getAllCartItems, deleteCartItem, deleteCartsAfterPayment
};