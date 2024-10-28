import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Login from './page/Login';
import ProductCart from './page/ProductCart';
import SupplierHome from './page/Supplier/SupplierHome';
import Transport from './page/Supplier/Transport';
import Spayment from './page/Supplier/Spayment';
import Onedayt from './page/Supplier/Onedayt';
import AcAppointment from './page/Employee/AcAppointment';
import CusHome from './page/Customer/CusHome';
import OCalendar from './page/Customer/OCalendar';
import EmployeeHome from './page/Employee/EmployeeHome';
import Orders from './page/Customer/Orders';
import AdminHome from './page/Admin/AdminHome';
import ChangePW from './page/ChangePW';
import CusPayment from './page/Customer/CusPayment';
import ViewAppointment from './page/Admin/ViewAppointment';
import ViewOrders from './page/Admin/ViewOrders';
import NewOrders from './page/Admin/NewOrders';
import ViewSupplier from './page/Admin/ViewSupplier';
import ViewCustomer from './page/Admin/ViewCustomer';
import ViewStaff from './page/Admin/ViewStaff';
import PriceRange from './page/Admin/PriceRange';
import SupPayment from './page/Admin/SupPayment';
import RawMaterial from './page/Admin/RawMaterial';
import Production from './page/Admin/Production';
import Material from './page/Admin/Material';
import EmpViewSupplier from './page/Employee/EmpViewSupplier';
import EmpViewAppoi from './page/Employee/EmpViewAppoi';
import EmpProduction from './page/Employee/EmpProduction';
import EmpRawMaterial from './page/Employee/EmpRawMaterial';
import EmpSupPay from './page/Employee/EmpSupPay';
import PendingApp from './page/Employee/PendingApp';
import FTest from './page/Employee/FTest';
import AddSupplier from './page/Admin/AddSupplier';
import Product from './page/Admin/Product';
import ProductionReport from './page/ProductionReport.jsx';

import './App.css';
import logo from './logo.svg';

function AdminAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Admin') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && userType == 'Admin' ? children : null; 
}

//********************************************************** */
function EmployeeAuth({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userType = user ? user.User_Type : null;

  useEffect(() => {
    console.log(user,userType)
    if (!user || userType !== 'Employee') {
      navigate('/'); 
    }
  }, [user, userType, navigate]);

  return user && (userType == 'Admin'|| userType == 'Employee' )? children : null;
}




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

        <Route path='/adminhome' element={<AdminAuth><AdminHome /></AdminAuth>}></Route>
        <Route path='/viewsupplier' element={<AdminAuth><ViewSupplier /></AdminAuth>}></Route>
        <Route path='/viewcustomer' element={<AdminAuth><ViewCustomer /></AdminAuth>}></Route>
        <Route path='/viewstaff' element={<AdminAuth><ViewStaff /></AdminAuth>}></Route>
        <Route path='/vieworders' element={<AdminAuth><ViewOrders /></AdminAuth>}></Route>
        <Route path='/neworders' element={<AdminAuth><NewOrders /></AdminAuth>}></Route>
        <Route path='/production' element={<AdminAuth><Production /></AdminAuth>}></Route>
        <Route path='/rawmaterial' element={<AdminAuth><RawMaterial /></AdminAuth>}></Route>
        <Route path='/suppayment' element={<AdminAuth><SupPayment /></AdminAuth>}></Route>
        <Route path='/product' element={<AdminAuth><Product /></AdminAuth>}></Route>  
        <Route path='/material' element={<AdminAuth><Material /></AdminAuth>}></Route>
        <Route path='/pricerange' element={<AdminAuth><PriceRange /></AdminAuth>}></Route>

        <Route path='/emphome' element={<EmployeeAuth><EmployeeHome/></EmployeeAuth>}></Route>









          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/SupplierHome' element={<SupplierHome />}></Route>
          <Route path='/transport' element={<Transport />}></Route>
          <Route path='/spayment' element={<Spayment />}></Route>
          <Route path='/cpayment' element={<CusPayment />}></Route>
          <Route path='/cushome' element={<CusHome />}></Route>
       
          <Route path='/orders' element={<Orders />}></Route>
          
          <Route path='/changepw' element={<ChangePW />}></Route>
          <Route path='/viewappointment' element={<AdminAuth><ViewAppointment /></AdminAuth>}></Route>


        
   
          <Route path='/ocalendar' element={<OCalendar />}></Route>

          <Route path='/empviewsupplier' element={<EmpViewSupplier />}></Route>
          <Route path='/empviewappoi' element={<EmpViewAppoi />}></Route>
          <Route path='/empproduction' element={<EmpProduction />}></Route>
          <Route path='/emprawmaterial' element={<EmpRawMaterial />}></Route>
          <Route path='/empsuppay' element={<EmpSupPay />}></Route>
          <Route path='/onedayt' element={<Onedayt />}></Route>
          <Route path='/acappointment' element={<AcAppointment />}></Route>
          <Route path='/pendingapp' element={<PendingApp />}></Route>
          <Route path='/ftest' element={<FTest />}></Route>
          <Route path='/newsupplier' element={<AdminAuth><AddSupplier /></AdminAuth>}></Route>
          <Route path='/productcart' element={<ProductCart />}></Route>
          <Route path='/ProductionReport' element={<ProductionReport />}></Route>
    
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
