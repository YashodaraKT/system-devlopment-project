

import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import moment from 'moment';


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
  const sql = `SELECT o.Order_ID, o.Deliver_Date, ao.Payment,ao.Payment_Status,
  GROUP_CONCAT(CONCAT(p.Product_Name, ' - ', oi.Quantity, '  - ', oi.Value, ' ')) AS Products,
  SUM(oi.Quantity * oi.Value) AS Total_Value
FROM customer_order o
JOIN order_item oi ON oi.Order_ID = o.Order_ID
JOIN approved_order ao ON ao.Order_ID = o.Order_ID
JOIN product p ON oi.Product_ID = p.Product_ID
WHERE o.Customer_ID = ? And
o.Approval = 1
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
//--------------------------Calendar
app.get('/calendar_order/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = `SELECT o.Order_ID, o.Deliver_Date, 
  GROUP_CONCAT(CONCAT(p.Product_Name, ' - ', oi.Quantity, '  - ', oi.Value, ' ')) AS Products,
  SUM(oi.Quantity * oi.Value) AS Total_Value,
  SUM(oi.Value) AS Total_Payment,
  o.Approval
FROM customer_order o
JOIN order_item oi ON oi.Order_ID = o.Order_ID
JOIN product p ON oi.Product_ID = p.Product_ID
WHERE o.Customer_ID = ? 
GROUP BY o.Order_ID, o.Deliver_Date
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
  const sql = 'SELECT  Product_Name,Selling_Price,Product_ID FROM product';
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

