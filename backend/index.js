

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
  const { Name, Address1, Address2, Contact_Number, Transport, User_ID,Location_Id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO supplier (Name, Address1, Address2, Contact_Number, Transport,Location_Id, User_ID) VALUES (?, ?, ?, ?, ?,?, LAST_INSERT_ID() )',
      [Name, Address1, Address2, Contact_Number, Transport, Location_Id,User_ID]
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
  const sql = `SELECT o.Order_ID, o.Deliver_Date, ao.Payment,
  GROUP_CONCAT(CONCAT(p.Product_Name, ' - ', oi.Quantity, '  - ', oi.Value, ' ')) AS Products,
  SUM(oi.Quantity * oi.Value) AS Total_Value
FROM customer_order o
JOIN order_item oi ON oi.Order_ID = o.Order_ID
JOIN approved_order ao ON ao.Order_ID = o.Order_ID
JOIN product p ON oi.Product_ID = p.Product_ID
WHERE o.Customer_ID = ?
GROUP BY o.Order_ID, o.Deliver_Date, ao.Payment
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
  let sql = `
    SELECT 
      appointment.Appointment_ID, 
      appointment.Supplier_ID, 
      appointment.Date, 
      appointment.Status, 
      supplier.Name,
      supplier.Address1,
      supplier.Address2,
      location.Location_Name
    FROM 
      appointment 
    JOIN 
      supplier 
    ON 
      appointment.Supplier_ID = supplier.Supplier_ID
    JOIN
      location
    ON
      supplier.Location_Id = location.Location_Id
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Approved appointment

app.post('/update_appointment', (req, res) => {
  const { appointmentId, approval } = req.body;
  let sql = `UPDATE appointment SET Approval = ? WHERE Appointment_ID = ?`;
  db.query(sql, [approval, appointmentId], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Appointment updated successfully' });
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
// ------------------------------------Endpoint to approve or decline an order
app.put("/Approval_orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const { Approval } = req.body;

  // Calculate the total payment for the order
  const sqlGetPayment = `SELECT SUM(Value) AS TotalPayment FROM order_item WHERE Order_ID = ?`;

  db.query(sqlGetPayment, [orderId], (err, results) => {
    if (err) {
      console.error("Error calculating payment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const totalPayment = results[0].TotalPayment;

    if (Approval === 1) {
      // Insert a new record into the approved_order table
      const sqlInsertApproved = `INSERT INTO approved_order (Order_ID, Payment) VALUES (?, ?)`;

      db.query(sqlInsertApproved, [orderId, totalPayment], (err, result) => {
        if (err) {
          console.error("Error inserting into approved_order:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Record inserted into approved_order:", result);
      });
    }

    // Update the customer_order table
    const sqlUpdateOrder = `UPDATE customer_order SET Approval = ? WHERE Order_ID = ?`;

    db.query(sqlUpdateOrder, [Approval, orderId], (err, result) => {
      if (err) {
        console.error("Error updating order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("Order updated:", result);
      return res.json({ message: "Order updated successfully" });
    });
  });
});


//---------------get Productname
app.get('/products', (req, res) => {
  const sql = 'SELECT  Product_Name,Selling_Price FROM product';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(result);
    }
  });
});

//---------------------------

app.post('/customer_order', async (req, res) => {
  try {
    const { Customer_ID, Deliver_Date, orderItems } = req.body;
    const Order_Date = moment().format('YYYY-MM-DD');

    const insertOrderQuery = 'INSERT INTO customer_order (Customer_ID, Order_Date, Deliver_Date) VALUES (?, ?, ?)';
    const insertOrderItemQuery = 'INSERT INTO order_item (Order_ID, Product_ID, Quantity, Value) VALUES (?, ?, ?, ?)';

    const orderResult = await new Promise((resolve, reject) => {
      db.query(insertOrderQuery, [Customer_ID, Order_Date, Deliver_Date], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const Order_ID = orderResult.insertId;
    const orderItemPromises = orderItems.map(item => {
      return new Promise((resolve, reject) => {
        db.query(insertOrderItemQuery, [Order_ID, item.Product_ID, item.Quantity, item.Value], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    await Promise.all(orderItemPromises);
    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

//----------view supplier

app.get('/viewsupplier', (req, res) => {
  db.query('SELECT * FROM supplier', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//----------view customer

app.get('/viewcustomer', (req, res) => {
  db.query('SELECT * FROM customer', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//----------view staff

app.get('/viewstaff', (req, res) => {
  db.query('SELECT * FROM staff', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});


//-------------------------Spayment View---------------------------------------
app.get('/supplier_payments', (req, res) => {
  const query = `
    SELECT s.Supply_ID, s.Supplier_ID, su.Name, su.Contact_Number, s.Date, s.Payment, s.Payment_Status
    FROM supply AS s
    INNER JOIN supplier AS su ON s.Supplier_ID = su.Supplier_ID
  `;

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send({ supplies: result });
    }
  });
});
//-------------------------Spayment done---------------------------------------
app.put('/approved_supplier_payments/:id', (req, res) => {
  const supplyId = req.params.id;
  const { Payment_Status } = req.body;

  const query = `
    UPDATE supply
    SET Payment_Status = ?
    WHERE Supply_ID = ?
  `;

  db.query(query, [Payment_Status, supplyId], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send({ message: 'Payment status updated successfully.' });
    }
  });
});
//---------------------------------------------------
app.get('/find_supplier', (req, res) => {
  const { name, contact } = req.query;
  const query = `
    SELECT Supplier_ID
    FROM supplier
    WHERE Name = ? AND Contact_Number = ?
  `;
  db.query(query, [name, contact], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      if (result.length > 0) {
        res.send({ supplier: result[0] });
      } else {
        // If supplier not found
        console.log('Supplier not found');
        res.status(404).send({ message: "Supplier not found" });
      }
    }
  });
});



app.post('/add_supply', (req, res) => {
  const { Supplier_ID, Quantity, Payment, Date } = req.body;
  const query = `
    INSERT INTO supply (Supplier_ID, Quantity, Payment, Date, Payment_Status)
    VALUES (?, ?, ?, ?, 0)
  `;
  db.query(query, [Supplier_ID, Quantity, Payment, Date], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      res.send({ message: 'Supply added successfully.' });
    }
  });
});






//-------------------------------------------
app.listen(8081,()=>{
    console.log ("listening...")
})
