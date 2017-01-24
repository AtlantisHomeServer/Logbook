// routes/posts.js

var express = require("express");
var router = express.Router();
var Post  = require("../models/Post");
var multer = require('multer');
var upload = multer({dest:'./tmp/'}); // multer 경로 설정, 파일이 업로드 되면 먼저 임시 폴더로 가서 저장됨

// Index
router.get("/", function(req, res){
 Post.find({})                  // 1
 .sort("-createdAt")            // 1
 .exec(function(err, posts){    // 1
  if(err) return res.json(err);
  res.render("posts/index", {posts:posts});
 });
});

// New
router.get("/new", function(req, res){
 res.render("posts/new");
});

// create
router.post("/", upload.array('UploadFile'), function(req, res){
  //field name은 form의 input file의 name과 같아야함
  var mode = req.param('mode');
  var title = req.body.title;
  var body = req.body.body;
  var upFile = req.files; // 업로드 된 파일을 받아옴

 Post.create(req.body, function(err, post){
  if(err) return res.json(err);
  res.redirect("/posts");
 });
});

// show
router.get("/:id", function(req, res){
 Post.findOne({_id:req.params.id}, function(err, post){
  if(err) return res.json(err);
  res.render("posts/show", {post:post});
 });
});

// edit
router.get("/:id/edit", function(req, res){
 Post.findOne({_id:req.params.id}, function(err, post){
  if(err) return res.json(err);
  res.render("posts/edit", {post:post});
 });
});

// update
router.put("/:id", function(req, res){
 req.body.updatedAt = Date.now(); // 2
 Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
  if(err) return res.json(err);
  res.redirect("/posts/"+req.params.id);
 });
});

// destroy
router.delete("/:id", function(req, res){
 Post.remove({_id:req.params.id}, function(err){
  if(err) return res.json(err);
  res.redirect("/posts");
 });
});

module.exports = router;
