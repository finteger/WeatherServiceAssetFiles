const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());


const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403);
    }
    try {
      const data = jwt.verify(token, "YOUR_SECRET_KEY");
      req.userId = data.id;
      req.userRole = data.role;
      return next();
    } catch {
      return res.sendStatus(403);
    }
  };




app.get("/login", (req, res) => {
    const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });
  });


  app.get("/logout", authorization, (req, res) => {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  });


  app.get("/protected", authorization, (req, res) => {
    return res.json({ user: { id: req.userId, role: req.userRole } });
  });




app.listen(3000);
