import express from "express";
import cookieParser from "cookie-parser";

import { CheckToken } from "./middleware/AuthMiddleCheck.js";
import AuthRoutes from "./controller/Auth.js";
import BasicRoutes from "./controller/Basics.js";


//* Express app
let app = express();

//* Template engine for ejs
app.set("view engine", "ejs");

//* Middleware for cookies
app.use(cookieParser());

//* Middleware for public
app.use(express.static("public"));

//* Compile json into JsObject
app.use(express.json());

//* Middleware, apply this function for every get request.
app.get("*", CheckToken);

//* Connecting to mongodb
import { Do } from "./model/User.js";
Do(() => app.listen(3001));


//? Basic pages
app.use(BasicRoutes);

//? Auth pages
app.use(AuthRoutes);
