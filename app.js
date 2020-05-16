const express= require("express")
const    app = express()
const     path=require('path')
const     serveStatic = require('serve-static')
const     bodyParser=require('body-parser')
const      mongoose=require('mongoose')
const      flash=require('connect-flash')
const    passport=require('passport')
const     methodOverride=require('method-override')
const     LocalStretegy=require('passport-local')
const     session=require('express-session')
const     Campground=require("./models/campground")
const      Comment=require("./models/comment")
const      User=require('./models/user')
const      port=process.env.PORT || 3000;
      
     
      

        //REQUIRING

      const commentRoutes= require('./routes/comments');
      const campgroundRoutes =require('./routes/campgrounds');
      const indexRoutes=require("./routes/index")
      //PASSPORT CONFIGURATION
mongoose.connect("mongodb+srv://Abhay2808:Abhay2808@123@yelpcamp-b13mb.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(session({
    secret:"Rusty cat",
    resave:false,
    saveUninitialized:false
}))
app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());   
app.use((req,res,next) =>{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
}) 
app.use(flash());   
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds",campgroundRoutes);

passport.use(new LocalStretegy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(port,(req,res) => {
    console.log("server is strted");
})