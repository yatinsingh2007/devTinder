const mongoose = require('mongoose')
const validate = require('validator')
const userSchema = mongoose.Schema({
    firstName  :{
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50,
        trim : true
    },
    lastName : {
        type : String,
        minLenght : 0,
        maxLength : 50, 
        trim : true,
        default : null
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if (!validate.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password  : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if (!validate.isStrongPassword(value)){
                throw new Error('Password is not strong enough')
            }
        }
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
        lowercase : true,
        validate(value){
            if (!['male' , 'female' , 'others'].includes(value)){
                throw new Error('Gender data is not valid')
            }
        }
    },
    photoUrl : {
        type : String,
        default : "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=",
        validate(value){
            if (!validate.isURL(value)){
                throw new Error('Photo URL is not valid')
            }
        }
    },
    about : {
        type : String,
        default : "This is a default description of the user",
    },
    skills : {
        type : [String],
        validate(value){
            const godObj = value.reduce((acc , curr) => {
                if (acc[curr]){
                    acc[curr] += 1
                }
                else{
                    acc[curr] = 1
                }
                return acc
            } , {})
            const isValid = Object.values(godObj).every((val) => val === 1)
            if (!isValid){
                throw new Error('Skills should be unique')
            }
        }
    }   
} , {
    timestamps : true
})

const User = mongoose.model("User" , userSchema)

userSchema.methods.getJWT = async function(){
    const token = jwt.sign({_id : this._id} , "Thalaforareason" , {
        expiresIn : '1d'
    });
    return token
}

userSchema.methods.decryptpwd = async function(){
    const decryptedpwd = await bcrypt.hash(this.password , 10)
    return decryptedpwd
}

userSchema.methods.validatePassword = async function(password){
    const isCorrectPassword = await bcrypt.compare(password , this.password)
    if (!isCorrectPassword){
        throw new Error('Invalid Password')
    }
    return isCorrectPassword
}

module.exports = User