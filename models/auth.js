const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
    },
    age:{
        type:Number,
        require:true
    },
})

const Users = mongoose.model('Users',userSchema);
module.exports = Users
