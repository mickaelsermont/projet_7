// Imports
const bcrypt = require('bcrypt');
const models = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,16}$/;
const LETTERS_REGEX = /^[\w\sA-Za-z]+$/;


// Register User 
exports.register = (req, res) => {
    var email      = req.body.email;
    var fullname   = req.body.fullname;
    var password = req.body.password;
    
    // Check input null
    if (!email || !password || !fullname) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    // Check email
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }

    // Check fullname
    if (fullname.length > 26 || fullname.length < 2) {
        return res.status(400).json({ error: 'Le nom doit avoir une longueur de 3 à 25 caractères.' });
    }
    if(!fullname.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le nom doit contenir que des lettres' });
    }

    // Check password
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe est invalide. Il doit avoir une longueur de 4 à 16 caractères et contenir au moins 1 chiffre.' });
    }

    // Hash email before insert in db
    var hash_email = crypto.createHash(process.env.CRYPTO_HASH).update(email).digest(process.env.CRYPTO_CODING_BASE);

    // Get User by email
    getUserByEmail(hash_email)
        .then(user => {
            if(user) return res.status(400).json({ error: "L'utilisateur existe déjà !" });

            return cryptPassword(password);
        })
        .then(bcryptedPassword => {
            // Create User in database
            models.User.create({
                fullname: fullname,
                email: hash_email,
                password: bcryptedPassword,
                imgUrl: "http://localhost:3000/images/profiles/default.jpg",
                isAdmin: false
            });

            return res.status(200).json({ success: 'Utilisateur enregistré !' });
        })
        .catch(error => {
            return res.status(400).json({ error });
        })
}

// Login User
exports.login = (req, res) => {
    // Params
    var email    = req.body.email;
    var password = req.body.password;

    // Form verification
    if (email == null || password == null) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    // Check email
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }
    
    // Check password
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe est invalide. Il doit avoir une longueur de 4 à 16 caractères et contenir au moins 1 chiffre.' });
    }

    var hash_email = crypto.createHash(process.env.CRYPTO_HASH).update(email).digest(process.env.CRYPTO_CODING_BASE);

    // Get User by email
    getUserByEmail(hash_email)
        .then(data => {
            const user = data.dataValues;
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Mot de passe incorrect" });

            // Generate token
            var token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                process.env.SECRET_TOKEN,
                { expiresIn: '12h' }
            );

            // return token for frontend
            res.status(200).json({ userID : user.id, token: token });
        })
        .catch(error => {
            res.status(401).json({ error });
        })
}

// Logout User
exports.logout = (req, res) => {

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return res.status(200).json({
                success: 'Déconnexion réussite !'
            });
        })
        .catch(error => {
            return res.status(401).json(error);
        })
}

// Get own User for login
exports.getUserLogin = (req, res) => {
    getUserById(req.userId)
        .then(user =>{
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return res.status(200).json(user);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// Get User Profile
exports.getUserProfile = (req, res) => {

    getUserById(req.params.id)/* req.userId */
        .then(user =>{
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            return res.status(200).json(user);
        })
        .catch(error => {
            return res.status(400).json(error);
        })
}

// Update User Profile
exports.updateUserProfile = (req, res) => {

    // Check input null
    if (!req.body.email || !req.body.fullname || !req.body.bio) {
        return res.status(400).json({ error: 'Certains champs sont vides !' });
    }

    // Check email
    if (!EMAIL_REGEX.test(req.body.email)) {
        return res.status(400).json({ error: "Adresse mail non valide" });
    }

    // Check first name
    if (req.body.fullname.length > 26 || req.body.fullname.length < 2) {
        return res.status(400).json({ error: 'Le prénom doit avoir une longueur de 3 à 25 caractères.' });
    }
    if(!req.body.fullname.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le prénom doit contenir que des lettres' });
    }

    // Check last name
    if (req.body.bio.length >= 20 || req.body.bio.length < 3) {
        return res.status(400).json({ error: 'Le nom doit avoir une longueur de 3 à 19 caractères.' });
    }
    if(!req.body.bio.match(LETTERS_REGEX)) {
        return res.status(400).json({ error: 'Le nom doit contenir que des lettres' });
    }

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            // Reprend l'image dans la bdd si aucune image est ajoutée
            if(!req.file) { 
                imageUrl = user.imgUrl; 
            } else {
                imageUrl = `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`;

                // Supprime l'ancienne image
                const filename = user.imgUrl.split('/images/')[1];

                fs.unlink("images/"+filename, function (error) {
                    if (error) return console.log(error);
                    // si pas d'erreur, l'image est effacé avec succès !
                    console.log('Image supprimée !');
                }); 
            }

            return queryUpdateUser(user, req.body, imageUrl);
        })
        .then(results => {
            res.status(200).json({ success: "Profil modifié !"});
        })
        .catch(error => {
            res.status(400).json({ error });
        })
}

// Delete User Profile
exports.deleteUserProfile = (req, res) => {

    getUserById(req.userId)
        .then(user => {
            if(!user) return res.status(400).json({ error: "L'utilisateur n'existe pas !" });

            // Delete all likes / comment / posts => "bon ordre"
            // Supprime l'ancienne image
            const filename = user.imgUrl.split('/images/')[1];

            fs.unlink("images/"+filename, function (error) {
                if (error) return console.log(error);
                // si pas d'erreur, l'image est effacé avec succès !
                console.log('Image supprimée !');
            }); 
            
            return queryDeleteUser(user);
        })
        .then(results => {
            res.status(200).json({ message: 'Compte supprimé !' });
        })
        .catch(err => {
            res.status(400).json({ err });
        })
}


// Functions ----------------------------------------
function getUserById(id) {
    return new Promise((resolve, reject) => {

        const user = models.User.findOne({
            attributes: ['id', 'fullname', 'email', 'imgUrl', 'isAdmin'],
            where: { id: id }
        });

        if(user) {
            resolve(user);
        } else {
            reject(Error('Aucun utilisateur trouvé !'));
        }
    })
}

function getUserByEmail(email) { /* ONLY LOGIN & REGISTER */
    return new Promise((resolve, reject) => {


        // Only function who to get password
        const user = models.User.findOne({
            attributes: ['id', 'fullname', 'bio', 'email', 'imgUrl', 'password', 'isAdmin'],
            where: { email: email } /* add crypto for decrypt */
        });

        if(user) {
            resolve(user);
        } else {
            reject('Adresse email incorrect !');
        }
    })
}

function queryUpdateUser(user, formParams, imageUrl) {
    return new Promise((resolve, reject) => {
        
        const userModify = user.update(
            {
                imgUrl: imageUrl,
                bio: formParams.bio,
                email: formParams.email,
                fullname: formParams.fullname,
                updatedAt: new Date()
            }
        );

        if(userModify) {
            resolve(userModify);
        } else {
            reject(Error('Erreur dans la modification !'));
        }
    })
}

function queryDeleteUser(user) {
    return new Promise((resolve, reject) => {

        const userRemove = user.destroy();

        if(userRemove) {
            resolve(userRemove);
        } else {
            reject(Error('Erreur dans la suppression du compte !'));
        }
    })
}


function cryptPassword(password) {
    return new Promise((resolve, reject) => {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        if(hash) {
            resolve(hash);
        } else {
            reject('Un problème est survenu !'); //Probleme pour crypter le mot de passe
        } 
    })
}
