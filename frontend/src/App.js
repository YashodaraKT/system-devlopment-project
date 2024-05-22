import logo from './logo.svg';
import './App.css';
import Home from './page/Home';
import Login from './page/Login';
import SupplierHome from './page/Supplier/SupplierHome';
import Transport from './page/Supplier/Transport';
import Spayment from './page/Supplier/Spayment';
import CusHome from './page/Customer/CusHome';
import OCalendar from './page/Customer/OCalendar';
import EmployeeHome from './page/Employee/EmployeeHome'; 
import { BrowserRouter,Routes,Route } from 'react-router-dom';
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
import SupPayment from './page/Admin/SupPayment';


function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>
<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/SupplierHome' element={<SupplierHome/>}></Route>
<Route path='/transport' element={<Transport/>}></Route>
<Route path='/spayment' element={<Spayment/>}></Route>
<Route path='/cpayment' element={<CusPayment/>}></Route>
<Route path='/cushome' element={<CusHome/>}></Route>
<Route path='/emphome' element={<EmployeeHome/>}></Route>
<Route path='/orders' element={<Orders/>}></Route>
<Route path='/adminhome' element={<AdminHome/>}></Route>
<Route path='/changepw' element={<ChangePW/>}></Route>
<Route path='/viewappointment' element={<ViewAppointment/>}></Route>
<Route path='/vieworders' element={<ViewOrders/>}></Route>
<Route path='/neworders' element={<NewOrders/>}></Route>
<Route path='/viewsupplier' element={<ViewSupplier/>}></Route>
<Route path='/viewcustomer' element={<ViewCustomer/>}></Route>
<Route path='/viewstaff' element={<ViewStaff/>}></Route>
<Route path='/suppayment' element={<SupPayment/>}></Route>
<Route path='/ocalendar' element={<OCalendar/>}></Route>
</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
