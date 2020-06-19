var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');

var User=new Schema({
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
    admin:{
        type:Boolean,
        default:false
    }

});

//support for username and hashed password and hash salt value by using this passport local mongoose plugin
User.plugin(passportLocalMongoose);


//creating mongoose model below
module.exports=mongoose.model('User',User);