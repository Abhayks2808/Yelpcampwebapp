const express = require('express');
const router = express.Router();
const Campground=require('../models/campground');
const middleware=require('../middleware')


//INDEX  :show all Campgrounds
router.get("/",(req,res) =>{
    //get Campground data from database
    Campground.find()
    .then((campgrounds) =>{
        res.render("campgrounds/index",{campgrounds:campgrounds})
    })
    .catch((err) =>{
        console.log('Error:',err)
    })
// res.render("campgrounds",{campgrounds:campgrounds})
})
//create route : add new campground to database
router.post("/",middleware.isloggedIn,(req,res) => {

   const name=req.body.name;
    const image=req.body.image;
    const description= req.body.description;
    const price=req.body.price;
    const author ={
        id:req.user._id,
        username:req.user.username
    }
    const newCampground={
        name:name,
        image:image,
        description:description,
        price:price,
        author:author
    }
//create a new Campground
Campground.create(newCampground).then(() => {    
//redirect back to

 res.redirect("/campgrounds")
})
.catch((err) =>{
    console.log('Error:',err);
})
})
//New:Show form to crete new campground
router.get("/new",middleware.isloggedIn,(req,res) => {
    res.render("campgrounds/new")
});
router.get("/:id",(req,res) =>{
    //find the campground with provided Id
    Campground.findById(req.params.id).populate("comments")
    .exec((err,FoundCampground) =>{
        if(err){
            console.log("Error:",err)
        }
        else{

        
        //render show template with that campground
        res.render("campgrounds/show",{campground:FoundCampground})
        }
    })
    
})


//EDIT CAMPGROUND ROUTE
router.get("/:id/Edit",middleware.checkCampgroundOwnership,(req,res) =>{
    Campground.findById(req.params.id)
    .then((foundCampground) =>{
            res.render("campgrounds/Edit",{campground:foundCampground});
        })
    
     .catch((err) =>{
         res.redirect("/campgrounds")
     })

    });
//update campgroung route      
router.put("/:id",middleware.checkCampgroundOwnership,(req,res) =>{
      const UpdateCampground={
        name:req.body.name,
        image:req.body.image,
        description:req.body.description,
        price:req.body.price
    }
    Campground.findByIdAndUpdate(req.params.id,UpdateCampground)
    .then(() =>{
        res.redirect("/campgrounds/"+ req.params.id);
    })
    .catch((err) =>{
        res.redirect("/campgrounds")
    })
})
//DELETE CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res) =>{
    Campground.findByIdAndRemove(req.params.id)
    .then(() =>{
        res.redirect("/campgrounds");
    })
    .catch((err) =>{
        res.redirect("/campgrounds");
    })
})


module.exports = router;
 