import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Testing } from './components/Testing';
import {Dashboard} from './components/admin/Dashboard.tsx';
import {UserList} from "./components/admin/UserList";
import {PaymentList} from "./components/admin/PaymentList";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Testing />}></Route>
        <Route path="/admin" element={<Dashboard/>}></Route>
        <Route path="/userlist" element={<UserList/>}></Route>
      <Route path="/PaymentHistory" element={<PaymentList/>}> </Route>
    </Routes>
  );
}

export default App;
