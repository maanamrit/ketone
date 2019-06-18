var express = require('express');
var routes = express.Router();
var fs = require('fs');
var path = require('path');
var dashboardData = {};
module.exports = (ioObject) => {
    routes.get('/', (req, res, next) => {
        res.send('<h1>Running the code</h1>')
    });

    routes.post('/updateData', (req, res, next) => {
        //    console.log(ioObject);
        //   console.log(req.body);
    
        fs.writeFile(path.join(__dirname, 'config', 'data.json'), JSON.stringify(req.body), function (err) {
            if (err) {
                console.log(new Date().toLocaleString()+"----Error updating data in config file.");
                res.json({ message: 'Error in saving data' });
            }
            else {
                console.log(new Date().toLocaleString()+"----Updated Successfully data in config file");
                ioObject.to('dataRoom').emit('dataEvent', { updatedData: req.body });

                res.json({ message: 'I hav recived the data' });
            }
        });

        //   dashboardData = req.body;

    })
    routes.get('/getData', (req, res, next) => {
        //  console.log(dashboardData);
       fs.readFile(path.join(__dirname, 'config', 'data.json'), 'utf-8', function (err, data) {
//                console.log(data);
                if(data==undefined){
                    console.log(new Date().toLocaleString()+"----No data is present in config file.");
                    res.json({success:false,dashboarData:{}});
                }
                else{
                    console.log(new Date().toLocaleString()+"----Requested data from config file.");
                    res.json({success:true,dashboarData:JSON.parse(data)});
                }
               
            })


        //   console.log(path.join(__dirname,'Config','data.json'));

    })
    return routes;

}
