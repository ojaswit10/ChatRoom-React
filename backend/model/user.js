const {Schema, model} = require("mongoose");
const {createHmac , randomBytes} = require("crypto");
const {createTokenForUser} = require("../service/auth")

const userSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required: true,
        unique : true,
    },salt : {
       type : String
    },
    password : {
        type : String,
        required : true,
    },

},{timeStamps : true}
);

//now before we save it in mongo we make a secure pass
//we have now made a salt and pass in our mongodb
userSchema.pre("save" ,function (next){
    const user = this;
    //checks if it has been changed since its loaded
    if(!this.isModified("password")) return ;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();

});

//now we fetch data from mongo using any entered login params
userSchema.static("matchPassAndGenToken", async function(email,password){
    const user = await this.findOne({email});
    if(!user) return new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPass = createHmac("sha256" , salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedPass)
        throw new Error("Incorrect Password");

    const token =  createTokenForUser(user);

    return token;
    
}  )

const User = model("user" , userSchema);

module.exports = User;
