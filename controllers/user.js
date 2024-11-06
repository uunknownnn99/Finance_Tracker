const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const { setUser } = require("../services/user");

const secretKey = "Abhinav1409";

async function handleLogin(data, req, res) {
  const { email, password } = data;
  const user = await Users.findOne({ email, password });
  if (user == null) {
    return res.redirect('/?error="Invalid Username or Password"');
  }
  const id = jwt.sign(
    { email: user.email, name: user.name, id: user._id },
    secretKey
  );
  setUser(id, user);
  res.cookie("uid", id, { httpOnly: true, maxAge: 24 * 60 * 1000 });
  req.user = email;
  return res.redirect(`/finance`);
}

async function handleSignUp(data, req, res) {
  const { name, email, password } = data;
  try {
    var user = new Users({ name, email, password });
    await user.save();
  } catch (err) {
    return res.redirect(`/?error=${encodeURIComponent(err.message)}`); // Redirect on error with encoded message
  }
  return res.redirect(
    "/?error='Successfully Registered. Login in to Continue'"
  );
}

module.exports = { handleLogin, handleSignUp };
