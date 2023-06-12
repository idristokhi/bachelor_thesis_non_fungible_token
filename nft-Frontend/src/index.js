import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Create from './routes/Create';
import Account from './routes/Account';
import Navbar from './components/Navbar/NavigationBar';
import { Web3Provider } from './components/providers';

const AppLayout = () => {
  return (
    <>
      <Web3Provider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Create" element={<Create />} />
          <Route path="Account" element={<Account />} />
        </Routes>
      </Web3Provider>
    </>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(<Router>
  <AppLayout />
</Router>);
