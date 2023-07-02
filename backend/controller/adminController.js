const dotenv = require('dotenv');
const connection = require('../models/dbConnect');
const multer = require('multer');
const path = require('path');

// Configure Multer to specify the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'university_image') {
      cb(null, './images');
    } else if (file.fieldname === 'category_image') {
      cb(null, './images');
    } else if (file.fieldname === 'article_image') {
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




/////////////////////////////////////



const getAllDataInAboutUs = async (req, res) => {
  // Execute the query to retrieve the data from the database
  connection.promise().query('SELECT * FROM about_us')
    .then(([rows]) => {
      console.log(rows)
      res.json(rows);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    });
}



// Update the vision and mission statement
const updateVisionMission = async (req, res) => {
  const { mission, vision, mission_title, vision_title } = req.body;

  try {
    await connection.promise().query(
      'UPDATE about_us SET mission = ?, vision = ?, mission_title = ?, vision_title = ?',
      [mission, vision, mission_title, vision_title]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
};



// Update about us
const updateAboutUs = async (req, res) => {
  const { aboutus_title, aboutpargraph1, aboutpargraph2 } = req.body;

  try {
    // Execute the query to update the "about us" data in the database
    await connection.promise().query(
      'UPDATE about_us SET aboutus_title = ?, aboutpargraph1 = ?, aboutpargraph2 = ?',
      [aboutus_title, aboutpargraph1, aboutpargraph2]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
};
// end update and save the edition




// get all the users in the database 
const getAllUsers = (req, res) => {
  const query = `SELECT users.*, roles.name AS role FROM users INNER JOIN roles ON users.role_id = roles.id`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving users: ', error);
      res.status(500).json({ error: 'Error retrieving users' });
      return;
    }
    res.json(results);
  });
}


//delete one user in database
const deleteUserFromWS = (req, res) => {
  const userId = req.params.id;
  const query = `DELETE FROM users WHERE user_id = ${userId}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting user: ', error);
      res.status(500).json({ error: 'Error deleting user' });
      return;
    }
    res.sendStatus(200);
  });
}


// get all messages in the from contact us
const allContactUsMessages = async (req, res) => {
  const query = `SELECT * FROM contact_us`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Error retrieving messages' });
      return;
    }
    res.json(results);
  });
};



// get all the admin data profile
const getAdminDataProfile = (req, res) => {
  // Retrieve the admin's data from the database
  connection.query('SELECT * FROM users WHERE role_id = 1', (error, results) => {
    if (error) {
      console.error('Error fetching admin data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const adminData = results[0];
      res.json(adminData);
    }
  });
}




// Update the admin profile data
const updateAdminProfileData = (req, res) => {
  const updatedProfile = req.body;

  // Update the admin's profile data in the database
  connection.query('UPDATE users SET ? WHERE role_id = 1', [updatedProfile], (error, results) => {
    if (error) {
      console.error('Error updating admin profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Profile updated successfully' });
    }
  });
}




// Add article to website
const writeAndPostArticles = (req, res) => {
  upload.single('article_image')(req, res, (err) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    const { article_title, article_brief, article_content } = req.body;

    // Access the uploaded image file from the request
    const article_image = req.file;

    // Check if an image file was uploaded
    if (!article_image) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Assuming you have a database connection named "connection" established

    const sql = 'INSERT INTO articles (article_title, article_brief, article_content, article_image) VALUES (?, ?, ?, ?)';
    connection.query(sql, [article_title, article_brief, article_content, article_image.filename], (err, result) => {
      if (err) {
        console.error('Error adding article:', err);
        return res.status(500).json({ success: false, message: 'Failed to add article' });
      }

      res.json({ success: true, message: 'Article added successfully' });
    });
  });
};







// get the count of contact us messages 
const getAllContactsCounts = (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM contact_us WHERE is_read = 0';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching unread messages count:', err);
      res.status(500).json({ error: 'Error fetching unread messages count' });
    } else {
      const count = results[0].count;
      res.json({ count });
    }
  });
}




// update the number of read messages 
const readMessagesContactUs =  (req, res) => {
  try {
     connection.query('UPDATE contact_us SET is_read =1 WHERE is_read = 0');
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}




// update the user role
updateUserRole = (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const sql = "UPDATE users SET role_id = ? WHERE user_id = ?";
  const values = [role, userId];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log("Error updating user role: " + error.message);
      res.status(500).json({ error: "Failed to update user role" });
    } else {
      res.status(200).json({ message: "User role updated successfully" });
    }
  });
}



// in the admin dashboard stat
// get the number of students
const getStudentNumberInWebsite = (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM users WHERE role_id = 2';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const count = results[0].count;
      res.json({ count });

      connection.release();
    });
  });
}


// API endpoint to fetch the number of explainers
const getExplainerNumberInWebsite = (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM users WHERE role_id = 3';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const count = results[0].count;
      res.json({ count });

      connection.release();
    });
  });
}

// get the number of contact messages
const getContactUsMessagesNumber = (req, res) => {
  const query = 'SELECT COUNT(*) AS count FROM contact_us';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const count = results[0].count;
      res.json({ count });

      connection.release();
    });
  });
}



// get the revenue in the website
const getRevenueOfTheWebSite = (req, res) => {
  const query = 'SELECT SUM(amount * 0.15) AS revenue FROM transactions';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const revenue = results[0].revenue || 0;
      res.json({ revenue });

      connection.release();
    });
  });
};



// get the revenue in the website
const getSalesInTheWebSite = (req, res) => {
  const query = 'SELECT SUM(amount) AS sales FROM transactions';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const sales = results[0].sales || 0;
      res.json({ sales });

      connection.release();
    });
  });
};



// get the number of universities in the website
const getUniversityNumberInTheWebSite = (req, res) => {
  const query = 'SELECT COUNT(*) AS numberOfUniversity FROM universities';

  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        res.status(500).json({ error: 'Internal server error' });
        connection.release();
        return;
      }

      const count = results[0].numberOfUniversity;
      res.json({ count });

      connection.release();
    });
  });
};










// Handle POST request to add a university
const postUniversity = (req, res) => {
  upload.single('university_image')(req, res, (err) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const { university_name } = req.body;
    const university_image = req.file ? req.file.filename : null;

    // Save the university details to the database
    const sql = 'INSERT INTO universities (university_name, university_image) VALUES (?, ?)';
    const values = [university_name, university_image];

    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'University added successfully' });
    });
  });
};

// Handle POST request to add a category
const postCategories = (req, res) => {
  upload.single('category_image')(req, res, (err) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const { category_name, university_id } = req.body;
    const category_image = req.file ? req.file.filename : null;

    // Save the category details to the database
    const sql =
      'INSERT INTO categories (category_name, category_image, university_id) VALUES (?, ?, ?)';

    const values = [category_name, category_image, university_id];
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Category added successfully' });
    });
  });
};








// Backend API route for fetching pending summaries
const getPendingSumaries = (req, res) => {
  const query = `
    SELECT summaries.*, users.email , users.name
    FROM summaries
    INNER JOIN users ON summaries.user_id = users.user_id
    WHERE summaries.summary_status = 'pending'
  `;

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Error fetching pending summaries' });
    } else {
      res.json(results);
    }
  });
}



// update the status of the summaries 
const updateSummaryApproveStatus=  (req, res) => {
  const { id } = req.params;

  const updateQuery = 'UPDATE summaries SET summary_status = ? WHERE summary_id = ?';
  const status = 'approve';

  connection.query(updateQuery, [status, id], (err, result) => {
    if (err) {
      console.log('Error approving summary:', err);
      return res.status(500).json({ error: 'Failed to approve the summary request.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    return res.status(200).json({ message: 'The summary request has been approved.' });
  });
}






// Endpoint to reject a summary
const updateSummarRejectStatus =(req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  // Update the summary status to 'reject' in the database
  const updateQuery = 'UPDATE summaries SET summary_status = ?, rejection_reason = ? WHERE summary_id = ?';
  const status = 'reject';

  // Execute the query with the provided summary ID, status, and rejection reason
  connection.query(updateQuery, [status, reason, id], (err, result) => {
    if (err) {
      console.log('Error rejecting summary:', err);
      return res.status(500).json({ error: 'Failed to reject the summary request.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    return res.status(200).json({ message: 'The summary request has been rejected.' });
  });
}





// Get all pending courses
const getAllPendingCourses = (req, res) => {
  const query = `
    SELECT courses.*, users.name, users.email
    FROM courses
    JOIN users ON courses.user_id = users.user_id
    WHERE course_status = 'pending';
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.log('Error fetching pending courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
};





// Update course status to "approve"
const updateCourseStatusApprove =(req, res) => {
  const courseId = req.params.id;
  const query = `
    UPDATE courses
    SET course_status = 'approve'
    WHERE course_id = ?;
  `;
  connection.query(query, [courseId], (error, results) => {
    if (error) {
      console.log('Error approving course:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Course not found' });
    } else {
      res.json({ message: 'Course approved successfully' });
    }
  });
}



// Update course status to "reject" and store the rejection reason
const updateCourseStatusReject= (req, res) => {
  const courseId = req.params.id;
  const { reason } = req.body;
  const query = `
    UPDATE courses
    SET course_status = 'reject', rejection_reason = ?
    WHERE course_id = ?;
  `;
  connection.query(query, [reason, courseId], (error, results) => {
    if (error) {
      console.log('Error rejecting course:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Course not found' });
    } else {
      res.json({ message: 'Course rejected successfully' });
    }
  });
}









module.exports = {
  getAllDataInAboutUs,
  updateVisionMission,
  updateAboutUs, getAllUsers, deleteUserFromWS, allContactUsMessages,
  getAdminDataProfile, updateAdminProfileData, writeAndPostArticles, getAllContactsCounts,
  updateUserRole, getStudentNumberInWebsite, getExplainerNumberInWebsite,
   getContactUsMessagesNumber, postUniversity ,postCategories,getPendingSumaries,
   updateSummaryApproveStatus,updateSummarRejectStatus,getAllPendingCourses,
   updateCourseStatusApprove,updateCourseStatusReject , readMessagesContactUs ,
    getRevenueOfTheWebSite,getSalesInTheWebSite,getUniversityNumberInTheWebSite
};
