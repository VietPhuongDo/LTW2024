const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function (req,res,next) {
    //get token in header
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg: 'Denied authorization'});
    }

    //verify token
    try{
        const decoded = jwt.verify(token,config.get('jwtToken'));

        req.user = decoded.user;
        next()
    }
    catch (err){
        res.status(400).json({msg: 'Token is not valid'})
    }
}