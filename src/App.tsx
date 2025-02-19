import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { Outlet } from 'react-router';

function App() {

  return (
    <div className="w-full flex">
        <Outlet />
    </div>
  );
}

export default App;
