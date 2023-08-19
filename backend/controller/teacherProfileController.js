const connection = require('../models/dbConnect');
const multer = require('multer');
const path = require('path');


// Configure Multer to specify the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'course_image' || file.fieldname === 'summary_image') {
      cb(null, './images');
    } else if (file.fieldname === 'summary_file') {
      cb(null, './reports');
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.originalname; 
    cb(null, filename);
  },
});


const upload = multer({ storage: storage });








// post summary form
const postSummaryForm = (req, res) => {
  upload.fields([
    { name: 'summary_image', maxCount: 1 },
    { name: 'summary_file', maxCount: 1 }
  ])(req, res, (error) => {
    if (error) {
      console.error('Error uploading files: ', error);
      res.status(500).json({ error: 'An error occurred while uploading the files' });
      return;
    }

    const {
      summary_title,
      summary_description,
      summary_brief,
      sell_or_free,
      summary_price,
      summary_category,
      summary_university,
      facebook_link,
      linkedin_link,
    } = req.body;

    const user_id = req.params.user_id;
    const summary_file = req.files['summary_file'] ? req.files['summary_file'][0].filename : null;
    const summary_image = req.files['summary_image'] ? req.files['summary_image'][0].filename : null;

    // Prepare the SQL query
    const query = `INSERT INTO summaries (university_id, summary_title, summary_status, summary_price, summary_image, summary_file,user_id, summary_description, summary_brief, sell_or_free, linkedin_link, facebook_link, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    // Execute the query
    connection.query(
      query,
      [
        summary_university,
        summary_title,
        'قيد الإنتظار',
        summary_price,
        summary_image,
        summary_file,
        user_id,
        summary_description,
        summary_brief,
        sell_or_free,
        linkedin_link,
        facebook_link,
        summary_category,
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting the summary: ", err);
          res.status(500).json({ error: "Failed to insert the summary" });
          return;
        }
        res.status(200).json({ message: "Summary inserted successfully" });
      }
    );
  });
}









// post the course to database
const postCourseForm = (req, res) => {
  upload.single('course_image')(req, res, (error) => {
    if (error) {
      console.error('Error uploading file: ', error);
      res.status(500).json({ error: 'An error occurred while uploading the file' });
      return;
    }

    const user_id = req.params.user_id;

    const {
      course_title,
      course_brief,
      course_description,
      course_type,
      sell_or_free ,
      course_price,
      course_duration,
      start_date,
      end_date,
      start_time,
      end_time,
      course_category,
      course_university,
      facebook_link,
      connection_channel,
      linkedin_link,
    } = req.body;

    // Get the uploaded course image
    const course_image = req.file ? req.file.filename : null;

    // Insert the form data into the "courses" table
    const sql = `
      INSERT INTO courses (
        course_image,
        course_title,
        course_brief,
        course_status,
        sell_or_free ,
        course_price,
        course_duration,
        course_date,
        course_description,
        user_id,
        university_id,
        category_id,
        facebook_link,
        linkedin_link,
        start_date,
        end_date,
        start_time,
        end_time,
        connection_channel,
        course_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;

    connection.query(
      sql,
      [
        course_image,
        course_title,
        course_brief,
        'قيد الإنتظار',
        sell_or_free ,
        course_price,
        course_duration,
        new Date(),
        course_description,
        user_id,
        course_university,
        course_category,
        facebook_link,
        linkedin_link,
        start_date,
        end_date,
        start_time,
        end_time,
        connection_channel,
        course_type
      ],
      (error, results) => {
        if (error) {
          console.error('Error inserting data into the database: ', error);
          res.status(500).json({ error: 'An error occurred while saving the data' });
          return;
        }

        res.json({ success: true });
      }
    );
  });
};






// get the courses that related to specific user in "manage courses page"
const getUserCourses = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT courses.*, universities.university_name, categories.category_name, users.name AS course_publisher, users.email
    FROM courses
    INNER JOIN universities ON courses.university_id = universities.university_id
    INNER JOIN categories ON courses.category_id = categories.category_id
    INNER JOIN users ON courses.user_id = users.user_id
    WHERE courses.user_id = ?
  `;

  connection.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'Error fetching user courses' });
    } else {
      const userCourses = results;
      res.json(userCourses);
    }
  });
};





// GET summaries for a specific user in its profile 
const getUserSummaries =(req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM summaries WHERE user_id = ?`;

  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching summaries:', err);
      res.status(500).json({ error: 'Failed to fetch summaries' });
      return;
    }
    res.json(results);
  });
}





// get the number of subscribers for a course
const getCountOfSubsucribers = (req, res) => {
  const { course_id } = req.params;

  const query = `SELECT COUNT(*) AS subscriberCount FROM course_enrollments WHERE course_id = ?`;

  connection.query(query, [course_id], (error, results) => {
    if (error) {
      console.error('Error retrieving subscriber count:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the subscriber count.' });
    } else {
      const subscriberCount = results[0].subscriberCount;
      res.json({ subscriberCount });
    }
  });
}



// get the number of buy for a summary
const getCountOfSummariesSubsucribers = (req, res) => {
  const { summary_id } = req.params;

  const query = `SELECT COUNT(*) AS subscriberCount FROM summary_enrollments WHERE summary_id = ?`;

  connection.query(query, [summary_id], (error, results) => {
    if (error) {
      console.error('Error retrieving subscriber count:', error);
      res.status(500).json({ error: 'An error occurred while retrieving the subscriber count.' });
    } else {
      const subscriberCount = results[0].subscriberCount;
      res.json({ subscriberCount });
    }
  });
}






module.exports = {
  postCourseForm, postSummaryForm,getUserCourses,getUserSummaries ,getCountOfSubsucribers ,getCountOfSummariesSubsucribers
};