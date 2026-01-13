import React from 'react';
// import LNB from './LNB'; // Removed old LNB
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden flex-col">
            {/* Top Header */}
            <Header />

            {/* Main Content Area with Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 h-full overflow-hidden flex flex-col relative bg-gray-50 p-6">
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
