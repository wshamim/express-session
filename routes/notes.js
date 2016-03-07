var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Note = mongoose.model('Note');
var User = mongoose.model('User');

var jwt = require('express-jwt');
var appConfig = require('../config');

var auth = jwt({secret: appConfig.secret, userProperty: 'payload'});

function getLoggedInUser(req, next){				// Function to get loggedInUser from request payload
    User.findOne({_id: req.payload._id})
        .populate('notes')
        .exec(function(err, user){
            if(err){ return next(err); }

            return next(req,user);
        });
}

router.post('/create', auth, function(req, res, next) {

    var note = new Note();
    note.content = req.body.content;

    note.save(function (err) {
        if (err) {
            return next(err);
        }
        User.findOne({_id: req.payload._id}, function (err, user){
            user.notes.push(note);
            user.save(function(err){
                if (err) {
                    return next(err);
                }
                return res.json(note);
            })
        });
    });
});

router.route('/:note_id')

    // get the note with that id
    .get(auth, function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    })

    // update the note with this id
    .put(auth, function(req, res) {
        Note.findById(req.params.note_id, function(err, note) {

            if (err)
                res.send(err);

            note.content = req.body.content;
            note.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Note updated !!' });
            });

        });
    })

    // delete the note with this id
    .delete(auth, function(req, res) {
        var funcDelNotes = function(req, loggedInUser) {
            Note.remove({
                _id: req.params.note_id
            }, function (err, note) {
                if (err)
                    res.send(err);

                loggedInUser.notes.splice(loggedInUser.notes.indexOf(note),1);
                loggedInUser.save(function(err){
                    if (err) {
                        return next(err);
                    }
                    res.json({message: 'Note deleted successfully !!'});
                });
            });
        };
        getLoggedInUser(req, funcDelNotes);
    });


module.exports = router;
