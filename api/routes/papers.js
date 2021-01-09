const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const apiadapter = require('./apiadapter');
//const BASE_URL = 'http://localhost:8088';
//const api = apiadapter(BASE_URL);
const Paper = require('../models/paper');
router.get('/',(req,res,next)=>{
  Paper.find()
   .select('name author _id')
   .exec().then(docus=>{
    const response = {
      count : docus.length,
      papers : docus.map(doc => {
         return {
             name : doc.name,
             author : doc.author,
             _id : doc._id,
             request :{
                 type : 'GET',
                 url : 'http://localhost:8088/papers/' +doc._id
             }
          }
      })
  };
     res.status(200).json(response);
  })
   .catch(err=>{
       console.log(err);
       res.status(500).json({error : err})
   });
});

 
router.post('/',(req,res,next)=>{
    const paper = new Paper({
        _id : new mongoose.Types.ObjectId,
        name : req.body.name,
        author : req.body.author
    })
    paper.save().then(result=>
        {console.log(result);
        res.status(201).json({
            message : 'Uploaded paper succesfully',
            createdPaper : {
                name : result.name,
                author : result.author,
                _id : result._id,
                request : {
                       type : 'POST',
                       url : 'http://localhost:8088/papers/'+result._id
                }
            }
    })
})
    .catch(err=>
        {console.log(err);
    res.status(500).json({
      error : err
    });
})
});
router.get('/:paperid',(req,res,next)=>{
   const id = req.params.paperid;
 Paper.findById(id)
 .select('name author _id')
 .exec().then(doc =>{
    console.log(doc);
    if(doc){
    res.status(200).json({
        paper : doc,
        request : {
            type : 'GET',
            url : 'http://localhost:8088/papers'
        }
    });
    }else
    {
        res.status(404).json({message : 'No valid Data found'});
    }
})
 .catch(err=>{console.log(err);
res.status(500).json({error:err});
});
});
router.delete('/:paperid',(req,res,next)=>{
   const id = req.params.paperid;
    Paper.remove({_id : id})
    .exec().then(result => {
        res.status(200).json({
            message : 'Paper deleted',
            request : {
                type : 'POST',
                url : 'http://localhost:8088/papers/',
                body: {
                    name : 'String',
                    author : 'String'
                }
            }
        });
    }) 
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});
router.patch('/:paperid',(req,res,next)=>{
    const id = req.params.paperid;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Paper.update({_id:id},{$set : updateOps})
    .exec().then(result => {
        res.status(200).json({
            message : 'Paper Updated',
            request : {
                type : 'GET',
                url : 'http://localhost:8088/papers/' +id
            }
        });
    })
    .catch(err=>
        {console.log(err);
        res.status(500).json({
            error : err
        })
    })
})
module.exports = router;