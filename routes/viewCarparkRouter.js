const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const carpark_db = path.join(__dirname,'..','carpark_db.json');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','viewCarpark.html'));
});

//for specific carpark - not done yet
router.get('/carpark-info',jsonParser, (req, res) => {
    
    var carpark = req.body.carpark
    let complete = false;
    console.log("Recieved by router -> carpark : " + carpark);

    let data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);
    carparkData = [];

    for(i = 0; i < (carparkDb).length; i++) {
        if (users.user[i].email == email){
            complete = true;
            console.log("found " + email + " setting credit to " + parseInt(users.user[i].wallet) + " " + credit);
            users.user[i].wallet = parseInt(users.user[i].wallet) + credit;
            newData.push((users.user[i]));
            complete = true;
        }
        newData.push((users.user[i]));
    }
    data = JSON.stringify(users,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
   
    if (complete == true) 
    {
        return res.status(200).json(email);
    }
    else 
    {
        return res.status(401).json("~ you must log in or register to  add credit to your account ~");
    }
});

//for returning all carparks (for html select form options)
router.get('/all-carparks',jsonParser, (req, res) => {
    let complete = false;
    let data = fs.readFileSync(carpark_db, {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);
    carparksData = [];
    for(i = 0; i < carparks.locations.length; i++) {
        carparksData.push((carparks.locations[i].name));
    }
    complete = true
    data = JSON.stringify(carparksData,null, '\t');
    
    if (complete == true) 
    {
        return res.status(200).json(data);
    }
    else 
    {
        return res.status(401).json(data);
    }
});

//returns all the spaces in the carpark
router.get('/manageSpaces',jsonParser, (req, res) => {
    
    const selectedCarpark = req.query.carpark;

    data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);

    carparkAvailablity = []

    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == selectedCarpark) {
            for (j = 0 ; j < carparks.locations[i].space.length; j++) {
                carparkAvailablity.push(carparks.locations[i].space[j]);
            }

            break;
        }
    }

    res.json(carparkAvailablity)
});

//returns all the free spaces in the carpark
router.get('/carpark-stats',jsonParser, (req, res) => {
    
    const selectedCarpark = req.query.carpark;

    data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);

    let carparkstats;

    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == selectedCarpark) {
            carparkstats = {
                total: carparks.locations[i].num_spaces,
                freespaces: carparks.locations[i].freespaces
            }
        }

    }

    res.json(carparkstats)
});

//returns all the free spaces in the carpark
router.get('/Freespaces',jsonParser, (req, res) => {


    const ticketStartTime = req.query.aTime;
    const ticketEndTime = req.query.dTime;
    const selectedCarpark = req.query.carpark;

    console.log(ticketStartTime)
    console.log(ticketEndTime)
    console.log(selectedCarpark)

    let data = fs.readFileSync(path.join(__dirname,'..','tickets.json'), {encoding: 'utf8', flag:'r'});
    let tickets = JSON.parse(data);

    //an array to store all the carpark spaces that are occupied during the new ticket time
    let takenSpots = [];

    //finds all the taken spots in a car park for the given times
    for (i = 0; i < tickets.length; i++) {

        if ((tickets[i].arrivalTime <= ticketEndTime) && (ticketStartTime <= tickets[i].departureTime) && ( tickets[i].carPark == selectedCarpark)) {
            takenSpots.push(tickets[i].parkingSpace);
        }
    }

    data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);

    carparkAvailablity = []
    let SpaceAvailablity;

    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == selectedCarpark) {
            for (j = 0 ; j < carparks.locations[i].space.length; j++) {
                if(!(takenSpots.includes(carparks.locations[i].space[j].ID) || (carparks.locations[i].space[j].occupier == "Blocked By Admin"))) {
                    SpaceAvailablity = {
                        parkingSpace: carparks.locations[i].space[j].ID,
                        available: true
                    }
                }
                else {
                    SpaceAvailablity = {
                        parkingSpace: carparks.locations[i].space[j].ID,
                        available: false
                    }

                }

                carparkAvailablity.push(SpaceAvailablity);
            }

            break;
        }
    }

    res.json(carparkAvailablity)
});

module.exports = router;