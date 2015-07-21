var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res) {
  res.render('register',{
  	'title': 'Register'
  });
});

router.get('/login', function(req, res) {
  res.render('login',{
  	'title':'logn'
  });
});

router.post('/register', function(req, res, next){
	// Get form Values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Check for Image Field
	if(req.files.profileimage){
		console.log('Uploading File...');

		// File info
		var profileimageOrignalName 	= req.files.profileimage.originalname;
		var profileImageName 			= req.files.profileImage.name;
		var profileImageMime 			= req.files.profileImage.mimetype;
		var profileImagePath			= req.files.profileImage.path;
		var profileImageExt			    = req.files.profileImage.extension;
		var profileImageSize 			= req.files.profileImage.size;
	}else {
		// Set a Default Image
		var profileImageName = 'noimage.png';
	}	

	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email not vaild').isEmail();
	req.checkBody('username','Username field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({ //only creates the object
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		// Success Message
		req.flash('success','You are now registerd and may log in');

		res.location('/');
		res.redirect('/');
	}
});



module.exports = router;
