exports.checkUserLogin = (req, res, next) => {
    if (req.session == undefined || req.session.username == undefined ) {
     return  res.redirect("/login");
    }
    next();
  }
  
exports.checkAdminLogin = (req, res, next) => {
    if (req.session == undefined || req.session.username == undefined) {
      res.redirect("/admin");
    }
    next();
  }