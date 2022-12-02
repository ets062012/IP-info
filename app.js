const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const app = express();
const port = process.env.port || 5000;
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static('./public'))

//app.use(express.static('/public'))
//app.use(bodyParser.json())
//set storage engine

const pool = mysql.createPool({

    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ip_info'

})
const storage = multer.diskStorage({
    destination: './public/image/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }

}).single("image");

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);

    } else {

        cb("error images")
    }
}



app.get('/', (req, res) => {

    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         throw err
    //     }
    //     connection.release();// return connection to pool

    //     connection.query('select * from beers', (err, rows) => {
    //         if (!err) {
    //             res.status(200).send(rows);
    //         } else {
    //             console.log(err)
    //         }

    //     })

    // })
    res.render("index")
})

//display records searched by id
app.get('/search', (req, res) => {

    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         throw err
    //     }
    //     connection.release();// return connection to pool
    //     const id = req.body;
    //     connection.query('select * from beers where id=?', [params.id], (err, rows) => {
    //         if (!err) {
    //             res.status(200).send(rows);
    //         } else {
    //             console.log(err)
    //         }

    //     })

    // })
    res.render('search')



})
app.get('/insert', (req, res) => {

    res.render("insert")

})
app.get('/display', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.release();// return connection to pool

        connection.query('select * from information', (err, rows) => {
            if (!err) {
                res.render('display', { data: rows })
            } else {
                console.log(err)
            }

        })

    })




})
app.post('/searchPage', (req, res) => {



    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.release();// return connection to pool
        const id = req.body.id;
        connection.query('select * from information where id=?', [id], (err, rows) => {
            if (!err) {
                res.render('searchPage', { data: rows })
            } else {
                console.log(err)
            }

        })

    })


})
app.post('/deletep', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.release();// return connection to pool
        const id = req.body.id
        connection.query('DELETE from information where id=?', [id], (err, rows) => {
            if (!err) {
                res.send(`ip adress with id has been deleted`);
            } else {
                console.log(err)
            }

        })

    })

})
app.get("/update", (req, res) => {
    res.render("update");
})
app.get("/delete", (req, res) => {
    res.render("delete");
})

app.post('/insertp', (req, res, next) => {


    //date ipaddress , Description,malware family , status
    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        }
        connection.release();// return connection to pool

        // const dates = Date.now()

        // const file = `/image/${req.file.filename}`;

        const ip_adress = req.body.ipAdress;
        const description = req.body.description;
        const malware = req.body.malware;
        const status = req.body.status;
        const date = new Date();
        // }
        connection.query("INSERT INTO `information`(`date`,`ip_adress`,`description`,`malware_family`,`status`) VALUES(?,?,?,?,?)",
            [date, ip_adress, description, malware, status], (err, rows) => {
                if (!err) {
                    console.log("inserted");
                    res.send("inserted")

                } else {
                    console.log(err)
                }

            })


        //const image = req.body.image;

    })
})

// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             // if(req.file==undefined){
//             //     res.render('index',{msg:'error msg'});

//             // }else{

//             console.log("it is submitted");
//             res.render('upload', { file: `/image/${req.file.filename}` });
//             // }


//         }})

// })
app.post('/updated', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw errimage
        }
        connection.release();
        const id = req.body.id

        const ip_adress = req.body.ipAdress;
        const description = req.body.description;
        const malware_family = req.body.malware;
        const status = req.body.status
        const date = new Date();

        connection.query('UPDATE information SET date=?,ip_adress=?,description=?,malware_family=?,status=? where id=?',
            [date, ip_adress, description, malware_family, status, id], (err, rows) => {

                if (!err) {
                    res.send("row has been updated")
                } else {
                    console.log(err)
                }

            })
        console.log(req.body);
    })

})




app.listen(port, () => {
    console.log("server listening");
})