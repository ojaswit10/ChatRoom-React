const {Router} = require("express");
const User = require("../model/user");
const {requireAuth} = require("../middleware/authentication");
const router = Router();

router.get("/me", requireAuth, (req, res) => {
  return res.json(req.user);
});

//Logout Route
router.get("/logout" , (req,res)=>{
    res.clearCookie("token");
    return res.json({message : "Logged out"});
})

//POST SignUp
router.post("/signup",async (req,res)=>{
try {
const {fullName , email , password } = req.body;
const user = await User.create({
    fullName,
    email,
    password,
});
const { password: pw, salt, ...userData } = user.toObject();
return res.status(201).json({message : "Signup succesful" , user : userData});
} catch (error) {
    return res.status(400).json({error : "Signup failed" , detail : error.message});
}
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Generate token (this also validates credentials)
        const token = await User.matchPassAndGenToken(email, password);
        
        // Find user again to get full data - using .lean() to get plain object
        const user = await User.findOne({ email }).lean();
        
        if (!user) {
            return res.status(401).json({ error: "Incorrect Email or Password" });
        }
        
        // Remove sensitive fields manually
        delete user.password;
        delete user.salt;
        delete user.__v; // Also remove version key
        
        // Set cookie
        res.cookie("token", token);
        
        // Log what we're sending (for debugging)
        console.log("📤 Sending user data:", user);
        
        // Return response with user data
        return res.json({ message: "Login Successful", user: user });
    } catch (error) {
        console.error("❌ Signin error:", error.message);
        return res.status(401).json({ error: "Incorrect Email or Password" });
    }
});

module.exports = router;