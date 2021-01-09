const express = require('express');
const app = express();
const morgan = require('morgan');
const bparse = require('body-parser');
const mongoose = require('mongoose');
const paperRoutes = require('./api/routes/papers');
const peerreviewerRoutes = require('./api/routes/peerreviewers');
mongoose.connect("mongodb+srv://AbhirupsDatabase:"+process.env.MONGO_ATLAS_PW+"@cluster0.1ozfw.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority",
{ useNewUrlParser: true,useUnifiedTopology: true  }
);
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bparse.urlencoded({extended : true}));
app.use(bparse.json());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Header','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT');
        return res.status(200).json({});
    }
    next();
})
app.use('/papers',paperRoutes);
app.use('/peerreviewers',peerreviewerRoutes);
app.use((req,res,next)=>{
    const error = new Error('Not found');
      error.status = 404;
      next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error :{
            message :error.message
        }
    })
})
module.exports = app;