app.post('/enter_customer_order', async (req, res) => {
  try {
    const { Customer_ID, Deliver_Date, orderItems } = req.body;
    const Order_Date = moment().format('YYYY-MM-DD');

    const insertOrderQuery = 'INSERT INTO customer_order (Customer_ID, Order_Date, Deliver_Date) VALUES (?, ?, ?)';
    const insertOrderItemQuery = 'INSERT INTO order_item (Order_ID, Product_ID, Quantity, Value) VALUES (?, ?, ?, ?)';

    // Insert into customer_order table
    const orderResult = await new Promise((resolve, reject) => {
      db.query(insertOrderQuery, [Customer_ID, Order_Date, Deliver_Date], (err, result) => {
        if (err) {
          console.error('Error inserting customer order:', err);
          return reject(err);
        }
        resolve(result);
      });
    });

    const Order_ID = orderResult.insertId; // Get the generated Order_ID

    // Insert into order_item table for each item in the orderItems array
    const orderItemPromises = orderItems.map(item => {
      return new Promise((resolve, reject) => {
        db.query(insertOrderItemQuery, [Order_ID, item.Product_ID, item.Quantity, item.Value], (err) => {
          if (err) {
            console.error('Error inserting order item:', err);
            return reject(err);
          }
          resolve();
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
//------Update Supplier

app.put('/updatesupplier/:id', (req, res) => {
  const { id } = req.params;
  const { Contact_Number, Transport } = req.body;
  const sql = 'UPDATE supplier SET Contact_Number = ?, Transport = ? WHERE Supplier_ID = ?';
  db.query(sql, [Contact_Number, Transport, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ success: true });
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
//----------------------update customer
// Add this to your existing Express app
app.put('/updatecustomer/:id', (req, res) => {
  const { id } = req.params;
  const { Contact_Number } = req.body;
  const sql = 'UPDATE customer SET Contact_Number = ? WHERE Customer_ID = ?';
  db.query(sql, [Contact_Number, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ success: true });
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
//----------Update Staff

// Add this to your existing Express app
app.put('/updatestaffcontact/:id', (req, res) => {
  const { id } = req.params;
  const { Contact_Number } = req.body;
  const sql = 'UPDATE staff SET Contact_Number = ? WHERE Staff_ID = ?';
  db.query(sql, [Contact_Number, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ success: true });
    }
  });
});


//-------------------------Spayment View---------------------------------------
app.get('/supplier_payments', (req, res) => {
  const query = `
    SELECT s.Supply_ID, s.Supplier_ID, su.Name, su.Contact_Number, s.Date,s.Quantity, s.Payment, s.Payment_Status
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
//------------------------------Enter the supplies---------------------
app.get('/find_supplier', (req, res) => {
  const { name, contact } = req.query;
  const query = `
    SELECT Supplier_ID, Transport
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

//-----------------------------

app.post('/transport/request', (req, res) => {
  const { supplierId, isPermanent, size, date } = req.body;
  let status = isPermanent ? 1 : 0;

  const query = `INSERT INTO appointment (Supplier_ID, Date, Size, Status) VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE Date=VALUES(Date), Size=VALUES(Size), Status=VALUES(Status)`;

  db.query(query, [supplierId, isPermanent ? null : date, isPermanent ? null : size, status], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Server error');
      }
      res.status(200).send('Transport request submitted successfully');
  });
});

//-------View Production

// Assuming you're using Express and MySQL
app.get('/viewproduction', (req, res) => {
  const sql = `
    SELECT p.Product_Name, pr.Date, pr.Quantity 
    FROM production pr
    JOIN product p ON pr.Product_ID = p.Product_ID
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// Assuming you're using Express and MySQL
app.post('/addproduction', (req, res) => {
  const { Product_ID, Date, Quantity } = req.body;
  const sql = 'INSERT INTO production (Product_ID, Date, Quantity) VALUES (?, ?, ?)';
  db.query(sql, [Product_ID, Date, Quantity], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Production added successfully');
    }
  });
});

// Endpoint to get products
app.get('/productsdw', (req, res) => {
  const sql = 'SELECT * FROM product WHERE active_status = 1';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//****************Inve Productuon */
app.get('/calculateTotalQuantity', (req, res) => {
  const sql = `
    SELECT p.Product_ID, 
           p.Product_Name, 
           COALESCE(pr.productionQuantity, 0) AS productionQuantity,
           COALESCE(oi.orderItemQuantity, 0) AS orderItemQuantity
    FROM product p
    LEFT JOIN (
      SELECT Product_ID, SUM(Quantity) AS productionQuantity
      FROM production
      GROUP BY Product_ID
    ) pr ON p.Product_ID = pr.Product_ID
    LEFT JOIN (
      SELECT oi.Product_ID, SUM(oi.Quantity) AS orderItemQuantity
      FROM order_item oi
      JOIN customer_order co ON oi.Order_ID = co.Order_ID
      WHERE co.Approval = 1
      GROUP BY oi.Product_ID
    ) oi ON p.Product_ID = oi.Product_ID
  `;


  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const calculatedResult = result.map((row) => ({
        productId: row.Product_ID,
        productName: row.Product_Name,
        productionQuantity: row.productionQuantity,
        orderItemQuantity: row.orderItemQuantity,
        totalQuantity: row.productionQuantity - row.orderItemQuantity
      }));

      // Update the Stock column in the database
      const updatePromises = calculatedResult.map((row) => {
        const updateSql = `
          UPDATE product
          SET In_Stock = ?
          WHERE Product_ID = ?
        `;
        return new Promise((resolve, reject) => {
          db.query(updateSql, [row.totalQuantity, row.productId], (updateErr, updateResult) => {
            if (updateErr) {
              reject(updateErr);
            } else {
              resolve(updateResult);
            }
          });
        });
      });

      Promise.all(updatePromises)
        .then(() => {
          res.send(calculatedResult);
        })
        .catch((updateErr) => {
          res.status(500).send(updateErr);
        });
    }
  });
});


//-------------- view Raw material actions
app.get('/getRawMaterialInventory', (req, res) => {
  const sql = `
    SELECT ri.R_ID, 
           rm.R_Name, 
           ri.Quantity, 
           ri.Date, 
           ri.Action
    FROM rawmaterial_inv ri
    JOIN rawmaterial rm ON ri.R_ID = rm.R_ID
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//-----------------add or purchase RM
app.post('/addRawMaterial', (req, res) => {
  const { R_Name, Quantity, Date, Action } = req.body;
  const getRIdQuery = `
    SELECT R_ID FROM rawmaterial WHERE R_Name = ?
  `;
  
  db.query(getRIdQuery, [R_Name], (err, result) => {
    if (err) {
      console.error('Error fetching R_ID:', err);
      return res.status(500).send(err);
    } else {
      if (result.length === 0) {
        return res.status(404).send('Raw material not found');
      }
      const R_ID = result[0].R_ID;
    
      const insertQuery = `
        INSERT INTO rawmaterial_inv (R_ID, Quantity, Date, Action)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(insertQuery, [R_ID, Quantity, Date, Action], (err, result) => {
        if (err) {
          console.error('Error inserting raw material:', err);
          return res.status(500).send(err);
        } else {
          console.log('Raw material added successfully');
          return res.status(201).send('Raw material added successfully');
        }
      });
    }
  });
});

//-----------RM dropdown
app.get('/getRawMaterialNames', (req, res) => {
  const sql = `
    SELECT R_Name FROM rawmaterial
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const names = result.map(row => row.R_Name);
      res.send(names);
    }
  });
});
//------------------stock
app.get('/getMaterials', (req, res) => {
  const sql = `
    SELECT rm.R_ID,
           rm.R_Name, 
           SUM(CASE WHEN ri.Action = 1 THEN ri.Quantity ELSE -ri.Quantity END) AS Stock
    FROM rawmaterial_inv ri
    JOIN rawmaterial rm ON ri.R_ID = rm.R_ID
    GROUP BY rm.R_ID, rm.R_Name;
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      result.forEach(item => {
        const updateSql = `UPDATE rawmaterial SET Stock = ${item.Stock} WHERE R_ID = ${item.R_ID};`;
        db.query(updateSql, (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating stock:', updateErr);
          }
        });
      });
      res.send(result);
    }
  });
});

//-------View Product Table
app.get('/viewProducts', (req, res) => {
  const sql = `SELECT * FROM product WHERE Active_Status = 1;`;

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//------------------------
// Edit product
app.put('/updateProduct/:id', (req, res) => {
  const { id } = req.params;
  const {  Cost, Selling_Price } = req.body;
  const sql = 'UPDATE product SET  Cost = ?, Selling_Price = ? WHERE Product_ID = ?';
  db.query(sql, [ Cost, Selling_Price, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ success: true });
    }
  });
});

// Delete a product
app.put('/deactivateProduct/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to deactivate product with ID: ${id}`);
  const sql = 'UPDATE product SET Active_Status = 0 WHERE Product_ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      res.status(500).send({ error: 'Database query failed', details: err });
    } else if (result.affectedRows === 0) {
      console.warn(`Product with ID: ${id} not found`);
      res.status(404).send({ error: 'Product not found' });
    } else {
      console.log(`Product with ID: ${id} deactivated successfully`);
      res.send({ success: true });
    }
  });
});
//--------------add product

app.post('/addProduct', (req, res) => {
  const { Product_Name, Cost, Selling_Price } = req.body;
  const sql = 'INSERT INTO product (Product_Name, Cost, Selling_Price) VALUES (?, ?, ?)';
  const values = [Product_Name, Cost, Selling_Price];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      res.status(500).send('Error adding product');
    } else {
      const productId = result.insertId;
      const newProduct = { Product_ID: productId, Product_Name, Cost, Selling_Price, In_Stock: 0 }; // Assuming In_Stock starts at 0
      res.status(201).send(newProduct);
    }
  });
});





//--------------Get RM table
app.get('/rawmaterials', (req, res) => {
  const sql = `SELECT * FROM rawmaterial`;

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});
//----------------------------Add new RM
app.post('/rawmaterials', (req, res) => {
  const { R_Name, Buying_Price } = req.body;

  // Assuming R_ID is auto-incremented and Stock has default value

  // Insert query
  const sql = 'INSERT INTO rawmaterial (R_Name, Buying_Price) VALUES (?, ?)';
  const values = [R_Name, Buying_Price];

  // Execute the query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding raw material:', err);
      res.status(500).send('Error adding raw material');
    } else {
      console.log('Raw material added successfully');
      res.status(201).send('Raw material added successfully');
    }
  });
});








//-------------------------------------------
app.listen(8081,()=>{
    console.log ("listening...")
})
