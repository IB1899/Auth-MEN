import {Router} from "express";
import {AuthenticatedPages } from "../middleware/AuthMiddleCheck.js";

let BasicRoutes = Router();


//! Home page
BasicRoutes.get("/" ,(req, res) => {

    //* Passing data to our Home page 1
    res.locals.a = "any data";
    
    //* Passing data to our Home page 2
    let b = "any data";
    
    res.render("Home.ejs" , {b} );
});


//! About page , Can only be accessed by logged in users(has jwt)
BasicRoutes.get("/about" , AuthenticatedPages , (req , res)=>{

    res.render("About.ejs");
});
  

//! Cookies
BasicRoutes.get("/set-cookies" , (req , res)=>{

  //TODO create a cookie  
  res.cookie('cookie 1' , false);
  res.cookie('cookie 2' , true , { maxAge:1000 * 60 * 60 * 24 , secure:true  , httpOnly:true}); 

  //TODO read cookies
  let cookies = req.cookies;

  res.json(cookies);
})


export default BasicRoutes;