import {Router} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../model/User.js";

let AuthRoutes = Router();

//! SignUp page
AuthRoutes.get("/sign-up" , async(req , res)=>{
    
    res.render("Auth/SingUp.ejs")  
});

//! LogIn page
AuthRoutes.get("/log-in" , (req , res)=>{
    
    res.render("Auth/LogIn.ejs")
});

//! Create a new user
AuthRoutes.post("/sign-up" , async (req , res)=>{
    try{
        let {email , password} = req.body;

        let user = await User.create({email , password});

        /** 1
          *TODO: After user has been created , now we 1-create a jwt and 2-sends it to the browser
          *TODO: inside a cookie . means that this user is loggedIn.
        */
       
        let threeDays = 60 * 60 * 24 * 3 ;  
        let id = user._id;

        //? Creating a JWT
        let token = jwt.sign({id} , "The secret" , {expiresIn:threeDays});

        //? Sending the token in a cookie
        res.cookie("jwt" , token , {httpOnly:true , maxAge:1000 * threeDays});

        //? The response
        res.json({ TheUserId:user._id,  jwt:"jwt has been created" ,  successful:"User has been created successfully" });

    }catch (err){
    
        //? object to store the errors in it ,so we can send them 
        let Errors = {}

        //* For a validation errors 
        if(err.message.includes("user validation failed")){
            
            //* To understand it more log err.errors
            Object.values(err.errors).forEach((error)=>{
                Errors[error.properties.path] = error.message;
            })
        }
        //* For a unique email error 
        else if(err.code === 11000){
            Errors["email"] = "This email already exists";
        }
        else{
            //TODO: this syntax create a new property in a object
            Errors["error"] = "Some error happened I do`nt know what it is";
            console.log(err);
        }
        
        res.json(Errors)
    }
});

//! Authenticate a current user
AuthRoutes.post("/log-in" , async (req , res)=>{

    let {email , password} = req.body;

    let user = await User.findOne({email:email})
    
    //! Sending errors to an object
    /* let Errors = {}
    if(user){
        //* This function returns true if correct , false if incorrect
        let auth = await bcrypt.compare(password , user.password);

        if(auth === true ){
            res.json({ user:user._id , successful:"you have successfully logged in"})
        }
        else{ Errors["password"] = "Incorrect password " }
    }
    else{ Errors["email"] = "There is no such an email" }
    res.json(Errors)
    */
    

    //! Throwing errors to the catch
    try{
        if(user){
            //* This function returns true if correct , false if incorrect
            let auth = await bcrypt.compare(password , user.password);
    
            if(auth === true ){
                /** 1
                    *TODO: After user has been created , now we 1-create a jwt and 2-sends it to the browser
                    *TODO: inside a cookie . means that this user is loggedIn.
                */
                let threeDays = 60 * 60 * 24 * 3 ;  
                let id = user._id;

                //? Creating a JWT
                let token = jwt.sign({id} , "The secret" , {expiresIn:threeDays});
        
                //? Sending the token in a cookie
                res.cookie("jwt" , token , {httpOnly:true , maxAge:1000 * threeDays});
                
                res.json({ user:user._id , successful:"you have successfully logged in"})
            }
            else{ throw Error("Incorrect password ") }
        }
        else{ throw Error("There is no such an email") }
    
    }catch (err){
        res.json({error:err.message});
    }
    
});

//! Log user out
AuthRoutes.get("/log-out" , (req , res)=>{

    /**   
      *TODO Replacing the token that was created when a user logged in , with an empty token with short
      *TODO Which means we are deleting it.
    */ 
    res.cookie("jwt" , "" , { maxAge:1 });
    
    res.redirect("/");
});

export default AuthRoutes;


