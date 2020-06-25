const express = require('express');
const bodyParser = require('body-parser');

var authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites
            .findOne({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                console.log(favorites)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body.length > 0) {
            const reqDishes = req.body.map(obj => obj._id);
            Favorites
                .findOne({ 'user': req.user._id }).then((favorite) => {
                    if (favorite) {
                        for (let i = 0; i < reqDishes.length; i++) {
                            let unique = true;
                            for (let j = 0; j < favorite.dishes.length; j++) {
                                if (reqDishes[i] == favorite.dishes[j]) {
                                    unique = false;
                                    break;
                                }
                            }
                            if (unique) favorite.dishes.push(reqDishes[i])
                        }
                        favorite.save()
                            .then(() => {
                                Favorites.find({ 'user': req.user._id })
                                    .populate('dishes')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            }, (err) => next(err));
                    } else {
                        Favorites.create({ user: req.user._id, dishes: reqDishes }).then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }).catch((err) => next(err));
                    }

                }).catch((err) => next(err));
        } else {
            res.statusCode = 400;
            res.end('Wrong data');
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites
            .findOne({ 'user': req.user._id })
            .then((favorite) => {
                if (favorite != null) {
                    console.log(favorite.dishes);
                    favorite.dishes.splice(0, Infinity);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('User favorites' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorites) => {
                if(!favorites){
                   res.statusCode  = 200;
                   res.setHeader('Content-Type','application/json');
                   return res.json({"exists":false, "favorites": favorites});
                }
                else{
                    if(favorites.dishes.indexOf(req.params.dishId)<0){
                        res.statusCode  = 200;
                        res.setHeader('Content-Type','application/json');
                        return res.json({"exists":false, "favorites": favorites});    
                    }
                    else{
                        res.statusCode  = 200;
                        res.setHeader('Content-Type','application/json');
                        return res.json({"exists":true, "favorites": favorites});
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites
            .findOne({ 'user': req.user._id }).then((favorite) => {
                if (favorite) {
                    for (let index = 0; index < favorite.dishes.length; index++) {
                        console.log(favorite.dishes[index])
                        if (favorite.dishes[index] == req.params.dishId) {
                            res.statusCode = 400;
                            res.end('Already added as favirite' + req.params.dishId);
                            break;
                        }

                    }
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                        .then(() => {
                            Favorites.find({ 'user': req.user._id })
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        }, (err) => next(err));
                } else {
                    Favorites.create({ user: req.user._id, dishes: [req.params.dishId] }).then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }).catch((err) => next(err));
                }

            }).catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites
            .findOne({ 'user': req.user._id })
            .populate('dishes')
            .then((favorite) => {
                if (favorite != null) {
                    console.log("favorite.dishes", favorite.dishes)
                    favorite.dishes.remove({ "_id": req.params.dishId })
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('User favorites' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;