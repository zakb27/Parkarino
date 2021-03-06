const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Admin','addPark.html'));
});

router.post('/',jsonParser, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let parks = JSON.parse(data);
    console.log(req.body);
    for(let i = 0; i < parks.locations.length; i++) {
        if (parks.locations[i].name === req.body.name){
            console.log("Already exists");
            return res.status(300).json("Already exists");
        }
    }
    if(!req.body.location){
        return res.status(400).json("No location given");
    }
    req.body._id = parks.locations.length;
    parks.locations.push(req.body);
    data = JSON.stringify(parks,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','carpark_db.json'), data,"utf-8");
    return res.status(200).json("Successfully created");

});
module.exports = router;