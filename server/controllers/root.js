module.exports = (req, res) => {
  res.render('index', {
    page: "Root", 
    pretty: true
  });
}
