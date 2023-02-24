const express = require("express");
const app = express();
const tasks = [];
const mongoose = require("mongoose");
const parser = require("body-parser");

app.use(parser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://harwinsodhi33:c1013333@cluster0.lbglpii.mongodb.net/toDoDB");

const schema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item", schema);
const listSchema = new mongoose.Schema({
    title: String,
    content :[schema]
});
let fDay;
const List = mongoose.model("List",listSchema);
app.set("view engine", "ejs");
app.get("/", (req,res)=>{
    const date = new Date();
    const options = {weekday:'long',
                     month:'long',
                     day: 'numeric'};

    fDay = date.toLocaleString('en-US',options);
    Item.find((err, coll)=>{
        res.render("home", {day : fDay, array : coll});
    });
    
});
app.post("/delete",(req, res)=>{
    const title1 = req.body.hidden1;
    const id = req.body.checkbox;
    console.log(title1 +" "+ id);
    if(title1 === fDay){
    setTimeout(()=>{
        Item.findByIdAndRemove(id,err=>{  
        });
        res.redirect("/");
    },900);
}
else{
    console.log("here")
    List.findOneAndUpdate({title : title1 },{ $pull : {content : {_id : id}}},(err, l1)=>{
        if(!err){
            res.redirect("/"+title1);
        }
        else{
            console.log("err");
        }
    });
}
    
})
app.get("/:topic",(req, res)=>{
    const param = req.params.topic;
    console.log("still right");
    List.findOne({title : param}, (err,obj)=>{
        if(!obj){
            const newList = new List({
                title : param,
                content : []
            });
            newList.save();
            console.log("created");
            res.render("home", {day : param, array : []});
        }
        else{
            console.log("final rihgt");
            res.render("home", {day : param, array : obj.content});
    }
    });

});

app.post("/", (req, res)=>{
    const img = req.body.img2;
    console.log(img+" finding");
    if(img === fDay){
        new Item({
            name : req.body.item
        }).save();
        
        res.redirect("/");
        }
    else{
        List.findOne({title : img}, (err, l1)=>{
            if(l1){
                console.log("right  spot")
                l1.content.push(new Item({
                    name : req.body.item
                }));
                l1.save();
                res.redirect("/"+img);
            }
            else{
                console.log("none");
            }
            
        });
    }
})

app.listen(3000);