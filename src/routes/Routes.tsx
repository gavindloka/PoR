import LoginPage from '@/pages/LoginPage';
import App from '@/App';
import { createBrowserRouter, Navigate } from 'react-router';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import FormEditor from '@/pages/FormEditor';
import AnswerForm from '@/pages/AnswerForm';
import TestPage from '@/pages/TestPage';
import GetVerifiedPage from '@/pages/GetVerifiedPage';
import ProfilePage from '@/pages/ProfilePage';
import { AddSurvey } from '@/pages/AddSurvey';
import FormManagement from '@/pages/MyForm';
import BrowseSurveys from '@/pages/BrowsePage';

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
        path: '/forms/new',
        element: <AddSurvey />,
      },
      {
        path: '/forms',
        element: <FormManagement />,
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
        path: '/browse',
        element: <BrowseSurveys />,
      },
      {
        path: '/test',
        element: <TestPage />,
      },
      {
        path: '/verified',
        element: <GetVerifiedPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
]);
