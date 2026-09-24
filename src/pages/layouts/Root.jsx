import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useNavigation } from 'react-router';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';
import RobotLoader from '../components/RobotLoader/RobotLoader';
import '../components/RobotLoader/RobotLoader.css';

const Root = () => {

    const { state } = useNavigation();

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <Navbar></Navbar>
            {state == "loading" ? <RobotLoader></RobotLoader> : <Outlet></Outlet>}
            <Footer></Footer>
            <Toaster position="top-center"
                reverseOrder={false}></Toaster>
        </div>
    );
};

export default Root;