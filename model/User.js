import { Schema, model, connect } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import env from "dotenv"

let { isEmail } = validator;

//* env file
env.config();

//! Schema
let userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please inter your email"],
    unique: true,

    //? to make sure its a valid email
    validate: [isEmail, "Please inter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please inter a password"],
    minlength: [8, "The password must be more then 7 characters"],
  }

}, { timestamps: true });

//? Fire this function after a document has created
userSchema.post("save", (document, next) => {
  console.log(` A document has been successfully created ${document} `);
  next();
});

//? Fire this function before a document has created
userSchema.pre("save", async function (next) {

  let salt = await bcrypt.genSalt();  //! 1
  this.password = await bcrypt.hash(this.password, salt); //! 2

  next();
  
  /** Hashing. is making a cipher to what we want to cipher: 
   *? sign-up
   *! 1- We take the password and hash it with a hashing algorithm(bcrypt).
   *! 2- We add salt(plain characters) to the hashed password.  
  */
});

//! Model
export let User = model("user", userSchema);

//! Connecting to mongodb
let uri = process.env.uri;

export let Do = async (callback) => {
  try {
    await connect(uri);
    console.log(`connected to mongodb`);
    
    callback();
  } 
  catch (err) {
    console.log(err);
  }
};
