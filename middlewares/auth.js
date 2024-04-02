const item = require('../models/item')
// Check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

// Check if user is authenticated
exports.isLoggedin = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

// Check if user is author of story
exports.isOwner = (req, res, next) => {
    let id = req.params.id;
    item.findById(id)
    .then(item => {
        if(item) {
            if (item.owner == req.session.user) {
                return next();
            } else {
                req.flash('error', '401! Unauthorized access to this resource');
                return res.redirect('/');
            }
        }
    })
    .catch(err => next(err))
};