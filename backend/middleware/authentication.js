const {validateToken} = require("../service/auth");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {}

        return next();
    }
};

//for the chat route security
//here after authentication if logged in so req.user exists so chat route can be accessed
function requireAuth(req, res, next) {
 if(!req.user){
    //instead of redirecting send a json 
    return res.status(401).json({error : "Unauthorized"});
 }
 next();
}

module.exports = {
    checkForAuthenticationCookie,
    requireAuth,
}