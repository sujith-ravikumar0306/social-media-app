import bcrypt from "bcrypt";    //encrypt the password
import jwt from "jsonwebtoken";  //send user a web token for authorisation
import user from "../models/user.js";

/*REGISTER USER */

//req-> request body from backend, res->response sent to frontend
export const register = async (req,res) => {
    try{
        const{
            firstname,
            lastname,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();    //use the salt to encrypt the password
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new user({
            firstname,
            lastname,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*10000),
            impressions:Math.floor(Math.random()*10000)
        });

        const savedUser = await new user.save();
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json({ error:err.message })
    }
}

/*LOGGING IN */

export const login = async(req,res) => {
    try{
        const { email, password } =req.body;
        const user = await User.findOne({email: email});    //using mongoose trying to find a specific email
        if(!user)
        {
            return res.status(400).json({msg : "User does not exist!"}); 
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
           return res.status(400).json({msg: "Password does not match!"});
        } 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
        delete user.password;   //make sure password is not sent to frontend
        res.status(200).json({token, user});

    }catch(err)
    {
       res.status(500).json({error: err.message});
    }
}