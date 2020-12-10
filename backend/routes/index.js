// Imports
var express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('../middleware/multer-config.js');

var user = require('../controllers/userController');
var comment = require('../controllers/commentController');
var post = require('../controllers/postController');

// Router
exports.router = (function() {
    var router = express.Router();

    // Auth routes
    router.post('/auth/login/', user.login);
    router.post('/auth/logout/', auth, user.logout);
    router.post('/auth/register/', user.register);

    // Users routes
    router.get('/users/:id', auth, user.getUserProfile);
    router.put('/users/:id', auth, multer, user.updateUserProfile);
    router.delete('/users/:id', auth, user.deleteUserProfile);

    // Comments routes
    router.get('/comments/', auth, comment.getAllComments);
    router.get('/comments/:id', auth, comment.getComment);
    router.post('/comments/', auth, comment.createComment);
    router.put('/comments/:id', auth, comment.updateComment);
    router.delete('/comments/:id', auth, comment.deleteComment);

    // Posts routes
    router.get('/posts/', auth, post.getAllPosts);
    router.get('/posts/:id', auth, post.getPost);
    router.post('/posts/', auth, multer, post.createPost);
    router.put('/posts/:id', auth, multer, post.updatePost);
    router.delete('/posts/:id', auth, post.deletePost);


  return router;
})();