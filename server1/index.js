const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');

app.use(cors());
app.use(express.json());
app.use(express.static('public/images/rooms'));
app.use(express.static('public/images/parcel'));
app.use(express.static('public/images/contract'));

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "apartmentSystem",
    multipleStatements: true
})

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/rooms')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const contractStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/contract')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const parcelStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/parcel')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

/*app.post('/upload/', upload.array("files"), function (req, res, next) {
    const room = req.body.room
    if (!req.files) {
        return res.status(500).json(err)
    }
    const picture = req.files
    const jsonPic = JSON.stringify(picture)
    console.log(room)
    console.log(picture)
    
    return res.status(200).send(req.files)
})*/
//-----------------------------------------------------------------login register----------------------------------------------------

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.query("SELECT * FROM members WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send({ message: "Server: Not found username/password from database" });
            }
        })
})
const uploadContract = multer({ storage: contractStorage })
app.post('/register', uploadContract.array("filesContract"), function (req, res) {
    const name = req.body.name
    const surname = req.body.surname
    const phone = req.body.phone_number
    const idcard = req.body.idcard_number
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const room_number = req.body.room_number
    const contract_start = req.body.contract_start
    const contract_end = req.body.contract_end
    const member_status = req.body.member_status
    if (!req.files) {
        return res.status(500).json(err)
    }
    const picture_contract = req.files
    const jsonPic = JSON.stringify(picture_contract)

   db.query("INSERT INTO members (name, surname, phone_number, idcard_number, email, username, password, room_number, contract_start, contract_end, member_status, picture_contract) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
        [name, surname, phone, idcard, email, username, password, room_number, contract_start, contract_end, member_status, jsonPic],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Values inserted");
            }
        });
});

