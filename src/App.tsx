import { AgentProvider, useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { Outlet } from 'react-router';
import { MainLayout } from './components/layouts/MainLayout';

function App() {
  return (
    <div className="">
      <AgentProvider>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </AgentProvider>
    </div>
  );
}

export default App;
