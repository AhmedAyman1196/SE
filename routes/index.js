
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/guest', function(req, res) {
        res.render('guest.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/studentHome', isLoggedIn, function(req, res) {
        res.render('studentHome.ejs', {
            student : req.student
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/studentLog', function(req, res) {
            res.render('studentLog.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/studentLog', passport.authenticate('local-login', {
            successRedirect : '/studentHome', // redirect to the secure profile section
            failureRedirect : '/studentLog', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/studentReg', function(req, res) {
            res.render('studentReg.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/studentReg', passport.authenticate('local-signup', {
            successRedirect : '/studentHome', // redirect to the secure profile section
            failureRedirect : '/studentReg', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // features not added yet
        app.get('/toBeAdded' , function(req ,res){
             res.render('toBeAdded.ejs');
        }); 

   

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN ) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/studentHome', // redirect to the secure profile section
            failureRedirect : '/studentReg', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

}


// OLD WORK





// var express 	= require("express"),
// 	router 		= express.Router(),
// 	mongoose	= require("mongoose");


// var Student = require("../models/student");
// var studentController = require("../controllers/studentController");

// // MAIN
// router.get("/", function(req, res){
// 	res.render("index.ejs");
// }); 

// // TEMP TO GET ALL FROM DATABASE
// router.get("/findAll" , function(req , res){
// 	mongoose.model('Student').find(function(err , Student){
// 		res.send(Student) ;
// 	});
// }) ;

// // MOVE TO STUDENT LOG IN PAGE
// router.get("/studentLog" , function(req , res){
// 	res.render("studentLog.ejs");
// }) ;

// // INSER A STUDENT THE DB
// router.post("/studentLog/insert", studentController.register);

// // undone
// router.get("/toBeAdded" , function(req , res){
// 	res.render("toBeAdded.ejs") ;
// });

// module.exports = router;