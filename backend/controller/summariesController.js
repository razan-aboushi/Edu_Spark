const connection = require('../models/dbConnect');

const getAllSummaries = (req, res) => {
    const query = `
        SELECT summaries.*, universities.university_name, categories.category_name, users.name AS summary_publisher
        FROM summaries
                 INNER JOIN universities ON summaries.university_id = universities.university_id
                 INNER JOIN categories ON summaries.category_id = categories.category_id
                 INNER JOIN users ON summaries.user_id = users.user_id
        WHERE summaries.summary_status = 'مقبول'

    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching summaries:', error);
            res.status(500).json({error: 'Error fetching summaries'});
        } else {
            res.json(results);
        }
    });
};


// get summary details in summary details page
const getSummaryDetails = (req, res) => {
    const {summaryId} = req.params;
    const query = `
        SELECT summaries.*, uni.university_name, cate.category_name, users.name AS summary_publisher, users.email
        FROM summaries
                 JOIN universities uni ON summaries.university_id = uni.university_id
                 JOIN categories cate ON summaries.category_id = cate.category_id
                 JOIN users ON summaries.user_id = users.user_id
        WHERE summaries.summary_id = ?
    `;

    // Execute the query
    connection.query(query, [summaryId], (error, results) => {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({error: 'Error fetching summary details'});
        } else {
            if (results.length === 0) {
                res.status(404).json({error: 'Summary not found'});
            } else {
                const summaryData = results[0];
                res.json(summaryData);
            }
        }
    });
};

// Get filtered summaries
const getFilteredSummaries = (req, res) => {
    const {searchTerm, universityFilter, categoryFilter} = req.query;

    let query = `
        SELECT summaries.*, universities.university_name, categories.category_name, users.name AS publisher_name
        FROM summaries
                 INNER JOIN universities ON summaries.university_id = universities.university_id
                 INNER JOIN categories ON summaries.category_id = categories.category_id
                 INNER JOIN users ON summaries.user_id = users.user_id
        WHERE summaries.summary_status = 'مقبول'
    `;

    // Handling filters based on query parameters
    const queryParams = [];

    if (searchTerm) {
        query += ` AND (summaries.summary_title LIKE ? OR users.name LIKE ?)`;
        queryParams.push(`%${searchTerm}%`);
        queryParams.push(`%${searchTerm}%`);
    }

    if (universityFilter) {
        query += ` AND summaries.university_id = ?`;
        queryParams.push(universityFilter);
    }

    if (categoryFilter) {
        query += ` AND categories.category_name LIKE ?`;
        queryParams.push(`%${categoryFilter}%`);
    }

    query += ` ORDER BY summaries.summary_id DESC`;

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error fetching filtered summaries:', error);
            res.status(500).json({error: 'Failed to fetch filtered summaries from the database'});
            return;
        }

        res.json(results);
    });
};


module.exports = {
    getAllSummaries, getSummaryDetails, getFilteredSummaries

}