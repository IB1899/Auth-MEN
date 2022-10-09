import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

/** 
   *? Middleware for viewing pages by only Authenticated users, 
   *! Block the code if the user does`nt have jwt.
   *! Allow the code if the user has a jwt.
*/
let AuthenticatedPages = (req, res, next) => {

    let token = req.cookies.jwt;

    //? If user has a jwt do this
    if (token) {
        jwt.verify(token, "The secret", (err) => {

            //? If user has a valid jwt do this
            if (!err) {
                next();
            }
            //? If user does`nt have a valid jwt do this
            else {
                console.log(` Not valid token `);
                res.redirect("/log-in");
            }
        })
    }
    //? If user does`nt have a jwt do this
    else {
        console.log(` There is no token`);
        res.redirect("/log-in")
    }
};

/** 
   *? Middleware for passing user`s data to all urls, if a user has jwt.
   *? so we can access the data of a logged in user from any url. 
   *! Allow the code if the user not logged in, don`t do anything else.
   *! Allow the code if the user has a jwt , and pass their data to the views.
*/
let CheckToken = (req, res, next) => {

    let token = req.cookies.jwt;

    //? If user has a jwt do this
    if (token) {

        jwt.verify(token, "The secret", async (err, decodedToken) => {

            //? If user has a valid jwt do this
            if (!err) {
                //! we can access the user`s id from the token.
                let id = decodedToken.id;

                //* Getting the user`s data , and passing it to the views
                let user = await User.findOne({ _id: id });
                res.locals.user = user;

                next();
            }
            //? If user does`nt have a valid jwt do this
            else {
                res.locals.user = null;
                next(); //* Allow the code if jwt is not valid , don`t do anything else.
            }
        })
    }
    //? If user does`nt have a jwt do this
    else {
        res.locals.user = null;
        next(); //* Allow the code if the user does`nt have jwt , don`t do anything else.
    }
};

export { AuthenticatedPages, CheckToken };