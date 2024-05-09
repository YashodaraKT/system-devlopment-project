

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

app.post('/login',(req,res)=>{
    const sql="SELECT * FROM user WHERE User_Name=? and Password=? ";
    
    db.query(sql,[req.body.User_Name, req.body.Password],(err,data)=>{
        if(err)return res.json("Error");
        if(data.length>0){
            console.log(data[0].User_Type);
            return res.json({status: "success", userType: data[0].User_Type})
        } else{
            return res.json({status: "no record"})
        }
    } )   
        
})


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
