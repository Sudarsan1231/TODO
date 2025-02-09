const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");


//Sign UP
router.post("/register",async(req,res)=>{
    try {
        const {email,username,password} = req.body;
        const hashpassword = bcrypt.hashSync(password);
        const user = new User({email,username,password:hashpassword});

        await user.save().then(()=> res.status(200).json({user:user}));
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"User Already Exsist..."})
    }
});

//Sign In 

router.post("/signin",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user)
        {
            res.status(400).json({message:"Please SignUp First..."});
        }
        const isPasswordCorrect = bcrypt.compareSync(req.body.password,user.password)
        if(isPasswordCorrect)
            {
                res.status(400).json({message:"Password is Not Correct..."})
            }
            const {password,...others} = user._doc;
            res.status(200).json({others});

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"User Already Exsist..."})
    }
});

module.exports = router;
