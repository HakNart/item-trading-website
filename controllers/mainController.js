
exports.showWelcomePage = (req,res) => {
  res.render('./index');
}
exports.showAboutPage = (req,res) => {
  res.render('./about');
}
exports.showContactPage = (req,res) => {
  res.render('./contact');
}