//--------------------------------------------------Member-----------------------------------------------------
app.get('/members', (req, res) => {
    db.query("SELECT * FROM members ", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
app.post('/member', (req, res) => {
    const room_number = req.body.room_number
    const member_status = req.body.member_status
    const room = req.body.room
    const status = req.body.status
    if (room_number) {
        db.query("SELECT * FROM members WHERE room_number = ? ", room_number, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (member_status) {
        db.query("SELECT * FROM members WHERE member_status = ? ", member_status, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (room && status) {
        db.query("SELECT * FROM members WHERE member_status = ? AND room_number = ?  ", [status, room], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }

});
app.put('/updateMember_status', (req, res) => {
    const id = req.body.id
    const member_status = req.body.member_status
    const date_checkout = req.body.date_checkout
    db.query("UPDATE members SET member_status = ?, date_checkout = ? WHERE id =?", [member_status, date_checkout, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})
app.put('/editMember',(req, res)=>{
    const id = req.body.id
    const phone = req.body.phone
    const email = req.body.email
   console.log(id)
   console.log(phone)
   console.log(email)
   if(id && phone && email){
    db.query("UPDATE members SET phone_number = ?, email = ? WHERE id =?", [phone, email, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
   }
   else if(id && phone){
    db.query("UPDATE members SET phone_number = ? WHERE id =?", [phone, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
   }
   else if(id && email){
    db.query("UPDATE members SET email = ? WHERE id =?", [email, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
   }
    
})
app.delete('/delete_members/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM members WHERE id = ? ", id, (err, result) => {
        if (err) {
            console.log("Delete error");
        }
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Not found id of members" });
        }
    })
})

//-----------------------------------------------------------Room----------------------------------------------------------
app.post('/rooms', (req, res) => {
    const room_status = req.body.room_status
    if (room_status) {
        db.query("SELECT * FROM rooms WHERE room_status = ? ", room_status, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });

    }
    else {
        db.query("SELECT * FROM rooms", (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
});
const upload = multer({ storage: storage })
app.post('/addrooms', upload.array('files'), function (req, res) {
    const room_number = req.body.room
    const rental_price = req.body.rental_price
    const room_status = req.body.status
    const room_detail = req.body.detail
    if (!req.files) {
        return res.status(500).json(err)
    }
    const picture = req.files
    const jsonPic = JSON.stringify(picture)
    console.log(picture)
    db.query("INSERT INTO rooms (room_number, rental_price, room_status, room_detail, room_picture) VALUES(?,?,?,?,?)",
        [room_number, rental_price, room_status, room_detail, jsonPic],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Values inserted");
            }
        });
});

app.post('/room_info', (req, res) => {
    const room_number = req.body.room_number
    const room_status = req.body.room_status
    if (room_number) {
        db.query("SELECT * FROM rooms WHERE room_number = ? ", room_number, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    if (room_status) {
        db.query("SELECT room_number, rental_price FROM rooms WHERE room_status = ? ", room_status, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }

});
app.put('/updateRoom', (req, res) => {
    const room_status = req.body.room_status
    const room_number = req.body.room_number
    const member_id = req.body.member_id

    db.query("UPDATE rooms SET room_status = ?, member_id = ? WHERE room_number = ?", [room_status, member_id[0], room_number], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})
app.delete('/delete_rooms/:room_number', (req,res) => {
    const room_number =req.params.room_number;
    db.query("DELETE FROM rooms WHERE room_number = ? ",room_number,(err,result) => {
        if(err){
            console.log("Delete error");
        }
        if(result.length>0){
            res.send(result);
        }
        else{
            res.send({message: "Not found rooms"});
        }
    })
})


//----------------------------------------------------------------------Bill---------------------------------------------------------
app.post('/createBill', (req, res) => {
    const date_bill = req.body.date_bill
    const water_unit = req.body.water_unit
    const elec_unit = req.body.elec_unit
    const room = req.body.room
    const repairs = req.body.repairs
    const member = req.body.member
    var totalRepairs = Array(room.length).fill(0)
    var totalbill_repair = [];
    //var value1 = new Array();
    for (let a = 0; a < room.length; a++) {
        for (let b = 0; b < repairs.length; b++) {
            if (room[a].room_number == repairs[b].room_number) {
                //console.log(room[a].room_number, repairs[b].room_number, repairs[b].id_repair)
                totalRepairs[a] = totalRepairs[a] + repairs[b].repair_bill
                //value1.push(repairs[b].id_repair, repairs[b])
            }
            
        }
        totalbill_repair[a] = {
                
            room_number: room[a].room_number,
            total: totalRepairs[a],
            date_bill: date_bill
        }
    }
    //console.log(value1)
    console.log(totalbill_repair)
    //console.log(totalRepairs);
    var values = [];
    var values1 = [];
    var value2 = [];
    var totalrepair_bill = Array(room.length).fill(0)
    for (let i = 0; i < room.length; i++) {
        for (let j = 0; j < member.length; j++) {
            for (let k = 0; k < repairs.length; k++) {
                if ((room[i].room_number == member[j].room_number) && (member[j].room_number == repairs[k].room_number)) {
                    //console.log(true)
                    //console.log(room[i].room_number, member[j].room_number, repairs[k].room_number, repairs[k].id_repair)
                    //values[i] = [date_bill, water_unit, elec_unit, totalbill_repair[i].total, room[i].room_number, room[i].rental_price, member[j].id];
                    value2[i] = { repair_bill: totalbill_repair[i].total, date_bill: date_bill, room_number: room[i].room_number }
                }
                
            }
            if(room[i].room_number==member[j].room_number){
                values[i] = [date_bill, water_unit, elec_unit, totalbill_repair[i].total, room[i].room_number, room[i].rental_price, member[j].id];
            }
        }
    }
    console.log(values);
   
    db.query("INSERT INTO bill (date_bill, water_unit, elec_unit, repair_bill, room_number, rental_price, member_id) VALUES ?",[values],
    (err, result) =>{
        if(err){
            console.log(err);
        }
        else {
            res.send("Values inserted");
        }
    });
})

app.put('/setBill', (req, res) => {
    const id_bill = req.body.id_bill;
    const water_before = req.body.water_before;
    const water_after = req.body.water_after;
    const elec_before = req.body.elec_before;
    const elec_after = req.body.elec_after;
    const water_unit = req.body.water_unit;
    const elec_unit = req.body.elec_unit;
    const repair_bill = req.body.repair_bill;
    const rental_price = req.body.rental_price;
    const water_used = water_after - water_before;
    const elec_used = elec_after - elec_before;
    const water_bill = water_used * water_unit;
    const elec_bill = elec_used * elec_unit;
    const total_bill = water_bill + elec_bill + repair_bill + rental_price;
    const bill_status = "ค้างชำระ"

    db.query("UPDATE bill SET water_before = ?, water_after = ?, water_used = ?, water_bill = ?, elec_before = ?, elec_after = ?, elec_used = ?, elec_bill = ?, total_bill = ?, bill_status = ? WHERE id_bill =?",
        [water_before, water_after, water_used, water_bill, elec_before, elec_after, elec_used, elec_bill, total_bill, bill_status, id_bill], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
})
app.post('/bills', (req, res) => {
    const date_bill = req.body.date_bill
    const room_number = req.body.room_number
    const date = req.body.date
    //จาก BillingsUser
    const room = req.body.room
    if (date_bill) {
        db.query("SELECT * FROM bill WHERE date_bill = ?", [date_bill], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (date) {
        db.query("SELECT * FROM bill WHERE date_bill = ? AND room_number = ?", [date, room_number], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (room) {
        db.query("SELECT * FROM bill WHERE room_number = ?", [room], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }


});
app.put('/updateBill', (req, res) => {
    const id_bill = req.body.id_bill
    const bill_status = req.body.bill_status
    const repairs = req.body.repairs
    var id_repair = [];
    for (let i = 0; i < repairs.length; i++) {
        id_repair[i] = [repairs[i].id_repair]
    }
    console.log(id_repair)
    if (id_bill) {
        db.query("UPDATE bill SET bill_status = ? WHERE id_bill =?", [bill_status, id_bill], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (id_repair) {
        db.query(`UPDATE repairs SET bill_status = ? WHERE id_repair IN (${id_repair})`, [bill_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }

})

//-------------------------------------------------------------------Repair----------------------------------------------------------
app.post('/addrepairs', (req, res) => {
    const repair_detail = req.body.repair_detail
    const date_send = req.body.date_send
    const phone = req.body.phone
    const room_number = req.body.room_number
    const bill_status = req.body.bill_status
    const repair_status = req.body.repair_status
    db.query("INSERT INTO repairs (repair_detail, date_send, phone, room_number, bill_status, repair_status) VALUES(?,?,?,?,?,?)",
        [repair_detail, date_send, phone, room_number, bill_status, repair_status],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Values inserted");
            }
        });
});


app.post('/repairs', (req, res) => {
    const repair_status = req.body.repair_status
    if (repair_status == null || repair_status == "ทั้งหมด") {
        db.query("SELECT * FROM repairs", (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (repair_status) {
        db.query("SELECT * FROM repairs WHERE repair_status = ?", [repair_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
});
app.post('/repairsUser', (req, res) => {
    const room_number = req.body.room_number
    const repair_status = req.body.repair_status
    if (repair_status == null || repair_status == "ทั้งหมด") {
        db.query("SELECT * FROM repairs WHERE room_number = ?", [room_number], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (repair_status) {
        db.query("SELECT * FROM repairs WHERE room_number = ? AND repair_status = ? ", [room_number, repair_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
});
app.put('/updateRepairs', (req, res) => {
    const date_confirm = req.body.date_confirm
    const id_repair = req.body.id_repair
    const repair_bill = req.body.repair_bill
    const bill_detail = req.body.bill_detail
    const status = req.body.status
    const bill_status = req.body.bill_status
    if (date_confirm) {
        db.query("UPDATE repairs SET date_confirm = ?, repair_status = ? WHERE id_repair =?", [date_confirm, status, id_repair], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    if (date_confirm == null) {
        db.query("UPDATE repairs SET repair_bill = ?, bill_detail = ?, repair_status = ?, bill_status = ? WHERE id_repair =?", [repair_bill, bill_detail, status, bill_status, id_repair], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
})
app.post('/repairs_bill', (req, res) => {
    const bill_status = req.body.bill_status
    const room_number = req.body.room
    const status = req.body.status
    console.log(bill_status)
    //หน้า createBill
    if (bill_status) {
        db.query("SELECT id_repair, repair_bill, bill_detail, room_number FROM repairs WHERE bill_status = ? ", [bill_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    //หน้า bill_info
    else if (room_number) {
        db.query("SELECT id_repair, repair_bill, bill_detail, room_number FROM repairs WHERE room_number = ? AND bill_status = ? ", [room_number, status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }

})
app.delete('/delete_repair/:id', (req, res) => {
    const id_repair = req.params.id;
    db.query("DELETE FROM repairs WHERE id_parcel = ? ", id_repair, (err, result) => {
        if (err) {
            console.log("Delete error");
        }
        else {
            res.send(result);
        }
    })
})


//-------------------------------------------------------------Parcel--------------------------------------------------------------
const uploadParcel = multer({ storage: parcelStorage })
app.post('/addparcel', uploadParcel.array('filesParcel'), function (req, res) {
    const name = req.body.name
    const track = req.body.track
    const date_arrived = req.body.date_arrived
    const room_number = req.body.room_number
    const parcel_status = req.body.parcel_status
    if (!req.files) {
        return res.status(500).json(err)
    }
    const picture = req.files
    const jsonPic = JSON.stringify(picture)
    console.log(jsonPic)
    console.log(parcel_status)
    db.query("INSERT INTO parcel (name, track, room_number, date_arrived, parcel_status, parcel_picture) VALUES(?,?,?,?,?,?)",
        [name, track, room_number, date_arrived, parcel_status, jsonPic],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Values inserted");

            }
        });
});
app.post('/parcel', (req, res) => {
    const parcel_status = req.body.parcel_status
    if (parcel_status == null || parcel_status == "ทั้งหมด") {
        db.query("SELECT * FROM parcel", (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (parcel_status) {
        db.query("SELECT * FROM parcel WHERE parcel_status = ?", [parcel_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
});

app.post('/parcelInfo', (req, res) => {
    const parcel_status = req.body.parcel_status
    const room_number = req.body.room_number
    if (parcel_status == null || parcel_status == "ทั้งหมด") {
        db.query("SELECT * FROM parcel WHERE room_number = ?", [room_number], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else if (parcel_status) {
        db.query("SELECT * FROM parcel WHERE room_number = ? AND parcel_status = ?", [room_number, parcel_status], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    }

})

app.put('/updateParcel_status', (req, res) => {
    const id_parcel = req.body.id_parcel
    const parcel_status = req.body.parcel_status
    const date_pickup = req.body.date_pickup
    db.query("UPDATE parcel SET parcel_status = ?, date_pickup = ? WHERE id_parcel =?", [parcel_status, date_pickup, id_parcel], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})
app.delete('/delete_parcel/:id_parcel', (req, res) => {
    const id_parcel = req.params.id_parcel;
    db.query("DELETE FROM parcel WHERE id_parcel = ? ", id_parcel, (err, result) => {
        if (err) {
            console.log("Delete error");
        }
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Not found parcel" });
        }
    })
})

//--------------------------------------------------------------News-----------------------------------------------------------------
app.post('/addnews', (req, res) => {
    const header_message = req.body.header_message
    const message = req.body.message
    const date_message = req.body.date_message

    db.query("INSERT INTO news (header_message, message, date_message) VALUES(?,?,?)",
        [header_message, message, date_message],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Values inserted");
            }
        });
});

app.get('/news', (req, res) => {
    db.query("SELECT * FROM news", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

app.post('/newsInfo', (req, res) => {
    db.query("SELECT * FROM news", (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            res.send(result)
        }
        else {
            res.send({ message: "error for get news information" });
        }
    })
})

app.delete('/delete_news/:id_news', (req, res) => {
    const id_news = req.params.id_news;
    db.query("DELETE FROM news WHERE id_news = ? ", id_news, (err, result) => {
        if (err) {
            console.log("Delete error");
        }
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Not found news" });
        }
    })
})





app.listen('3001', () => {
    console.log('Server is running on port 3001');
})