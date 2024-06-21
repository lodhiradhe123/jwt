var express = require("express");
var router = express.Router();


const User = require("../model/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

const expressSession=require('express-session');
const flash = require('connect-flash');


/* GET home page. */
router.post("/register", async function (req, res, next) {
  try {
    const { name, username, password, email } = req.body;
    if (!(name && username && password && email)) {
      res.send(400).send("all field are required");
    }

    // const existUser = await User.find({ email: email });
    // if (existUser) {
    //   res.send(400).send("user is already registerred with this mail address");
    // }
    // bcrypt the password
    const myEncryptPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: myEncryptPassword,
      email,
    });

    // generate a token
    const token = jwt.sign({ id: user._id, email }, "shhhhh", {
      expiresIn: "2h",
    });

    // set cookie
    res.cookie("token",token)
    // browser pe dikhane k liye🤣🤣🤣🤣🤣🤣
    // user.token = token;
    user.password = undefined;
    res.send(user);

  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    // get all date from user
    const { email, password } = req.body;
    // validation
    if (!(email && password)) {
      res.status(400).send("all field are required");
    }
    // find user un db
    const user = await User.findOne({ email: email });
    // if is not there, then what
    if (!user) {
      res.status(400).send("user not registered");
    }
    // match the password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, email }, "shhhhh");
      user.token = token;
      user.password = undefined;
      res.cookie("token", token);
      res.send("user logged in successfully")

    }else{
      res.send("email or password incorrect");
    }
    // send a token
    // cookie section
    // const options = {
      //   expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      //   httpOnlt: true,
      // };
      // res.send("user logged in successfully")
  } catch (error) {
    console.log(error.message);
  }
});

 function  isLoggedIn(req, res,next) {
  if (!req.cookies.token) {
    res.send("you are not logged in")
  }
  try {



    var decoded=jwt.verify(req.cookies.token, "shhhhh",) 
      var user =  User.findOne({email: decoded.email}).select("-password")
      req.user = user;

      next();


  } catch (error) {
    console.log(error.message);
  }

}

router.get("/profile",isLoggedIn, function(req, res) {
  try {
    // res.send("profile")

  res.send("profile page")
  // res.send("this is profilepage");
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/logout',  function(req, res) {
 try {
  res.cookie("token","");
  res.send("user logged out successfully")
 } catch (error) {
  console.log(error.message);
 }
})

module.exports = router;
