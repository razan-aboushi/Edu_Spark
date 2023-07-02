const connection = require('../models/dbConnect');

// Get the last 6 articles for the home page
const getArticlesHome = (req, res) => {
  const query = 'SELECT * FROM articles ORDER BY created_at DESC LIMIT 6';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ articles: results });
    }
  });
};


// Get categories section for the home page
const getCoursesSection = (req, res) => {
  const query = `
    SELECT c.*, cat.category_name, u.university_name, u1.name AS course_publisher
    FROM courses AS c
    INNER JOIN categories AS cat ON c.category_id = cat.category_id
    INNER JOIN universities AS u ON c.university_id = u.university_id
    INNER JOIN users AS u1 ON c.user_id = u1.user_id
    WHERE c.course_status = 'approve'
    ORDER BY c.course_id DESC
    LIMIT 3
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    } else {
      res.json(results);
    }
  });
};


// Get the three summaries for the home page
const getThreeSummaries = (req, res) => {
  const query = `
    SELECT s.*, u.name AS summary_publisher, u1.university_name, c.category_name
    FROM summaries AS s
    INNER JOIN users AS u ON s.user_id = u.user_id
    INNER JOIN universities AS u1 ON s.university_id = u1.university_id
    INNER JOIN categories AS c ON s.category_id = c.category_id
    WHERE s.summary_status = 'approve'
    ORDER BY s.summary_id DESC
    LIMIT 3
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch summaries' });
    } else {
      res.json(results);
    }
  });
};



// Get all universities for the home page
const getAllUniversitiessection = (req, res) => {
  const query = 'SELECT * FROM universities';

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results);
  });
};



// Retrieving the latest courses 3 courses in home page
const getThreeCoursesInHome = (req, res) => {
  const query = `
    SELECT c.course_id, c.course_image, c.course_title, c.course_brief, c.course_price,
      c.course_duration, u.university_name, ct.category_name
    FROM courses c
    JOIN universities u ON c.university_id = u.university_id
    JOIN categories ct ON c.category_id = ct.category_id
    ORDER BY c.course_date DESC
    LIMIT 3;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving courses: ' + error.stack);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    res.json(results);
  });
}


// get the enrolled courses data
const enrolledCourses = async (req, res) => {
  const { user_id } = req.params;

  try {
    const enrolledCourses = await connection.promise().query(
      'SELECT * FROM course_enrollments WHERE user_id = ?',
      [user_id]
    );

    res.json(enrolledCourses[0]);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




// get the enrolled summary data
const enrolledSummaries = async (req, res) => {
  const { user_id } = req.params;

  try {
    const enrolledSummaries = await connection.promise().query(
      'SELECT * FROM summary_enrollments WHERE user_id = ?',
      [user_id]
    );

    res.json(enrolledSummaries[0]);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};









module.exports = {
  getArticlesHome,
  getCoursesSection,
  getThreeSummaries,
  getAllUniversitiessection,
  getThreeCoursesInHome,enrolledCourses,enrolledSummaries
};
