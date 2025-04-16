

import React from 'react';

import styles from './Account.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import AccountDashboard from '../../components/AccountDashboard/AccountDashboard'; // ✅ New Component

const Account = () => {
    return (
        <div className={styles.accountContainer}>
            <Navbar />
            <div className={styles.mainContent}>
                <Sidebar />
                <div className={styles.content}>
                    <h2>Account Dashboard</h2>
                    <AccountDashboard /> {/* ✅ New Component Added */}
                </div>
            </div>
        </div>
    );
};

export default Account;
