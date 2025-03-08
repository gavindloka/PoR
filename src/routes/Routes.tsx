import LoginPage from '@/pages/LoginPage';
import App from '@/App';
import { createBrowserRouter, Navigate } from 'react-router';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import AnswerForm from '@/pages/AnswerForm';
import TestPage from '@/pages/TestPage';
import GetVerifiedPage from '@/pages/GetVerifiedPage';
import ProfilePage from '@/pages/ProfilePage';
import { Survey } from '@/pages/Survey';
import FormManagement from '@/pages/MyFormPage';
import BrowseSurveys from '@/pages/BrowsePage';
import { WrapTest } from '@/components/WrapTest';
import FormResponsePage from '@/pages/FormResponsePage';

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
        path: '/forms/:id',
        element: <Survey />,
      },
      {
        path: '/forms',
        element: <FormManagement />,
      },
      {
        path: '/forms/:id/answer',
        element: <AnswerForm />,
      },
      {
        path: '/forms/:id/responses',
        element: <FormResponsePage />,
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
        element: <WrapTest />,
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
