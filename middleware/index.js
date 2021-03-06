const Campground=require('../models/campground');
const Comment = require('../models/comment');

// all the middlewares goes here
const middlewareObj={};

middlewareObj.checkCampgroundOwnership=(req,res,next) => {
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id,(err,foundCampground) =>{
                    if(err){
                        req.flash("error","Campground not found")
                        res.redirect("back");
                    }
                    else{
                        //does the user owns the campground
                        if(foundCampground.author.id.equals(req.user._id)){
                          next();
                        }
                        else{
                            req.flash("error","You don't have permission to that")
                            res.redirect("back");
                        }
                    }
            })
        }
                   else
            {
                      req.flash("error","You need to be logged in to do that")
                       res.redirect("/login")
                   }
 }   

middlewareObj.checkCommentOwnership=(req,res,next) => {
        if(req.isAuthenticated())
        {
            Comment.findById(req.params.comment_id,(err,foundComment) =>{
                    if(err){
                        res.redirect("back");
                    }
                    else{
                        //does the user owns the comment?
                        if(foundComment.author.id.equals(req.user._id)){
                          next();
                        }
                        else{
                            req.flash("error","you dont have permission to do that")
                            res.redirect("back");
                        }
                    }
            })
        }
                   else
            {            req.flash("you need to be logged in to do that")
                       res.redirect("/login")
                   }
 }   

middlewareObj.isloggedIn=(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You must need to login to do that");
        res.redirect("/login")
    }
    
module.exports=middlewareObj