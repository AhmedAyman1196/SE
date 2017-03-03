var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var studentSchema = new mongoose.Schema({
	username: String,
	password: String ,
	gucID: String ,
	picture:String ,
	works : [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'work'
	}]
});



// generating a hash
studentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
studentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


var Student = mongoose.model("Student", studentSchema);
module.exports = Student; 


