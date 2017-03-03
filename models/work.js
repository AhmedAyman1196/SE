var mongoose = require('mongoose');

var workSchema = new mongoose.Schema({
	descrption: String , 
	link: String , 
	repo: String , 
	ScreenShots : String  
});

var Work = mongoose.model("work", workSchema);

module.exports = Work; 