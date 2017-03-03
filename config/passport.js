// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the student model
var Student       = require('../models/student');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(student, done) {
        done(null, student.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Student.findById(id, function(err, student) {
            done(err, student);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route 
                                //  (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
 
        // asynchronous
        process.nextTick(function() {
            Student.findOne({ 'username' :  username }, function(err, student) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!student)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!student.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else{
                    console.log(student.username+" has logged in") ;
                    return done(null, student);
                }
            });
        });

    }));

     // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.student) {
                Student.findOne({ 'username' :  username }, function(err, student) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (student) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // create the user
                        var newStudent            = new Student();

                        newStudent.username = username;
                        newStudent.password = newStudent.generateHash(password);

                        newStudent.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newStudent);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.student.username ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                Student.findOne({ 'username' :  username }, function(err, student) {
                    if (err)
                        return done(err);
                    
                    if (student) {
                        return done(null, false, req.flash('loginMessage', 'That student is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var student = req.student;
                        student.username = username;
                        student.password = student.generateHash(password);
                        student.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,student);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.student);
           }

        });

    }));
};