const connection = require('../models/dbConnect');


// get all articles in articles page
const articlesAll = (req, res) => {
    const query = 'SELECT * FROM articles';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching articles:', err);
            res.status(500).json({error: 'Error fetching articles'});
        } else {
            res.json({articles: results});
        }
    });
}


// get the comments count for each article in article page
const getCountOfComments = (req, res) => {
    const {articleId} = req.body;


    const query = `
        SELECT article_id, COUNT(comment_id) AS comments_count
        FROM comments
        WHERE article_id IN (?)
        GROUP BY article_id
    `;

    connection.query(query, [articleId], (err, results) => {
        if (err) {
            console.error('Error fetching comments count:', err);
            res.status(500).json({error: 'Failed to fetch comments count'});
            return;
        }

        const commentsCountMap = {};
        results.forEach((row) => {
            commentsCountMap[row.article_id] = row.comments_count;
        });

        res.json({commentsCountMap});
    });
};


//  get the article in articles details page by id
const getarticlesbyID = (req, res) => {
    const {article_id} = req.params;

    const query = 'SELECT * FROM articles WHERE article_id = ?';

    connection.query(query, article_id, (err, results) => {
        if (err) {
            console.error('Error fetching article:', err);
            res.status(500).json({error: 'Internal server error'});
        } else if (results.length === 0) {
            res.status(404).json({error: 'Article not found'});
        } else {
            res.json(results[0]);
        }
    });
}


// Get comments for an article
const getAllCommentsForArticle = (req, res) => {
    const {article_id} = req.params;

    const query = `
        SELECT comments.*, users.name
        FROM comments
                 INNER JOIN users ON comments.user_id = users.user_id
        WHERE comments.article_id = ?
    `;

    connection.query(query, [article_id], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).json({error: 'Internal server error'});
        } else {
            res.json(results);
        }
    });
}


// Create a new comment by the user and insert it to database
const InsertComments = (req, res) => {
    const {comment_content, user_id, article_id} = req.body;
    const query = `
        INSERT INTO comments (comment_content, user_id, article_id, date)
        SELECT ?, users.user_id, ?, NOW()
        FROM users
        WHERE users.user_id = ?
    `;

    const values = [comment_content, article_id, user_id];

    connection.query(query, values, (err) => {
        if (err) {
            console.error('Error posting comment:', err);
            res.status(500).json({error: 'Internal server error'});
        } else {
            res.sendStatus(201);
        }
    });
}


// Edit the comment
const editUserComment = (req, res) => {
    const {commentId} = req.params;
    const {comment_content} = req.body;

    const updateCommentQuery = `
        UPDATE comments
        SET comment_content = ?
        WHERE comment_id = ?;
    `;
    connection.query(updateCommentQuery, [comment_content, commentId], error => {

        if (error) {
            console.error('Error editing comment:', error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}


// Delete the user a comment
const deleteUserComment = (req, res) => {
    const {commentId} = req.params;


    const deleteCommentQuery = `
        DELETE
        FROM comments
        WHERE comment_id = ?;
    `;
    connection.query(deleteCommentQuery, [commentId], error => {

        if (error) {
            console.error('Error deleting comment:', error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

// Make the filters for the articles page
const getFilteredArticles = (req, res) => {
    const {searchTerm} = req.query;

    let query = `
        SELECT *
        FROM articles
    `;

    // Handling filters based on query parameters
    const queryParams = [];

    if (searchTerm) {
        query += ` WHERE (article_title LIKE ? OR article_brief LIKE ?)`;
        queryParams.push(`%${searchTerm}%`);
        queryParams.push(`%${searchTerm}%`);
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching filtered articles:', err);
            res.status(500).json({error: 'Failed to fetch filtered articles from the database'});
            return;
        }

        res.json({articles: results});
    });
};


module.exports = {

    getarticlesbyID,
    articlesAll,
    getAllCommentsForArticle,
    InsertComments,
    getCountOfComments,
    editUserComment,
    deleteUserComment,
    getFilteredArticles
}