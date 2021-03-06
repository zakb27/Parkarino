const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Account','registration.html'));
});

router.post('/',jsonParser, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);

    for(let i = 0; i < users.user.length; i++) {
        if (users.user[i].email === req.body.email || users.user[i].username ===req.body.username ){
            return res.status(300).json("Details already exist");
        }
        if (users.blacklist.includes(req.body.email)){
            return res.status(500).json("In blacklist");
        }
    }

    req.body._id = users.user.length;
    users.user.push(req.body);
    data = JSON.stringify(users,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
    return res.status(200).json("Saved correctly");


});
module.exports = router;