var express = require('express');
var routes = express.Router();

routes.get('/',(req,res,next)=>{
    res.render('dashboard')
});

module.exports = routes; 