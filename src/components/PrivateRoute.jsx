import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import RobotLoader from './RobotLoader/RobotLoader';
import './RobotLoader/RobotLoader.css';


const PrivateRoute = ({ children }) => {

    const { user, loading } = use(AuthContext)

    const location = useLocation();


    if (loading) {
        return <RobotLoader></RobotLoader>
    }

    // Firebase session restored → allow access even if backend profile is unavailable
    if (user && user?.email) {
        return children
    }
    return <Navigate state={{ from: location }} to='/login'></Navigate>

};

export default PrivateRoute;