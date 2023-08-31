const connection = require('../models/dbConnect');



// Add summary to cart
const postToCart = (req, res) => {
  const { user_id, summary_id } = req.body;

  const query = `
      INSERT INTO cart (user_id, summary_id , type)
      VALUES (?, ? ,'summary')
    `;

  connection.query(query, [user_id, summary_id], (err, results) => {
    if (err) {
      console.error('Error adding summary to cart:', err);
      res.status(500).json({ error: 'An error occurred while adding the summary to the cart.' });
      return;
    }
    res.status(200).json({ message: 'Summary added to the cart successfully.' });
  });
};




// Get cart items for a user "check if the summary exists in the user cart or not"
const getCartItems = (req, res) => {
  const { user_id, summary_id } = req.params;

  const query = `SELECT EXISTS (SELECT 1 FROM cart WHERE user_id = ? AND summary_id = ?) AS is_exists`;

  connection.query(query, [user_id, summary_id], (err, results) => {
    if (err) {
      console.error('Error checking if summary exists in cart:', err);
      res.status(500).json({ error: 'An error occurred while checking if the summary exists in the cart.' });
      return;
    }

    const exists = results[0].is_exists === 1;
    res.status(200).json({ exists });
  });
};





// Remove summary from cart
const deleteCartItems = async (req, res) => {
  const { user_id, summary_id } = req.params;
  try {
    const query = 'DELETE FROM cart WHERE user_id = ? AND summary_id = ?';
    const values = [user_id, summary_id];
    await connection.promise().query(query, values);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





// GET route to check if a course exists in the cart table "if the user add this course in the cart or not"
const getCourseFromCart = (req, res) => {
  const { user_id, course_id } = req.params;

  const query = `SELECT EXISTS (SELECT 1 FROM cart WHERE user_id = ? AND course_id = ?) AS is_exists`;

  connection.query(query, [user_id, course_id], (err, results) => {
    if (err) {
      console.error('Error checking if course exists in cart:', err);
      res.status(500).json({ error: 'An error occurred while checking if the course exists in the cart.' });
      return;
    }

    const exists = results[0].is_exists === 1;
    res.status(200).json({ exists });
  });
};




// Add a course to the cart table
const postToCartCourse = (req, res) => {
  const { user_id, course_id } = req.body;

  const query = `
      INSERT INTO cart (user_id, course_id ,type)
      VALUES (?, ? , 'course')
    `;

  connection.query(query, [user_id, course_id], (err, results) => {
    if (err) {
      console.error('Error adding course to cart:', err);
      res.status(500).json({ error: 'An error occurred while adding the course to the cart.' });
      return;
    }
    res.status(200).json({ message: 'Course added to the cart successfully.' });
  });
};




// DELETE the specific course from cart items for a specific user
const deleteCourseCart = (req, res) => {
  const { user_id, course_id } = req.params;
  const query = 'DELETE FROM cart WHERE user_id = ? AND course_id = ?';

  const values = [user_id, course_id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.sendStatus(200);
  });
}




// in the courses and summaries page 
// Check if an item exists in the cart
const getItemsCourseSummary = (req, res) => {

  const { user_id, itemType, item_id } = req.params;

  const query = `SELECT COUNT(*) AS count FROM cart WHERE user_id = ? AND ${itemType}_id = ?`;

  connection.query(query, [user_id, item_id], (error, results) => {
    if (error) {
      console.error('Error checking cart item:', error);
      res.status(500).json({ error: 'An error occurred while checking the cart item' });
    } else {
      const exists = results[0].count > 0;
      res.json({ exists });
    }
  });
}




// Add an item to the cart "add course and summary" to cart
const addToCartItems = (req, res) => {
  const { user_id, summary_id, course_id, type } = req.body;

  const query = 'INSERT INTO cart (user_id, summary_id, course_id, type) VALUES (?, ?, ?, ?)';

  connection.query(query, [user_id, summary_id, course_id, type], (error, results) => {
    if (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'An error occurred while adding the item to the cart' });
    } else {
      res.sendStatus(200);
    }
  });
};






module.exports = {

  postToCart, getCartItems, deleteCartItems, postToCartCourse, deleteCourseCart, getCourseFromCart,
  getItemsCourseSummary, addToCartItems
}