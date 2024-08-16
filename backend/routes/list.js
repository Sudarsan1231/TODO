const router = require("express").Router();
const User = require("../model/user");
const List = require("../model/list");
const list = require("../model/list");

//create
router.post("/addTask",async (req,res) =>{
    try {
        const { title, body, email } = req.body;
        const exsistingUser = await User.findOne({email});
        if(exsistingUser)
        {
            const list = new List({title , body, user: exsistingUser });
            await list.save().then(()=>res.status(200).json({list}));
            exsistingUser.list.push(list);
            exsistingUser.save();
        }
    } catch (error) {
        console.log(error);
    }
});

//update
router.put("/updateTask/:id",async (req,res) =>{
    try {
        const { title, body, email } = req.body;
        const exsistingUser = await User.findOne({email});
        if(exsistingUser)
        {
            const list = await List.findByIdAndUpdate(req.params.id,{title,body});
            list.save().then(()=>res.status(200).json({message: "Task Updated..."}))
        }
    } catch (error) {
        console.log(error);
    }
});

//delete
router.delete("/deleteTask/:id",async (req,res) =>{
    try {
        const { email } = req.body;
        const exsistingUser = await User.findOneAndUpdate({email},{$pull: {list: req.params.id}});
        if(exsistingUser)
        {
            const list = await List.findByIdAndDelete(req.params.id)
            .then(()=>res.status(200).json({message: "Task Deleted..."}))
        }
    } catch (error) {
        console.log(error);
    }
});

//get Task
router.get("/getTasks/:id",async (req,res) =>{
    const list = await List.find({user: req.params.id}).sort({createdAt: -1});
    if(list.length!=0){
        res.status(200).json({list:list})
    }
    else{
        res.status(200).json({message:"No Task..."});
    }
})
module.exports = router;