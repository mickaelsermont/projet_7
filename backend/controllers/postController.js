// Imports
const models = require('../models');
const fs = require('fs');

// Get all posts
exports.getAllPosts = (req, res) => {
    getPosts()
        .then(posts => {  //posts retourne un tableau
            if(posts.length == 0) return res.status(400).json({ error : "Aucune publications disponibles !"});
            return res.status(200).json(posts);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// Get one post
exports.getPost = (req, res) => {

    getPostById(req.params.id)
        .then(post =>{
            if(post == null) return res.status(400).json({ error : "Aucunes publications disponibles !"});
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(400).json(error);
        })
}

// Create new post
exports.createPost = (req, res) => {
    var imageUrl = null;
    var message = req.body.text;

    if(req.file) {
        // Image url
        imageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;
    }

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return queryCreatePost(user.id, imageUrl, message);
        })
        .then(post => {
            res.status(200).json({ success: "La publication a bien été crée !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Update a post
exports.updatePost = (req, res) => {
    var imageUrl;
    var message = req.body.text;

    // ajout de controle pour text publication
    
    getPostById(req.params.id)
        .then(post => {
            if(!post) return res.status(400).json({ error: "La publication n'existe pas !" });

            // Vérifie si c'est l'auteur ou un admin sinon pas accès
            if(post.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Reprend l'image dans la bdd si aucune image est ajoutée
            if(!req.file) { 
                imageUrl = post.mediaUrl; 
            } else {
                imageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;

                // Supprime l'ancienne image
                const filename = post.mediaUrl.split('/images/')[1];

                fs.unlink("images/"+filename, function (error) {
                    if (error) throw error;
                    // si pas d'erreur, l'image est effacé avec succès !
                    console.log('Image supprimée !');
                }); 
            }

            return queryUpdatePost(post, imageUrl, message);
        })
        .then(results => {
            res.status(200).json({ success: "La publication a été modifié !" });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Delete a post
exports.deletePost = (req, res) => {

    getPostById(req.params.id)
        .then(post => {
            if(!post) return res.status(400).json({ error: "La publication n'existe pas !" });
            
            // Vérifie si c'est l'auteur ou un admin sinon pas accès
            if(post.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            // Supprime l'ancienne image
            const filename = post.mediaUrl.split('/images/')[1];

            fs.unlink("images/"+filename, function (error) {
                if (error) throw error;
                // si pas d'erreur, l'image est effacé avec succès !
                console.log('Image supprimée !');
            }); 

            return queryDeletePost(post);
        })
        .then(results => {
            res.status(200).json({ success: 'La publication a été supprimé !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Functions ----------------------------------------
function getUserById(id) {
    return new Promise((resolve, reject) => {

        const user = models.User.findOne({
            attributes: ['id', 'fullname' , 'email', 'imgUrl'],
            where: { id: id }
        });

        if(user) {
            resolve(user);
        } else {
            reject(Error('Aucun utilisateur trouvé !'));
        }
    })
}

function getPosts() {
    return new Promise((resolve, reject) => {

        const posts = models.Post.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: models.User,
                attributes: ['fullname', 'imgUrl']
            }]
        });

        if(posts) {
            resolve(posts);
        } else {
            reject(Error('Aucunes publications disponibles !'));
        }
    })
}

function getPostById(id) {
    return new Promise((resolve, reject) => {

        const post = models.Post.findOne({
            where: { id: id },
            include: [{
                model: models.User,
                attributes: ['fullname' , 'imgUrl']
            }]
        });

        if(post) {
            resolve(post);
        } else {
            reject(Error('Aucune publication trouvée !'));
        }
    })
}

function queryCreatePost(userId, image, message) {
    return new Promise((resolve, reject) => {

        const new_post = models.Post.create({
            text: message,
            mediaUrl: image,
            UserId: userId
        });

        if(new_post) {
            resolve(new_post);
        } else {
            reject(Error("Erreur dans la creation de la publication !"));
        }
    })
    
}

function queryUpdatePost(post, image, message) {
    return new Promise((resolve, reject) => {

        const updateMedia = post.update({
            text: message,
            mediaUrl: image,
            updatedAt: new Date()
        });

        if(updateMedia) {
            resolve(updateMedia);
        } else {
            reject(Error("Erreur dans la creation de la publication !"));
        }
    })
}

function queryDeletePost(post) {
    return new Promise((resolve, reject) => {

        const remove_post = post.destroy();

        if(remove_post) {
            resolve(true);
        } else {
            reject(Error("Erreur dans la suppression de la publication !"));
        }
    })
}