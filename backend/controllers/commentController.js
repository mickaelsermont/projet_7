// Imports
const models = require('../models');

// Get all comments
exports.getAllComments = (req, res) => {
    getComments()
        .then(comments => {  
            if(comments.length == 0) return res.status(400).json({ error : "Il n'y a aucun commentaire !"});
            return res.status(200).json(comments);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// Get one comment
exports.getComment = (req, res) => {
    getCommentById(req.params.id)
        .then(comment =>{
            if(comment == null) return res.status(400).json({ error : "Aucun commentaire trouvé !"});
            res.status(200).json(comment);
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Create new comment
exports.createComment = (req, res) => {
    var text = req.body.text;
    
    // Check text is null
    if(text == null) return res.status(400).json({ error: 'Le commentaire est vide.' });

    // Check text length
    if(text.length < 9 || text.length >= 1000) {
        return res.status(400).json({ error: 'Le texte doit avoir une longueur de 10 à 100 caractères.' });
    }

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return queryCreateComment(user.id, text);
        })
        .then(comment => {
            res.status(200).json({ success: 'Le commentaire a bien été posté !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Update a comment
exports.updateComment = (req, res) => {
    var text = req.body.text;
    
    // Check text is null
    if(text == null) return res.status(400).json({ error: 'Le champs texte est vide.' });

    // Check text length
    if(text.length < 2 || text.length >= 1000) {
        return res.status(400).json({ error: 'Le texte doit avoir une longueur de 3 à 1000 caractères.' });
    }

    getCommentById(req.params.id)
        .then(comment => {
            if(!comment) return res.status(400).json({ error: "Le commentaire n'existe pas !" });

            // Vérifie si c'est l'auteur ou un admin sinon pas accès
            if(comment.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            return queryUpdateComment(comment, text);
        })
        .then(results => {
            res.status(200).json({ success: 'Commentaire modifié !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Delete a message
exports.deleteComment = (req, res) => {
    getCommentById(req.params.id)
        .then(comment => {
            if(!comment) return res.status(400).json({ error: "Le commentaire n'existe pas !" });
            
            // Vérifie si c'est l'auteur ou un admin sinon pas accès
            if(comment.UserId !== req.userId) {
                if(!req.isAdmin) return res.status(401).json({ error: 'Accès interdit !' });
            }

            return queryDeleteComment(comment);
        })
        .then(results => {
            res.status(200).json({ success: 'Commentaire supprimé !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Functions ----------------------------------------
function getUserById(id) {
    return new Promise((resolve, reject) => {

        const user = models.User.findOne({
            attributes: ['id', 'fullname', 'imgUrl'],
            where: { id: id }
        });

        if(user) {
            resolve(user);
        } else {
            reject(Error('Aucun utilisateur trouvé !'));
        }
    })
}

function getComments() {
    return new Promise((resolve, reject) => {

        const comments = models.Comments.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: models.User,
                attributes: ['fullname', 'imgUrl']
            }]
        });

        if(comments) {
            resolve(comments);
        } else {
            reject(Error('Aucun commentaires trouvés !'));
        }
    })
}

function getCommentById(id) {
    return new Promise((resolve, reject) => {

        const comment = models.Comment.findOne({
            where: { id: id },
            include: [{
                model: models.User,
                attributes: ['fullname' , 'imgUrl']
            }]
        });

        if(comment) {
            resolve(comment);
        } else {
            reject(Error('Aucun commentaire trouvé !'));
        }
    })
}

function queryCreateComment(userId, text) {
    return new Promise((resolve, reject) => {

        const new_comment = models.Comment.create({
            text: text,
            UserId: userId
        });

        if(new_comment) {
            resolve(new_comment);
        } else {
            reject(Error('Erreur dans la creation du commentaire !'));
        }
    })
    
}

function queryUpdateComment(comment, text) {
    return new Promise((resolve, reject) => {

        const update_comment = comment.update({
            text: text,
            updatedAt: new Date()
        });

        if(update_comment) {
            resolve(update_comment);
        } else {
            reject(Error('Erreur dans la modification du commentaire !'));
        }
    })
}

function queryDeleteComment(comment) {
    return new Promise((resolve, reject) => {

        const remove_comment = comment.destroy();

        if(remove_comment) {
            resolve(remove_comment);
        } else {
            reject(Error('Erreur dans la suppression du commentaire !'));
        }
    })
}