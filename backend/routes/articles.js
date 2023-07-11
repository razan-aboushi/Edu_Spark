const express = require('express');
const router = express.Router();
const articlesController = require('../controller/articlesController')





// get the data of articles from the database 
router.get('/articles', articlesController.articlesAll);


// get the count of the comments in the article page for each article
router.post('/comments/count', articlesController.getCountOfComments);






// Define the route to fetch a specific article based on the article id in the article details page
router.get('/articles/:article_id', articlesController.getarticlesbyID);


// get all comments from article
router.get('/articles/:article_id/comments', articlesController.getAllCommentsForArticle);



// post comments to database
router.post('/comments', articlesController.InsertComments);


// Edit the user comment in article details
router.put('/comments/:commentId', articlesController.editUserComment);



// Delete the user comment 
router.delete('/comments/:commentId',articlesController.deleteUserComment );


module.exports = router;
