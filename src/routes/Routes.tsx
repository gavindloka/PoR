import LoginPage from '@/pages/LoginPage';
import App from '@/App';
import { createBrowserRouter, Navigate } from 'react-router';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import FormEditor from '@/pages/FormEditor';
import AnswerForm from '@/pages/AnswerForm';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/FormEditor',
        element: <FormEditor />,
      },
      {
        path: '/AnswerForm',
        element: <AnswerForm />,
      },
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
]);
