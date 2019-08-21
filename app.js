var express= require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var methodOverride = require('method-override');


// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));          // _method can be replaced with any other name.


//Depriciation Warnings -- Solutions
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



var blogSchema = new mongoose.Schema({
	title : String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	name: "My First Blog" ,
// 	image:"https://cdn.pixabay.com/photo/2015/06/01/09/04/blog-793047_960_720.jpg",
// 	body:"This is a blog post and it's also my first blog"
// 	 }, function(err, camp){
// 	if(err)
// 	console.log(err);
// 	 else
// 	 console.log("blogs have been added");
// 	 console.log(camp);
// 	 });

app.get('/',function(req,res){
	res.redirect('/blogs');
});
//INDEX Route
app.get('/blogs',function(req,res){
	Blog.find({},function(err,allBlogs){
		if(err)
			console.log(err);
		else{
			res.render('index', {blogs : allBlogs});
		}
	});
});


// NEW Route
app.get('/blogs/new',function(req,res){
	res.render("new");
});


// CREATE ROUTE
app.post("/addBlogs",function(req, res){
	Blog.create(req.body.blog ,function(err, newBlog){  
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	});

});

// SHOW ROUTE
app.get('/blogs/:id',function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				console.log(err);
			}else{
				res.render("show", {blogs : foundBlog});
			}
			});	
});


// EDIT ROUTE
app.get('/blogs/:id/edit', function(req,res){
	Blog.findById(req.params.id, function(err, editBlog){
		if(err){
			console.log(err);
		}else{
			res.render("edit", {blogs : editBlog});
		}	
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
           console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err)
			console.log(err);
		else
			res.redirect('/blogs');
	});
});

app.get('*', function(req,res){
res.send("Sorry!! Page not found");
});

app.listen(3000,function(){
	console.log("server started");
});