import bcrypt from "bcrypt";    //encrypt the password
import jwt form "jsonwebtoken";  //send user a web token for authorisation
import User from "../models/user.js";
import user from "../models/user.js";

/*REGISTER USER */

//req-> request body from backend, res->response sent to frontend
export const register = async (req,res) => {
    try{
        Const{
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
        res.status(500).json({ error:error.message })
    }
}