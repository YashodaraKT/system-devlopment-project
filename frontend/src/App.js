import logo from './logo.svg';
import './App.css';
import Home from './page/Home';
import Login from './page/Login';
import Signup from './page/Signup';
import SupplierHome from './page/Supplier/SupplierHome';
import Transport from './page/Supplier/Transport';
import Spayment from './page/Supplier/Spayment';
import CusHome from './page/Customer/CusHome';
import EmployeeHome from './page/Employee/EmployeeHome'; 
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Orders from './page/Customer/Orders';


function App() {
  return (
    <div className="App">
  <BrowserRouter>
<Routes>
<Route path='/' element={<Home/>}></Route>
<Route path='/login' element={<Login/>}></Route>
<Route path='/signup' element={<Signup/>}></Route>
<Route path='/SupplierHome' element={<SupplierHome/>}></Route>
<Route path='/transport' element={<Transport/>}></Route>
<Route path='/spayment' element={<Spayment/>}></Route>
<Route path='/cushome' element={<CusHome/>}></Route>
<Route path='/emphome' element={<EmployeeHome/>}></Route>
<Route path='/orders' element={<Orders/>}></Route>
</Routes>


  </BrowserRouter>
    </div>
  );
}

export default App;
