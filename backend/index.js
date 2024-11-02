

import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import moment from 'moment';


import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Destination folder for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with current timestamp
  }
});

const upload = multer({ storage: storage });


const app= express();
app.use(express.static("public"))
app.use("/uploads",express.static("uploads"))
app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"omega"
})

//************************************************************* */

 




/******************************************* */
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
/*app.get('/appointment/:supplierId', (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = "SELECT * FROM appointment WHERE Supplier_ID = ?";
  
  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ appointments: data });
  });
});
*/
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

  //******************** */

  app.get('/user', (req, res) => {
    const userName = req.query.UserName;
    if (!userName) {
      return res.status(400).json({ error: 'UserName query parameter is required' });
    }
  
    const query = 'SELECT COUNT(*) AS count FROM user WHERE User_Name = ?';
    db.query(query, [userName], (err, result) => {
      if (err) {
        console.error('Error checking username:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const userExists = result[0].count > 0;
      res.json({ exists: userExists });
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

// app.post('/supplier' route in your backend
app.post('/supplier', async (req, res) => {
  const { Name, Address1, Address2, Contact_Number, Transport, User_ID, R_User_ID, Location_Id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO supplier (Name, Address1, Address2, Contact_Number, Transport, Location_Id, User_ID, R_User_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Name, Address1, Address2, Contact_Number, Transport, Location_Id, User_ID, R_User_ID]
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
  o.Approval,o.Process
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

//View Appointment(requested)
app.get('/view_appointment', (req, res) => {
  let sql = `
    SELECT 
      appointment.Appointment_ID, 
      appointment.Date, 
      supplier.Name,
      supplier.Contact_Number, 
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
    WHERE
      appointment.Approval = 'Requested'
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


//Approved appointment

app.post('/update_appointment', (req, res) => {
  const { appointmentId, approval, selectedTime, userId } = req.body;
  
  // Update the appointment approval
  let sql = `UPDATE appointment SET Approval = ? WHERE Appointment_ID = ?`;
  db.query(sql, [approval, appointmentId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'An error occurred while updating appointment approval' });
      return;
    }
    
    // If the appointment is approved, update selected time and user ID
    if (approval === 'Accepted') {
      let updateSql = `UPDATE appointment SET Selected_Time = ?, R_User_ID = ? WHERE Appointment_ID = ?`;
      db.query(updateSql, [selectedTime, userId, appointmentId], (updateErr, updateResult) => {
        if (updateErr) {
          console.log(updateErr);
          res.status(500).send({ error: 'An error occurred while updating selected time and user ID' });
          return;
        }
        
        res.send({ message: 'Appointment updated successfully' });
      });
    } else {
      res.send({ message: 'Appointment updated successfully' });
    }
  });
});
//View Appointment-employee(pending)
app.get('/view_penappointment', (req, res) => {
  let sql = `
    SELECT 
      appointment.Appointment_ID, 
      appointment.Date, 
       appointment.Selected_Time, 
      supplier.Name,
      supplier.Contact_Number, 
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
    WHERE
      appointment.Approval = 'Accepted'
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
//*************************************** */
app.get('/view_final_app_E', (req, res) => {
  let sql = `
    SELECT 
      appointment.Appointment_ID, 
      appointment.Date, 
      appointment.Selected_Time, 
      supplier.Name,
      supplier.Contact_Number, 
      supplier.Address1,
      supplier.Address2,
      location.Location_Name,
      appointment.Approval
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
    WHERE
      appointment.Approval IN ('Rejected1', 'Rejected2', 'Completed')
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });

    // Map the approval statuses to their corresponding labels
    const mappedResult = result.map(appointment => {
      let approvalLabel;
      switch (appointment.Approval) {
        case 'Rejected1':
          approvalLabel = 'Rejected';
          break;
        case 'Rejected2':
          approvalLabel = 'Rejected by Supplier';
          break;
        case 'Completed':
          approvalLabel = 'Completed';
          break;
        default:
          approvalLabel = appointment.Approval;
      }
      return { ...appointment, Approval: approvalLabel };
    });

    res.send(mappedResult);
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
  const sql = `SELECT customer_order.Order_ID, customer_order.Customer_ID, customer_order.Order_Date, customer_order.Deliver_Date, customer.Name, customer.Contact_Number,
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

  console.log(`Received request to update order ${orderId} with approval status ${Approval}`);

  // Calculate the total payment for the order
  const sqlGetPayment = `SELECT SUM(Value) AS TotalPayment FROM order_item WHERE Order_ID = ?`;

  db.query(sqlGetPayment, [orderId], (err, results) => {
    if (err) {
      console.error("Error calculating payment:", err);
      return res.status(500).json({ error: "Error calculating payment" });
    }

    const totalPayment = results[0].TotalPayment;
    console.log(`Total payment for order ${orderId} is ${totalPayment}`);

    if (Approval === 1) {
      // Check stock levels
      const sqlGetOrderItems = `SELECT Product_ID, Quantity, Item_O_ID FROM order_item WHERE Order_ID = ?`;

      db.query(sqlGetOrderItems, [orderId], (err, orderItems) => {
        if (err) {
          console.error("Error fetching order items:", err);
          return res.status(500).json({ error: "Error fetching order items" });
        }

        const stockCheckPromises = orderItems.map(item => {
          const sqlCheckStock = `SELECT In_Stock FROM product WHERE Product_ID = ?`;

          return new Promise((resolve, reject) => {
            db.query(sqlCheckStock, [item.Product_ID], (err, result) => {
              if (err) {
                console.error(`Error checking stock for Product_ID ${item.Product_ID}:`, err);
                reject(err);
              } else if (result[0].In_Stock < item.Quantity) {
                console.log(`Insufficient stock for Product_ID ${item.Product_ID}`);
                reject(new Error(`Insufficient stock for Product_ID ${item.Product_ID}`));
              } else {
                resolve();
              }
            });
          });
        });

        Promise.all(stockCheckPromises)
          .then(() => {
            // Stock levels are sufficient, proceed with approval
            const sqlInsertApproved = `INSERT INTO approved_order (Order_ID, Payment) VALUES (?, ?)`;

            db.query(sqlInsertApproved, [orderId, totalPayment], (err, result) => {
              if (err) {
                console.error("Error inserting into approved_order:", err);
                return res.status(500).json({ error: "Error inserting into approved_order" });
              }
              console.log("Record inserted into approved_order:", result);

              // Update the In_Stock value in the product table
              const updateStockPromises = orderItems.map(item => {
                const updateStockSql = `
                  UPDATE product
                  SET In_Stock = In_Stock - ?
                  WHERE Product_ID = ?
                `;

                return new Promise((resolve, reject) => {
                  db.query(updateStockSql, [item.Quantity, item.Product_ID], (updateErr, updateResult) => {
                    if (updateErr) {
                      console.error(`Error updating stock for Product_ID ${item.Product_ID}:`, updateErr);
                      reject(updateErr);
                    } else {
                      console.log(`Stock updated for Product_ID ${item.Product_ID}:`, updateResult);
                      resolve(updateResult);
                    }
                  });
                });
              });

              Promise.all(updateStockPromises)
                .then(() => {
                  // Reduce from production table using FIFO and record in item_lot
                  const reduceProductionPromises = orderItems.map(item => {
                    return new Promise((resolve, reject) => {
                      let remainingQuantity = item.Quantity;

                      const sqlGetFIFO = `
                        SELECT P_ID, Ava_Quantity FROM production
                        WHERE Product_ID = ?
                        AND Ava_Quantity > 0
                        ORDER BY P_ID ASC
                      `;

                      db.query(sqlGetFIFO, [item.Product_ID], (fifoErr, productionBatches) => {
                        if (fifoErr) {
                          console.error(`Error fetching FIFO records for Product_ID ${item.Product_ID}:`, fifoErr);
                          reject(fifoErr);
                        }

                        const updateBatchPromises = productionBatches.map(batch => {
                          if (remainingQuantity <= 0) return Promise.resolve();

                          const quantityToDeduct = Math.min(batch.Ava_Quantity, remainingQuantity);
                          remainingQuantity -= quantityToDeduct;

                          const sqlUpdateProduction = `
                            UPDATE production
                            SET Ava_Quantity = Ava_Quantity - ?
                            WHERE P_ID = ?
                          `;

                          return new Promise((batchResolve, batchReject) => {
                            db.query(sqlUpdateProduction, [quantityToDeduct, batch.P_ID], (updateErr) => {
                              if (updateErr) {
                                console.error(`Error updating production for P_ID ${batch.P_ID}:`, updateErr);
                                batchReject(updateErr);
                              } else {
                                console.log(`Production batch ${batch.P_ID} updated with ${quantityToDeduct}`);

                                // Insert record into item_lot table
                                const sqlInsertItemLot = `
                                  INSERT INTO item_lot (P_ID, Quantity, Item_O_ID)
                                  VALUES (?, ?, ?)
                                `;

                                db.query(sqlInsertItemLot, [batch.P_ID, quantityToDeduct, item.Item_O_ID], (insertErr) => {
                                  if (insertErr) {
                                    console.error(`Error inserting into item_lot for P_ID ${batch.P_ID}:`, insertErr);
                                    batchReject(insertErr);
                                  } else {
                                    console.log(`Record inserted into item_lot for P_ID ${batch.P_ID}, Quantity: ${quantityToDeduct}, Item_O_ID: ${item.Item_O_ID}`);
                                    batchResolve();
                                  }
                                });
                              }
                            });
                          });
                        });

                        Promise.all(updateBatchPromises)
                          .then(() => resolve())
                          .catch(updateErr => reject(updateErr));
                      });
                    });
                  });

                  Promise.all(reduceProductionPromises)
                    .then(() => {
                      // Update the customer_order table
                      const sqlUpdateOrder = `UPDATE customer_order SET Approval = ? WHERE Order_ID = ?`;

                      db.query(sqlUpdateOrder, [Approval, orderId], (err, result) => {
                        if (err) {
                          console.error("Error updating order:", err);
                          return res.status(500).json({ error: "Error updating order" });
                        }
                        console.log("Order updated:", result);
                        return res.json({ message: "Order updated successfully" });
                      });
                    })
                    .catch(updateErr => {
                      console.error("Error updating production table with FIFO:", updateErr);
                      return res.status(500).json({ error: "Error updating production table" });
                    });
                })
                .catch(updateErr => {
                  console.error("Error updating stock:", updateErr);
                  return res.status(500).json({ error: "Error updating stock" });
                });
            });
          })
          .catch(stockErr => {
            console.error("Stock validation error:", stockErr);
            return res.status(400).json({ error: stockErr.message });
          });
      });
    } else {
      // Update the customer_order table
      const sqlUpdateOrder = `UPDATE customer_order SET Approval = ? WHERE Order_ID = ?`;

      db.query(sqlUpdateOrder, [Approval, orderId], (err, result) => {
        if (err) {
          console.error("Error updating order:", err);
          return res.status(500).json({ error: "Error updating order" });
        }
        console.log("Order updated:", result);
        return res.json({ message: "Order updated successfully" });
      });
    }
  });
});


//**************************processs */
app.put('/process_order/:orderId', (req, res) => {
  const orderId = req.params.orderId; 
  const { Process } = req.body;

  console.log(`Received request to update process status for order ${orderId} to ${Process}`);

  // Update the process status in the customer_order table
  const sqlUpdateProcess = `UPDATE customer_order SET Process = ? WHERE Order_ID = ?`;

  db.query(sqlUpdateProcess, [Process, orderId], (err, result) => {
    if (err) {
      console.error('Error updating process status:', err);
      return res.status(500).json({ error: 'Error updating process status' });
    }
    console.log('Process status updated:', result);
    return res.json({ message: 'Process status updated successfully' });
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
  const query = `
    SELECT s.*, 
           COALESCE(CONCAT(staff.Staff_ID, ' - ', staff.Name), 'Admin') as RegisteredBy 
    FROM supplier s
    LEFT JOIN staff ON s.R_User_ID = staff.User_ID
  `;
  db.query(query, (err, result) => {
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
  const { Name, Address1, Address2, Contact_Number, Transport } = req.body;
  
  // Prepare the SQL query with placeholders for all fields
  const sql = 'UPDATE supplier SET Name = ?, Address1 = ?, Address2 = ?, Contact_Number = ?, Transport = ? WHERE Supplier_ID = ?';
  
  // Execute the query with the updated values
  db.query(sql, [Name, Address1, Address2, Contact_Number, Transport, id], (err, result) => {
    if (err) {
      console.error("Error updating supplier:", err);
      res.status(500).send(err);
    } else {
      console.log("Supplier updated successfully");
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
  const { Name, Address1, Address2, Email, Contact_Number } = req.body;
  const sql = 'UPDATE customer SET Name = ?, Address1 = ?, Address2 = ?, Email = ?, Contact_Number = ? WHERE Customer_ID = ?';
  db.query(sql, [Name, Address1, Address2, Email, Contact_Number, id], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({ error: 'Error updating customer' });
      return;
    }
    res.json({ success: true });
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
    SELECT 
      s.Supply_ID, 
      s.Supplier_ID, 
      su.Name, 
      su.Contact_Number, 
      s.Date,
      s.Quantity, 
      s.Payment, 
      s.Payment_Status,
      s.R_User_ID,
      COALESCE(CONCAT(st1.Staff_ID, ' - ', st1.Name), 'Admin') AS RegisteredBy,
      s.U_User_ID,
      COALESCE(CONCAT(st2.Staff_ID, ' - ', st2.Name), 'Admin') AS PaidBy
    FROM 
      supply AS s
    INNER JOIN 
      supplier AS su ON s.Supplier_ID = su.Supplier_ID
    LEFT JOIN 
      staff AS st1 ON s.R_User_ID = st1.User_ID
    LEFT JOIN 
      staff AS st2 ON s.U_User_ID = st2.User_ID
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
  const { Payment_Status, U_User_ID, Payment_Date } = req.body;

  const query = `
    UPDATE supply
    SET Payment_Status = ?,
        U_User_ID = ?,
        Payment_Date = ?
    WHERE Supply_ID = ?
  `;

  db.query(query, [Payment_Status, U_User_ID, Payment_Date, supplyId], (err, result) => {
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
  const { Supplier_ID, Quantity, Date, R_User_ID, Location_Id, Transport_Status } = req.body;
  const transportColumn = Transport_Status === 'With Transport' ? 'Price' : 'Price_WT';

  // Step 1: Get the price from the location table based on the transport status
  const getPriceQuery = `SELECT ${transportColumn} AS Unit_Price FROM location WHERE Location_Id = ?`;

  db.query(getPriceQuery, [Location_Id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Location not found' });
    }

    const unitPrice = result[0].Unit_Price;
    const Payment = unitPrice * Quantity;

    // Step 2: Insert the new supply into the supply table, setting both Quantity and Ava_Quantity to the given Quantity
    const addSupplyQuery = `
      INSERT INTO supply (Supplier_ID, Quantity, Ava_Quantity, Payment, Date, Payment_Status, R_User_ID, Location_Id, Transport_Status)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `;

    db.query(addSupplyQuery, [Supplier_ID, Quantity, Quantity, Payment, Date, R_User_ID, Location_Id, Transport_Status], (err, result) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      } else {
        res.send({ message: 'Supply added successfully.' });
      }
    });
  });
});




//-----------------------------
//oneday
app.post('/transport/request', (req, res) => {
  const { supplierId, size, date, description, agreement } = req.body;

  if (!agreement) {
    return res.status(400).send('You must agree to our price ranges.');
  }

  const query = `INSERT INTO appointment (Supplier_ID, Date, Size, Description) 
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 Date=VALUES(Date), Size=VALUES(Size), Description=VALUES(Description)`;

  db.query(query, [supplierId, date, size, description], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).send('Transport request submitted successfully');
  });
});
//permanant
app.post('/transport/req', (req, res) => {
  const { supplierId, date, description, agreement } = req.body;

  if (!agreement) {
    return res.status(400).send('You must agree to our price ranges.');
  }

  // Check if there's an approved appointment within 30 days
  const checkQuery = `
    SELECT * FROM p_appointment 
    WHERE Supplier_ID = ? 
      AND Approval = 1 
      AND ABS(DATEDIFF(Begin_Date, ?)) < 30
  `;

  db.query(checkQuery, [supplierId, date], (err, results) => {
    if (err) {
      console.error('Error checking existing appointments:', err);
      return res.status(500).send('Server error');
    }

    if (results.length > 0) {
      return res.status(400).send('You cannot place a new appointment within 30 days of an existing approved appointment.');
    }

    // Insert new appointment
    const insertQuery = `
      INSERT INTO p_appointment (Supplier_ID, Begin_Date, Reason) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE Begin_Date=VALUES(Begin_Date), Reason=VALUES(Reason)
    `;

    db.query(insertQuery, [supplierId, date, description], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('Transport request submitted successfully');
    });
  });
});




//-------View Production

// Assuming you're using Express and MySQL
app.get('/viewproduction', (req, res) => {
  const sql = `
    SELECT 
      p.Product_Name, 
      pr.Date, 
      pr.Quantity, 
      COALESCE(CONCAT(st.Staff_ID, ' - ', st.Name), 'Admin') AS EnteredBy,
      pr.P_ID
    FROM 
      production pr
    JOIN 
      product p ON pr.Product_ID = p.Product_ID
    LEFT JOIN
      staff st ON pr.A_User_ID = st.User_ID
  `;
  
  db.query(sql, (err, productions) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Now for each production record, fetch the associated materials
      const promises = productions.map((production) => {
        const materialSql = `
          SELECT rm.R_Name, pm.Quantity AS MaterialQuantity
          FROM production_material pm
          JOIN rawmaterial rm ON pm.R_ID = rm.R_ID
          WHERE pm.P_ID = ?
        `;
        return new Promise((resolve, reject) => {
          db.query(materialSql, [production.P_ID], (err, materials) => {
            if (err) {
              reject(err);
            } else {
              production.Materials = materials; // Add materials to the production record
              resolve(production);
            }
          });
        });
      });

      Promise.all(promises)
        .then((results) => res.send(results))
        .catch((err) => res.status(500).send(err));
    }
  });
});



// Assuming you're using Express and MySQL
app.post('/addproduction', async (req, res) => {
  const { Product_ID, Date, Quantity, A_User_ID, Materials, fishQuantity } = req.body;

  const sqlInsertProduction = 'INSERT INTO production (Product_ID, Date, Quantity, A_User_ID) VALUES (?, ?, ?, ?)';

  db.query(sqlInsertProduction, [Product_ID, Date, Quantity, A_User_ID], async (err, productionResult) => {
    if (err) {
      console.error('Error adding production:', err);
      return res.status(500).send({ message: err.message });
    }

    const productionId = productionResult.insertId;
    console.log(`Production added with ID: ${productionId}`);

    try {
      for (const material of Materials) {
        const requiredMaterialQuantity = material.MaterialQuantity;  // Quantity entered in frontend for this material

        await new Promise((resolve, reject) => {
          const sqlGetRawMaterialID = 'SELECT R_ID FROM rawmaterial WHERE R_Name = ?';
          db.query(sqlGetRawMaterialID, [material.RawMaterial], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return reject(new Error(`Raw material ${material.RawMaterial} not found`));
            const R_ID = result[0].R_ID;

            // Insert directly into production_material using the exact quantity from frontend
            const sqlInsertProductionMaterial = 'INSERT INTO production_material (P_ID, R_ID, Quantity) VALUES (?, ?, ?)';
            db.query(sqlInsertProductionMaterial, [productionId, R_ID, requiredMaterialQuantity], (err, prodMatResult) => {
              if (err) return reject(err);

              const PM_ID = prodMatResult.insertId;

              const sqlGetMaterialLots = 'SELECT A_ID, Ava_Quantity FROM rawmaterial_inv WHERE R_ID = ? AND Ava_Quantity > 0 ORDER BY Date ASC';
              db.query(sqlGetMaterialLots, [R_ID], (err, lots) => {
                if (err) return reject(err);

                let remainingQuantity = requiredMaterialQuantity; // Track quantity still needed from lots

                const allocateFromLots = async () => {
                  for (const lot of lots) {
                    if (remainingQuantity <= 0) break;

                    const availableInLot = lot.Ava_Quantity;
                    const quantityToUse = Math.min(remainingQuantity, availableInLot);

                    console.log(`Using ${quantityToUse} from lot with A_ID: ${lot.A_ID}, available quantity: ${availableInLot}`);

                    await new Promise((lotResolve, lotReject) => {
                      // Insert into material_lot with the unique PM_ID from production_material
                      const sqlInsertMaterialLot = 'INSERT INTO material_lot (A_ID, PM_ID, Quantity) VALUES (?, ?, ?)';
                      db.query(sqlInsertMaterialLot, [lot.A_ID, PM_ID, quantityToUse], (err) => {
                        if (err) return lotReject(err);

                        const newAvaQuantity = availableInLot - quantityToUse;
                        const sqlUpdateAvaQuantity = 'UPDATE rawmaterial_inv SET Ava_Quantity = ? WHERE A_ID = ?';
                        db.query(sqlUpdateAvaQuantity, [newAvaQuantity, lot.A_ID], (err) => {
                          if (err) return lotReject(err);

                          remainingQuantity -= quantityToUse;
                          console.log(`Updated remaining quantity to fulfill for ${material.RawMaterial}: ${Math.max(0, remainingQuantity)}`);
                          lotResolve();
                        });
                      });
                    });
                  }
                };

                allocateFromLots().then(() => resolve()).catch(reject);
              });
            });
          });
        });
      }

      if (fishQuantity > 0) {
        const consumeOptions = {
          method: 'POST',
          url: '/consumeFish',
          data: {
            fishQuantity: fishQuantity,
            P_ID: productionId
          }
        };

        await axios(consumeOptions)
          .then((consumeResponse) => {
            console.log('Fish consumption response:', consumeResponse.data);
            res.status(200).send({ message: 'Production and materials added successfully with FIFO and Ava_Quantity update', P_ID: productionId });
          })
          .catch((error) => {
            console.error('Error during fish consumption:', error);
            res.status(500).send({ message: 'Error consuming fish from supply.', error: error.message });
          });
      } else {
        res.status(200).send({ message: 'Production and materials added successfully with FIFO and Ava_Quantity update', P_ID: productionId });
      }
    } catch (err) {
      console.error('Error processing materials:', err);
      res.status(500).send({ message: err.message });
    }
  });
});




app.post('/consumeFish', (req, res) => {
  const { fishQuantity, P_ID } = req.body;

  if (!P_ID) {
    return res.status(400).json({ message: 'P_ID is required for fish consumption.' });
  }

  let quantityToReduce = fishQuantity;

  db.query(
    `SELECT * FROM supply WHERE Ava_Quantity > 0 ORDER BY Date ASC, Supply_ID ASC`,
    (error, result) => {
      if (error) {
        console.error('Error fetching supplies:', error);
        return res.status(500).json({ message: 'Error fetching supplies from database.', error: error.message });
      }

      const consumeFish = async () => {
        for (const supply of result) {
          if (quantityToReduce <= 0) break; // Stop if we have consumed enough

          const availableQuantity = supply.Ava_Quantity;

          if (availableQuantity > 0) {
            const reduceQuantity = Math.min(availableQuantity, quantityToReduce);

            // Update the available quantity in the supply
            await new Promise((resolve, reject) => {
              db.query(
                `UPDATE supply SET Ava_Quantity = Ava_Quantity - ? WHERE Supply_ID = ?`,
                [reduceQuantity, supply.Supply_ID],
                (err) => {
                  if (err) {
                    console.error(`Error updating Supply_ID ${supply.Supply_ID}:`, err);
                    return reject(err);
                  }
                  resolve();
                }
              );
            });

            // Log the consumption into production_fish
            await new Promise((resolve, reject) => {
              db.query(
                `INSERT INTO production_fish (P_ID, Supply_ID, Quantity) VALUES (?, ?, ?)`,
                [P_ID, supply.Supply_ID, reduceQuantity],
                (insertErr) => {
                  if (insertErr) {
                    console.error('Error logging to production_fish:', insertErr);
                    return reject(insertErr);
                  }
                  console.log(`Logged ${reduceQuantity} of Supply_ID ${supply.Supply_ID} to production_fish`);
                  quantityToReduce -= reduceQuantity; // Reduce the quantity to consume
                  resolve();
                }
              );
            });
          }
        }

        if (quantityToReduce > 0) {
          return res.status(400).json({ message: `Could not consume all fish. ${quantityToReduce} quantity still needed.` });
        }

        res.json({ message: 'Fish consumption and logging updated successfully.' });
      };

      consumeFish().catch(err => {
        console.error('Error during fish consumption:', err);
        res.status(500).json({ message: 'Error consuming fish from supply.', error: err.message });
      });
    }
  );
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
           ri.Lot_Price,
           COALESCE(CONCAT(st.Staff_ID, ' - ', st.Name), 'Admin') AS EnteredBy
    FROM rawmaterial_inv ri
    JOIN rawmaterial rm ON ri.R_ID = rm.R_ID
    LEFT JOIN staff st ON ri.A_User_ID = st.User_ID
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
  const { R_Name, Quantity, Date, Lot_Price, A_User_ID } = req.body;

  // Step 1: Retrieve R_ID for the given R_Name
  const getRIdQuery = `
    SELECT R_ID, Stock FROM rawmaterial WHERE R_Name = ?;
  `;

  db.query(getRIdQuery, [R_Name], (err, result) => {
    if (err) {
      console.error('Error fetching R_ID:', err);
      return res.status(500).send(err);
    } else {
      if (result.length === 0) {
        // Raw material doesn't exist; handle this scenario if needed
        return res.status(404).send('Raw material not found');
      }

      const { R_ID } = result[0];

      // Step 2: Insert new record into rawmaterial_inv with Ava_Quantity
      const insertQuery = `
        INSERT INTO rawmaterial_inv (R_ID, Quantity, Date, Lot_Price, A_User_ID, Ava_Quantity) 
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      
      // Set Ava_Quantity equal to Quantity for the first entry
      const insertValues = [R_ID, Quantity, Date, Lot_Price, A_User_ID, Quantity];

      db.query(insertQuery, insertValues, (err) => {
        if (err) {
          console.error('Error inserting raw material into rawmaterial_inv:', err);
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

/*app.post('/addProduct', (req, res) => {
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
});*/
app.post('/addProduct', upload.single('Image'), (req, res) => {
  const { Product_Name, Cost, Selling_Price } = req.body;
  const imagePath = req.file.path;

  const sql = 'INSERT INTO product (Product_Name, Cost, Selling_Price, Image_Path) VALUES (?, ?, ?, ?)';
  const values = [Product_Name, Cost, Selling_Price, imagePath];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      res.status(500).send({ error: 'Database query failed', details: err });
    } else {
      const productId = result.insertId;
      const newProduct = { Product_ID: productId, Product_Name, Cost, Selling_Price, Image_Path: imagePath, In_Stock: 0 };
      res.status(201).send(newProduct);
    }
  });
});

// Serve static files from the uploads folder
//*************************Supplier Part */
//**********Show location and adress */
app.get('/transport_supplier/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Supplier_ID, Address1, Address2, Location_Id FROM supplier WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Supplier not found" });
    return res.json({
      supplierId: data[0].Supplier_ID,
      address: {
        address1: data[0].Address1,
        address2: data[0].Address2,
      },
      locationId: data[0].Location_Id
    });
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

//************Appointment(Supplier) */

app.get('/appointment/:supplierId', (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = "SELECT * FROM appointment WHERE Supplier_ID = ? AND (Approval = 'Requested' OR Approval = 'Accepted')";
  
  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ appointments: data });
  });
});
/**************************** */
app.get('/final_appointment_S/:supplierId', (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = `
    SELECT * FROM appointment 
    WHERE Supplier_ID = ? 
    AND (Approval = 'Rejected1' OR Approval = 'Rejected2' OR Approval = 'Completed')
  `;
  
  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ appointments: data });
  });
});





//*************** */
// Add this new route to handle updating appointment status
app.put('/appointment/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;
  const { status } = req.body;
  const sql = "UPDATE appointment SET Approval = ? WHERE Appointment_ID = ?";
  
  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ success: true });
  });
});
//--------------Price change
app.get('/api/location_price', (req, res) => {
  const sql = 'SELECT Location_ID AS ID, Location_Name, Price, Price_WT FROM location';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/location_price', (req, res) => {
  const { Location_Name, Price, Price_WT } = req.body;
  const sql = 'INSERT INTO location (Location_Name, Price, Price_WT) VALUES (?, ?, ?)';
  db.query(sql, [Location_Name, Price, Price_WT], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: result.insertId, Location_Name, Price, Price_WT });
  });
});


app.put('/api/location_price/:id', (req, res) => {
  const { id } = req.params;
  const { Price, Price_WT } = req.body;
  const sql = 'UPDATE location SET Price = ?, Price_WT = ? WHERE Location_ID = ?';
  db.query(sql, [Price, Price_WT, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id, Price, Price_WT });
  });
});
//***************************** */
app.get('/api/inventory', (req, res) => {
  const query = 'SELECT Product_Name, In_Stock FROM product';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  }); 
});
//**************************************** */
app.get('/api/p_appointments', (req, res) => {
  const query = `
    SELECT 
      a.Appointment_ID, 
      s.Name AS Supplier_Name, 
      s.Address1,
      s.Address2,
      s.Contact_Number,
      l.Location_Name, 
      a.Begin_Date, 
      a.Reason
      
    FROM 
      p_appointment a
      JOIN supplier s ON a.Supplier_ID = s.Supplier_ID
      JOIN location l ON s.Location_Id = l.Location_Id
  `;
  
  db.query(query, (err, results) => {
    console.log("results")
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
//************************* */
app.get('/api/per_appointments', (req, res) => {
  const query = `
    SELECT 
      a.Appointment_ID, 
      s.Name AS Supplier_Name, 
      s.Address1,
      s.Address2,
      a.Approval,
      s.Contact_Number,
      l.Location_Name, 
      a.Begin_Date, 
      a.Reason
      
    FROM 
      p_appointment a
      JOIN supplier s ON a.Supplier_ID = s.Supplier_ID
      JOIN location l ON s.Location_Id = l.Location_Id
  `;
  
  db.query(query, (err, results) => {
    console.log("results")
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});



//******************************************* */
app.put('/api/p_appointments/:id', (req, res) => {
  const appointmentId = req.params.id;
  const { approval } = req.body;

  const approvalValue = approval ? 1 : 0; // Convert boolean to 1 or 0

  const query = 'UPDATE p_appointment SET Approval = ? WHERE Appointment_ID = ?';
  db.query(query, [approvalValue, appointmentId], (err, result) => {
    if (err) {
      console.error('Error updating appointment approval:', err);
      return res.status(500).send(err);
    }
    console.log(`Appointment ${appointmentId} approval updated to ${approvalValue}`);
    res.send(`Appointment ${appointmentId} approval updated to ${approvalValue}`);
  });
});


//******************************* */
app.get('/api/order_items', (req, res) => {
  const sql = `
    SELECT p.Product_ID, p.Product_Name, SUM(oi.Quantity) AS totalQuantity
    FROM order_item oi
    JOIN product p ON oi.Product_ID = p.Product_ID
    WHERE EXISTS (
      SELECT 1
      FROM approved_order ao
      WHERE ao.Order_ID = oi.Order_ID
    )
    GROUP BY p.Product_ID, p.Product_Name
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
});
//**********Process */
app.get('/api/process_products', (req, res) => {
  const query = `
    SELECT 
  p.Product_ID,
  p.Product_Name,
  p.In_Stock,
  COALESCE(SUM(oi.Quantity), 0) as Total_Quantity_Ordered
FROM product p
LEFT JOIN order_item oi ON p.Product_ID = oi.Product_ID
LEFT JOIN customer_order co ON oi.Order_ID = co.Order_ID
WHERE co.Process = 'Yes' AND co.Approval = 10
GROUP BY p.Product_ID, p.Product_Name, p.In_Stock;
  `;

  // Using db.query to execute SQL query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

//***************** */
app.get('/api/p_appointments', async (req, res) => {
  try {
      const appointments = await fetchAppointmentsFromDatabase(); // Implement this function
      res.json(appointments);
  } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});
//************************* */
app.get('/counts', (req, res) => {
  const customerQuery = 'SELECT COUNT(*) AS count FROM customer';
  const supplierQuery = 'SELECT COUNT(*) AS count FROM supplier';

  db.query(customerQuery, (err, customerResults) => {
    if (err) {
      console.error('Error executing customer query:', err);
      res.status(500).send('Error retrieving customer count');
      return;
    }

    db.query(supplierQuery, (err, supplierResults) => {
      if (err) {
        console.error('Error executing supplier query:', err);
        res.status(500).send('Error retrieving supplier count');
        return;
      }

      res.json({
        customerCount: customerResults[0].count,
        supplierCount: supplierResults[0].count
      });
    });
  });
});
//********************* */

app.put('/rawmaterials/:id', (req, res) => {
  const { id } = req.params;
  const { Buying_Price } = req.body;
  const query = 'UPDATE rawmaterial SET Buying_Price = ? WHERE R_ID = ?';
  db.query(query, [Buying_Price, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});
//*************** */

app.get('/suppliers_by_location', (req, res) => {
  const query = `
    SELECT Location_Name, COUNT(*) AS count
    FROM supplier S
    INNER JOIN location L ON S.Location_ID = L.Location_ID
    GROUP BY Location_Name
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching suppliers by Location:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results);
    }
  });
});

///***********total  */

app.get('/total_products', (req, res) => {
  const query = `
    SELECT Product_Name, In_Stock AS totalQuantity 
    FROM Product;`; // Adjust the table name and fields accordingly

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

///Production Report

app.get('/production_report', (req, res) => {
  const { start, end } = req.query;

  const query = `
      SELECT
          p.P_ID AS productionId,
          pr.Product_Name AS productName,
          p.Date,
          pm.R_ID AS rawMaterialId,
          r.R_Name AS materialName,
          pm.Quantity AS materialQuantity,
          ml.A_ID AS lotId,
          ml.Quantity AS lotQuantity,
          ri.Lot_Price AS lotPrice,
          (ml.Quantity * ri.Lot_Price) AS cost,
          COALESCE(SUM(pf.Quantity), 0) AS fishQuantity,
          s.Supply_ID AS fishLotId,
          pf.Quantity AS fishLotQuantity,
          (s.Payment / s.Quantity) AS fishLotPrice,
          (pf.Quantity * (s.Payment / s.Quantity)) AS fishCost,
          ((ml.Quantity * ri.Lot_Price) + (pf.Quantity * (s.Payment / s.Quantity))) AS totalCost
      FROM
          production p
      JOIN
          product pr ON p.Product_ID = pr.Product_ID
      JOIN
          production_material pm ON p.P_ID = pm.P_ID
      JOIN
          rawmaterial r ON pm.R_ID = r.R_ID
      JOIN
          material_lot ml ON pm.PM_ID = ml.PM_ID
      JOIN
          rawmaterial_inv ri ON ml.A_ID = ri.A_ID
      LEFT JOIN
          production_fish pf ON pf.P_ID = p.P_ID
      LEFT JOIN
          supply s ON pf.Supply_ID = s.Supply_ID
      WHERE
          p.Date BETWEEN ? AND ?
      GROUP BY
          p.P_ID, pr.Product_Name, p.Date, pm.R_ID, r.R_Name, pm.Quantity, ml.A_ID, ml.Quantity, ri.Lot_Price,
          s.Supply_ID, pf.Quantity, s.Payment, s.Quantity
  `;

  db.query(query, [start, end], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ message: 'Failed to fetch production data', error: error.message });
      }

      // Loop through results to update the cost in the production table
      const updateQueries = results.map(result => {
          return new Promise((resolve, reject) => {
              const updateQuery = `
                  UPDATE production
                  SET Cost = ?
                  WHERE P_ID = ?
              `;
              db.query(updateQuery, [result.totalCost, result.productionId], (err) => {
                  if (err) {
                      console.error('Error updating cost:', err);
                      return reject(err);
                  }
                  resolve();
              });
          });
      });

      // Execute all update queries
      Promise.all(updateQueries)
          .then(() => {
              res.json(results);
          })
          .catch(err => {
              console.error('Error updating costs:', err);
              res.status(500).json({ message: 'Failed to update production costs', error: err.message });
          });
  });
});

//****forecast */
app.get('/revenue', (req, res) => {
  const { start, end } = req.query;

  // Validate that both start and end dates are provided
  if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
  }

  // Convert dates to the correct format if needed
  const startDate = moment(start).format('YYYY-MM-DD');
  const endDate = moment(end).format('YYYY-MM-DD');

  const query = `
  SELECT ao.Order_ID, co.Deliver_Date, ao.Payment, oi.Product_ID, p.Product_Name, oi.Quantity AS Order_Quantity, 
         il.P_ID AS Production_No, il.Quantity AS Lot_Quantity, 
         pr.Cost AS Production_Cost, pr.Quantity AS Production_Quantity
  FROM approved_order ao
  JOIN customer_order co ON ao.Order_ID = co.Order_ID
  JOIN order_item oi ON ao.Order_ID = oi.Order_ID
  JOIN product p ON oi.Product_ID = p.Product_ID
  JOIN item_lot il ON oi.Item_O_ID = il.Item_O_ID
  JOIN production pr ON il.P_ID = pr.P_ID
  WHERE co.Deliver_Date BETWEEN ? AND ?;
`;


  db.query(query, [startDate, endDate], (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          return res.status(500).json({ error: 'Failed to fetch data' });
      }
      // Send the results back
      res.json(results);
  });
});


//-------------------------------------------
app.listen(8081,()=>{
    console.log ("listening...")
})


