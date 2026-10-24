import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Student", "Recruiter", "TPO"],
        default:"Student",
    },
    phone:{
        type:String,
        trim:true,
    },
    college:{
        type:String,
        trim:true,
    },
    branch:{
        type:String,
        trim:true,
    },
    cgpa:{
        type:Number,
        min:0,
        max:10,
        trim:true,
    },
    graduationYear:{
        type:Number,
    },
    skills:{
        type:[String],
        default:[],
    },
    github:{
        type:String,
        trim:true,
    },
    linkedin:{
        type:String,
        trim:true,
    },
},
 {
        timestamps:true,
    },
);

const User=mongoose.model("User",userSchema);

export default User;