const getHome = (req, res) => {
  res.render('index', { title: 'Drive Clone', user: req.user || null });
};

module.exports = {
  getHome,
};