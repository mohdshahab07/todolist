const express = require("express");
const ejs = require("ejs");
const { Router } = require("express");

const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
//let item="";
// let items = [];
let workitems = [];
// making an empty array.

app.use(express.static("public"));
// using this we tell express to use the static files that were present in "public" folder. 
// in public folder we keep our css Files,image Files and javaScript files that were linked to html or ejs files so that we can see the effect of these files.
// without telling express to use static files, the CSS,img,js effect in html or ejs will not showed.   

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-mohdshahab:SABU%40kv2@cluster0.bmgof.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
}; 

const Listitem = mongoose.model("Listitem", itemsSchema);

const item1 = new Listitem({
    name: "welcome to your todolist"
});

const item2 = new Listitem({
    name: "hit this button to add new item"
});

const item3 = new Listitem({
    name: "hit this button to delete an item"
});

const defaultItems = [item1, item2, item3];



app.get("/", function (req, res) {

    Listitem.find({}, function (err, founditems) {
        if (err) {
            console.log(err);
        }

        else {
            if (founditems.length === 0) {
                Listitem.insertMany(defaultItems, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("successfully saved default items to database");
                    }
                });
            }

            else {
                console.log(founditems);
            }

            let dailyschedule = "Today"
            res.render("list_1_with_styling", {
                worklist: dailyschedule,
                additem: founditems
            });
        }
    });






    // rendering list_1_with_styling.ejs and assigning date as day and additem as an array items. 

});

app.post("/", function (req, res) {
    var item = req.body.newitem;
    console.log(item);

    const addeditem=new Listitem({
        name:item
    });

    addeditem.save();

    // items.push(item);
    // each time adding the item to the array "items". 

    res.redirect("/");
    // redirect to home route when making a post request to home route. redirected to home route means making get request to the home route again. 
    // means code goes to line 19.

});

app.post("/delete",function(req,res){
    console.log(req.body.checkbox);
    let checkeditemid=req.body.checkbox;
    let listtitle=req.body.listtitle;

    if(listtitle=="Today"){
    Listitem.findByIdAndRemove(checkeditemid,function(err){
        if(!err){
        console.log("successfully deleted checked item");
        res.redirect("/");
        }
    });
}

else{
    Otherlist.findOneAndUpdate({name:listtitle},{$pull:{items:{_id:checkeditemid}}},function(err,founditem){
        if(!err){
            res.redirect("/"+listtitle);
        }
    })
}
});

const listSchema = {
    name:String,
    items:[itemsSchema]
}

const Otherlist=mongoose.model("Otherlist",listSchema);

app.get("/:customList",function(req,res){
    const newlist =req.params.customList;
    console.log(newlist);

    if(newlist=="favicon.ico"){
        console.log("ignore the favicon ")
    }

    else{
    Otherlist.findOne({name:newlist},function(err,foundlist){
        if(err){
            console.log(err);
        }

        else{
            if(!foundlist){
                console.log("list doesn't exist");
                const alterlist=new Otherlist({
                    name:newlist,
                    items:defaultItems
                });
                alterlist.save();
                res.redirect("/"+newlist);
            }

            else{
                console.log("list already exists");
                res.render("list_1_with_styling",{
                    worklist:newlist,
                    additem:foundlist.items
                })
            }
            
        
        }
    })
}
})

app.post("/customroute",function(req,res){
    const routename=req.body.rname;
    const listitemname=req.body.newitem;
    console.log(routename);

    const toadd=new Listitem({
        name:listitemname
    })

    Otherlist.findOne({name:routename},function(err,foundlist){
        foundlist.items.push(toadd);
        foundlist.save();
        res.redirect("/"+routename);
    })
    
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function(){
    console.log("server has started successfully");
});







// https://evening-cliffs-48874.herokuapp.com