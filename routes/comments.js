const express = require('express');
const router =express.Router({mergeParams: true});
const Campground =require('../models/campground');
const Comment = require('../models/comment')
const middleware=require('../middleware')

//COMMENTS NEW
router.get("/new",middleware.isloggedIn,(req,res) =>{
//find Campground by id
Campground.findById(req.params.id)
.then((campground) =>{
res.render("comments/new",{campground:campground});
})
.catch((err) =>{
console.log(err);
})
})

//COMMENTS CREATE
router.post("/",middleware.isloggedIn,(req,res) =>{
    const comment={
        text:req.body.text
    }
   
    //lookup campground usingID
    Campground.findById(req.params.id)
    .then((campground) =>{
           Comment.create(comment)
           .then((comment) =>{
               //add 
               comment.author.id =req.user._id;
               comment.author.username=req.user.username;
               comment.save();
               
              campground.comments.push(comment);
              campground.save();
              req.flash("success","successfully created comment")
              res.redirect('/campgrounds/'+ campground._id);
           })
           .catch((err) =>{
               req.flash("error","campground not found");
               console.log(err);
           })
    })
    .catch((err) =>{
        console.log(err);
        res.redirect("/campgrounds");
    })
})
//Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res) =>{
Campground.findById((req.params.id),(err,Campground)=>{
if(err){
    res.redirect("/campgrounds");
}
else{
    Comment.findById(req.params.comment_id,(err,foundComment) =>{
         if(err){
             res.redirect("back");
         }
         else{
             res.render("comments/edit",{campground:Campground,comment:foundComment})
         }
    })
}
})
})
//Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res) =>{
   const comment={
        text:req.body.text
    }
    Comment.findByIdAndUpdate(req.params.comment_id,comment,(err,updatedComment)=>{
         if(err){
             res.redirect("back");
         }
         else{
             req.flash("success","successfully edited comment");
             res.redirect("/campgrounds/"+ req.params.id);
         }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res) =>{
    //findbyiDandremove
    Comment.findByIdAndRemove(req.params.comment_id)
    .then((deletecomment) =>{
        req.flash("success","comment deleted")
        res.redirect('back');
    })
    .catch((err)=>{
        res.redirect('back');
    })
})

module.exports = router;

