

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

app.get('/customer/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Customer_ID FROM Customer WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});
//---------------------------------------------------------------
app.get('/order/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = "SELECT *, DATE_FORMAT(Order_Date, '%Y-%m-%d %H:%i:%s') AS Order_Date FROM Order WHERE Customer_ID = ? ORDER BY Order_Date";

  db.query(sql, [customerId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Orders not found" });
    return res.json({ order: data });
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
//----------------------------Register

app.post('/user', async (req, res) => {
  const { User_Name, User_Type, Password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO user (User_Name, User_Type, Password) VALUES (?, ?, ?)',
      [User_Name, User_Type, Password]
    );

    // Retrieve the last inserted User_ID
    db.query("SELECT LAST_INSERT_ID() AS User_ID;", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving last inserted User_ID");
        return;
      }
      
      // Extract the User_ID from the result
      const user_id = result[0].User_ID;

      // Send the User_ID in the response
      res.status(201).json({ User_ID: user_id });
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});

//-------------------- Register Supplier

app.post('/supplier', async (req, res) => {
  const { Name, Address1, Address2, Contact_Number, Transport, User_ID } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO supplier (Name, Address1, Address2, Contact_Number, Transport, User_ID) VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID() )',
      [Name, Address1, Address2, Contact_Number, Transport, User_ID]
    );

    res.status(201).send("Supplier registered successfully");
  } catch (err) {
    console.error('Error registering supplier:', err);
    res.status(500).send('Server error');
  }
});




//-------------------- Register Customer
app.post('/customer', async (req, res) => {
  const { Name, Address1, Address2, Contact_Number, Email } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO customer (Name, Address1, Address2, Contact_Number, Email, User_ID) VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID())',
      [Name, Address1, Address2, Contact_Number, Email]
    );

    res.status(201).send("Customer registered successfully");
  } catch (err) {
    console.error('Error registering customer:', err);
    res.status(500).send('Server error');
  }
});

//-------------------- Register Staff
app.post('/staff', async (req, res) => {
  const { Name, Contact_Number } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO staff (Name, Contact_Number, User_ID) VALUES (?, ?,  LAST_INSERT_ID())',
      [Name, Contact_Number]
    );

    res.status(201).send("Staff member registered successfully");
  } catch (err) {
    console.error('Error registering Staff member:', err);
    res.status(500).send('Server error');
  }
});
//--------------------------------------------------------------------------------------------------------
//Change Password
app.post('/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const sqlCheck = "SELECT * FROM user WHERE User_Name=?";

  db.query(sqlCheck, [username], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {
      if (data[0].Password === currentPassword) {
        const sqlUpdate = "UPDATE user SET Password=? WHERE User_Name=?";

        db.query(sqlUpdate, [newPassword, username], (err, result) => {
          if (err) return res.json("Error");
          if (result.affectedRows > 0) {
            return res.json({ status: "success" });
          } else {
            return res.json({ status: "no record" });
          }
        });
      } else {
        return res.json({ status: "incorrect current password" });
      }
    } else {
      return res.json({ status: "no record" });
    }
  });
});

//---------------------------------retrive order details-------
app.get('/customer_order/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = `SELECT o.Order_ID, o.Deliver_Date, o.Payment,
  GROUP_CONCAT(CONCAT(p.Product_Name, ' - ', oi.Quantity, '  - ', oi.Value, ' ')) AS Products,
  SUM(oi.Quantity * oi.Value) AS Total_Value
FROM customer_order o
JOIN order_item oi ON oi.Order_ID = o.Order_ID
JOIN product p ON oi.Product_ID = p.Product_ID
WHERE o.Customer_ID = ?
GROUP BY o.Order_ID, o.Deliver_Date, o.Payment
`;

  db.query(sql, [customerId], (err, data) => {
    if (err) {
      console.error('Database query error:', err);  // Log error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log('No orders found for customer ID:', customerId);  // Log no data found
      return res.status(404).json({ error: "Orders not found" });
    }
    console.log('Query result:', data);  // Log the data for debugging
    console.log(data)
    return res.json({ orders: data });
  });
});

// Create an appointment
app.post('/appointment', (req, res) => {
  const { Supplier_ID, Date, No_of_Days, App_Value } = req.body;
  const query = 'INSERT INTO appointment (Supplier_ID, Date, No_of_Days, Approval) VALUES (?, ?, ?, ?)';
  db.query(query, [Supplier_ID, Date, No_of_Days, Approval], (err, result) => {
    if (err) throw err;
    res.send({ success: true, appointmentId: result.insertId });
  });
});

//View Appointment
app.get('/view_appointment', (req, res) => {
  const query = `
  SELECT a.Appointment_ID, a.Supplier_ID, a.Date, a.Status, a.No_of_Days, 
         s.Name, s.Address1, s.Address2, s.Location_Id 
  FROM appointment a 
  JOIN supplier s ON a.Supplier_ID = s.Supplier_ID
`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send(err);
      
    } else {
      res.json(results);
    }
  });
});

//-----------------------View Approved Orders-----
app.get('/customer_orders', (req, res) => {
  const sql = `SELECT customer_order.Order_ID, customer_order.Customer_ID, approved_order.Payment, approved_order.Payment_Status, customer_order.Order_Date, customer_order.Deliver_Date, customer.Name, customer.Contact_Number,
  GROUP_CONCAT(CONCAT_WS(' - ', product.Product_Name, order_item.Quantity, order_item.Value) SEPARATOR ',\n') as 'Product Details'
FROM customer_order
INNER JOIN customer ON customer_order.Customer_ID = customer.Customer_ID
LEFT JOIN order_item ON customer_order.Order_ID = order_item.Order_ID
LEFT JOIN approved_order ON customer_order.Order_ID = approved_order.Order_ID
LEFT JOIN product ON order_item.Product_ID = product.Product_ID
WHERE customer_order.Approval = 1
GROUP BY customer_order.Order_ID;`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log('Query result:', data);
    return res.json({ orders: data });
  });
});

// Update payment status
app.put('/approved_payments/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const paymentStatus = req.body.Payment_Status;

  const sql = `UPDATE approved_order SET Payment_Status = ? WHERE Order_ID = ?`;

  db.query(sql, [paymentStatus, orderId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log('Payment status updated:', result);
    return res.json({ message: 'Payment status updated' });
  });
});

//-----------------------View pendingOrders-----
app.get('/pending_orders', (req, res) => {
  const sql = `SELECT customer_order.Order_ID, customer_order.Customer_ID,  customer_order.Order_Date, customer_order.Deliver_Date, customer.Name, customer.Contact_Number,
  GROUP_CONCAT(CONCAT_WS(' - ', product.Product_Name, order_item.Quantity, order_item.Value) SEPARATOR ',\n') as 'Product Details'
FROM customer_order
INNER JOIN customer ON customer_order.Customer_ID = customer.Customer_ID
LEFT JOIN order_item ON customer_order.Order_ID = order_item.Order_ID
LEFT JOIN product ON order_item.Product_ID = product.Product_ID
WHERE customer_order.Approval = 10
GROUP BY customer_order.Order_ID;`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log('Query result:', data);
    return res.json({ orders: data });
  });
});
// Endpoint to approve or decline an order
app.put("/Approval_orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const { Approval } = req.body;

  const sql = `UPDATE customer_order SET Approval = ? WHERE Order_ID = ?`;

  db.query(sql, [Approval, orderId], (err, result) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Order updated:", result);
    return res.json({ message: "Order updated successfully" });
  });
});







//----------------------------------------------------------------


app.listen(8081,()=>{
    console.log ("listening...")
})
