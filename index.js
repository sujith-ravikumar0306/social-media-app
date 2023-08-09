/*MIDDLEWARES - It acts like the connective tissue between applications, data, and users.*/

import express from "express";          //create an instance of express server for application
import bodyParser from "body-parser";   //Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit.
import mongoose from "mongoose";        //include mongoose in our project and open a connection to the test database on our locally running instance of MongoDB.
import cors from "cors";                //Create a list of allowed origins (as strings). Add it as a "middleware" to your FastAPI application. ... Credentials (Authorization headers, Cookies, etc). 
import dotenv from "dotenv";            //a zero-dependency module that loads environment variables from a .env file into process.env.
import multer from "multer";            // adds a body object and a file or files object to the request object.
import helmet from "helmet";            //helps in securing express applications. It sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, etc.
import morgan from "morgan";            //It is a great tool that logs the requests along with some other information depending upon its configuration and the preset used. It proves to be very helpful while debugging and also if you want to create Log files.
import path from "path";                //The Path module provides a way of working with directories and file paths.
import { fileURLToPath } from "url";    //used to set paths when we configure directories .
import { error, log } from "console";
import { register } from "../social media app/controllers/auth.js";    //to create a request router.


/*CONFIGURATIONS*/ 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);         //use directory names to grab modules
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({  limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({  limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname, 'public/assets')));   //sets the path to directory to craete a local storage (to save images,etc)


/*FILE STORAGE*/

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename(req, file, cb){
        cb(null, file.originalname);
    }
}) ;
const upload = multer({ storage })


/*ROUTES WITH FILES */

app.post("/auth/register", upload.single("picture"),register);  //route to path to middleware function( upload picture locally),before hitting the endpoint(register-controller)



/*MONGOOSE SETUP*/

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT, ()=> console.log( `Server port : ${PORT}`));
}).catch((error) => console.log(`${error} did not connect to the server`));
