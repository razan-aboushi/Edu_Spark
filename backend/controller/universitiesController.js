const connection = require('../models/dbConnect');


// Get all the universities in the uni page
const getAllUniversities = (req, res) => {
    const query = 'SELECT * FROM universities';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching universities:', error);
            res.status(500).json({error: 'An error occurred while fetching universities.'});
        } else {
            res.json(results);
        }
    });
}


// get all the categories related to a specific university with optional search term
const getAllCategoriesInUniversity = (req, res) => {
    const {universityId} = req.params;
    const {searchTerm} = req.query;

    let query = 'SELECT * FROM categories WHERE university_id = ?';
    const queryParams = [universityId];

    if (searchTerm) {
        query += ' AND category_name LIKE ?';
        queryParams.push(`%${searchTerm}%`);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error while getting university categories:', error);
            res.status(500).json({error: 'Internal server error'});
        } else {
            res.json(results);
        }
    });
};


module.exports = {

    getAllUniversities, getAllCategoriesInUniversity

}