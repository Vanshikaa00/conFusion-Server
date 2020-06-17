var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var User=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }

});

//creating mongoose model below
module.exports=mongoose.model('User',User);