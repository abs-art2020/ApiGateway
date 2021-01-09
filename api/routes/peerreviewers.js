const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
/*const apiadapter = require('./apiadapter');
const BASE_URL = 'http://localhost:8000';
const api = apiadapter(BASE_URL);*/
const Peerreviewer = require('../models/peerreviewer');
router.get('/',(req,res,next)=>{
    Peerreviewer.find()
   .select('nameofreviewer paper _id')
   .exec()
   .then(docus=>{
      const response = {
        count : docus.length,
        peerreviewers : docus.map(doc => {
           return {
            nameofreviewer : doc.nameofreviewer,
            paper : doc.paper,
               _id : doc._id,
               request :{
                   type : 'GET',
                   url : 'http://localhost:3000/peerreviewers/' +doc._id
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
router.post('/',(req,res,next)=>
{
    const peerreviewer = new Peerreviewer({
        _id : new mongoose.Types.ObjectId,
        nameofreviewer : req.body.nameofreviewer,
        paper : req.body.paper
    })
   
    peerreviewer.save().then(result=>
        {console.log(result);
        res.status(201).json({
            message : 'Reviewer acknowledge',
            createdPaper : {
                nameofreviewer : result.nameofreviewer,
                paper: result.paper,
                _id : result._id,
                request : {
                       type : 'POST',
                       url : 'http://localhost:3000/peerreviewers/'+result._id
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
router.get('/:peerreviewerid',(req,res,next)=>{
   const id = req.params.peerreviewerid;
  
 Peerreviewerid.findById(id)
 .select('nameofreviewer paper _id')
 .exec().then(doc =>{
     console.log(doc);
     if(doc){
     res.status(200).json({
         paper : doc,
         request : {
             type : 'GET',
             url : 'http://localhost:3000/peerreviewers'
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
router.delete('/:peerreviewerid',(req,res,next)=>{
   const id = req.params.peerreviewerid;
   Peerreviewer.remove({_id : id})
    .exec().then(result => {
        res.status(200).json({
            message : 'Paper deleted',
            request : {
                type : 'POST',
                url : 'http://localhost:3000/peerreviewers/',
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
router.patch('/:peerreviewerid',(req,res,next)=>{
    const id = req.params.peerreviewerid;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Peerreviewer.update({_id:id},{$set : updateOps})
    .exec().then(result => {
        res.status(200).json({
            message : 'Paper Updated',
            request : {
                type : 'GET',
                url : 'http://localhost:3000/peerreviewers/' +id
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