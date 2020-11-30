const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const config = require('config.js');


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            if(user.role == "Auditor") {
                next();
            }  else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
};

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/audit',authenticateJWT, getAll);
router.get('/logout', logout);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;




function authenticate(req, res, next) {
    // console.log(req.ip)
    userService.authenticate(req.body)
        .then(user => {
            if(user){
                req.body.loginTime = new Date()
                req.body.clientIp = req.ip
                user.role = req.body.role
                userService.update(user._id,req.body).then( () => res.json(user)).catch(err => next(err));
            } else {
                res.status(400).json({ message: 'Username or password is incorrect' })
            }
        }).catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function logout(req, res, next) {
    req.body.logoutTime = new Date();
    userService.update(req.user.sub,req.body).then( () => res.json()).catch(err => next(err));

}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}