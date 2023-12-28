const isLogin= function(req,res,next){
    if (!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    } 
    next();
}
const isAdmin= function(req,res,next){
    if (req.session.username!="admin") {
        res.redirect("/");
        return;
    } 
    next();
}

module.exports={
    isLogin,
    isAdmin
}