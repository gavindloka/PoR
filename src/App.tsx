import { AgentProvider, useQueryCall, useUpdateCall } from '@ic-reactor/react';
import './App.css';
import { Outlet } from 'react-router';
import { MainLayout } from './components/layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="">
      <AgentProvider withProcessEnv>
        <AuthProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </AuthProvider>
      </AgentProvider>
    </div>
  );
}

export default App;
