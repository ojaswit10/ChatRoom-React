const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

//here im passing the user from the mongodb
//creating a payload and then making a token using secret and signing it with jwt
function createTokenForUser(user){
    const payload = {
       _id: user._id,
       email : user.email,
       fullName : user.fullName,
    };
    const token = JWT.sign(payload , secret);
    return token;
}

//getting the token from the frontend
function validateToken(token){
    const payload = JWT.verify(token , secret );
    return payload;
};

module.exports = {
    createTokenForUser ,
    validateToken,
}