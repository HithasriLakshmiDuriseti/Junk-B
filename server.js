const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const port = 8081; 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

//Registration
app.post('/signup', (req, res)=>{
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data)=>{
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    })
})

//Login
app.post('/login', (req, res)=>{
    const sql = "SELECT * FROM login WHERE `email`= ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data)=>{
        if(err){
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("Success");
        }
        else{
            return res.json("Fail");
        }
    })
})

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  //WasteDetails
  app.post('/WasteDetails/pickup', (req, res) => {
    const {email , category, weight, coins} = req.body;
  
    console.log('Received data from client:', {
      email,
      category,
      weight,
      coins,
      
    });
  
  
    pool.query('INSERT INTO wastedetails2 (email, category, weight, coins) VALUES (?, ?, ?, ?)', [email, category, weight, coins], (err, results) => {
      if (err) {
        console.error('Error saving waste details to MySQL', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, message: 'Waste details saved successfully' });
      }
    });
  });
  

  //MyWaste
  app.get('/api/getMyWaste', (req, res) => {
    const userEmail = req.query.email;
    console.log('Received email:', userEmail);
    pool.query(
      'SELECT email, category, weight, coins FROM wastedetails2 WHERE email = ?',
      [userEmail],
      (err, results) => {
        if (err) {
          console.error('Error fetching waste details for MyWaste from MySQL', err);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else {
          res.json({ success: true, data: results });
        }
      }
    );
  });

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
})