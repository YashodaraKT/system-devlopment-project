

import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

const app= express();

app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"omega"
})

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM user WHERE User_Name = ? AND Password = ?";

  db.query(sql, [req.body.User_Name, req.body.Password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      const user = {
        User_ID: results[0].User_ID,
        User_Name: results[0].User_Name,
        User_Type: results[0].User_Type
      };
      console.log(user.User_Type);
      return res.json({ status: "success", user });
    } else {
      return res.json({ status: "no record" });
    }
  });
});


app.get('/supplier/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Supplier_ID FROM supplier WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Supplier not found" });
    return res.json({ supplierId: data[0].Supplier_ID });
  });
});
//---------------------supplies
app.get('/supply/:supplierId', (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = "SELECT * FROM supply WHERE Supplier_ID = ?";
  
  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ supplies: data });
  });
});
//-----------------------Appointments
app.get('/appointment/:supplierId', (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = "SELECT * FROM appointment WHERE Supplier_ID = ?";
  
  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ appointments: data });
  });
});

//************locations 

app.get('/location', (req, res) => {
    const sql = 'SELECT Location_Id, Location_Name FROM location';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: 'Failed to fetch locations' });
      } else {
        res.json(result);
      }
    });
  });

  
app.listen(8081,()=>{
    console.log ("listening...")
})
