const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

const UserModel=mongoose.model('Users',UserSchema);
module.exports=UserModel;
