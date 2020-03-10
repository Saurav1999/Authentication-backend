const jwt = require('jsonwebtoken')
module.exports = (req,res,next) => {
    console.log("running middleware")
    const authHeader = req.get("Authorization");
    if(!authHeader){
        req.isAuth = false;
        console.log("passed1")
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token || token === ''){
        console.log("passed2")
        req.isAuth = false;
        return next();
    }
    console.log("token")
    console.log(token)
    let decodedToken;
    try {
        console.log("verifying")
        decodedToken = jwt.verify(token,'somesupersecretkey');
        console.log("passed3")
    }
    catch (err){
        req.isAuth = false;
        console.log("passed4")
        return next();
    }
    if(!decodedToken){
        console.log("decodeToken")
        console.log(decodedToken)
        req.isAuth = false;
        console.log("passed4")
        return next();
    }
    console.log("passed5")
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();

    
};