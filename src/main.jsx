import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Root from './layouts/Root.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import JoinEmployee from './pages/JoinEmployee.jsx';
import JoinHr from './pages/JoinHr.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import AuthProvider from './Context/AuthProvider.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import RequestAsset from './pages/dashboard/EmployeeDashboard/RequestAsset.jsx';
import MyTeam from './pages/dashboard/EmployeeDashboard/MyTeam.jsx';
import AssetList from './pages/dashboard/HRdashboard/AssetList.jsx';
import Requests from './pages/dashboard/HRdashboard/Requests.jsx';
import EmployeeList from './pages/dashboard/HRdashboard/EmployeeList.jsx';
import HrProfile from './pages/dashboard/HRdashboard/Profile.jsx';
import MyAssets from './pages/dashboard/EmployeeDashboard/MyAssets.jsx';
import Profile from './pages/dashboard/EmployeeDashboard/Profile.jsx';
import AddAsset from './pages/dashboard/HRdashboard/AddAsset.jsx';
import EditProfile from './pages/dashboard/EmployeeDashboard/EditProfile.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Upgrade from './pages/dashboard/HRdashboard/Upgrade.jsx';
import UpgradeSuccess from './pages/dashboard/HRdashboard/UpgradeSuccess.jsx';
import UpgradeCancel from './pages/dashboard/HRdashboard/UpgradeCancel.jsx';
import Redirect from './pages/dashboard/Redirect.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/join-employee',
        element: <JoinEmployee></JoinEmployee>,
      },
      {
        path: '/join-hr',
        element: <JoinHr></JoinHr>,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword></ForgotPassword>,
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Redirect></Redirect>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/my-assets',
        element: (
          <PrivateRoute>
            <MyAssets></MyAssets>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/request-asset',
        element: (
          <PrivateRoute>
            <RequestAsset></RequestAsset>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/my-team',
        element: (
          <PrivateRoute>
            <MyTeam></MyTeam>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/employeeProfile',
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: '/employeeEditProfile',
        element: (
          <PrivateRoute>
            <EditProfile></EditProfile>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/asset',
        element: (
          <PrivateRoute>
            <AssetList></AssetList>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/add-asset',
        element: (
          <PrivateRoute>
            <AddAsset></AddAsset>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/Allrequests',
        element: (
          <PrivateRoute>
            <Requests></Requests>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/employees',
        element: (
          <PrivateRoute>
            <EmployeeList></EmployeeList>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/upgrade',
        element: (
          <PrivateRoute>
            <Upgrade></Upgrade>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/upgrade-success',
        element: (
          <PrivateRoute>
            <UpgradeSuccess></UpgradeSuccess>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/upgrade-cancelled',
        element: (
          <PrivateRoute>
            <UpgradeCancel></UpgradeCancel>
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/HRprofile',
        element: (
          <PrivateRoute>
            <HrProfile></HrProfile>
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <ErrorPage></ErrorPage>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
);
