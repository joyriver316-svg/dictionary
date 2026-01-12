import React from 'react';
import LNB from './LNB';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <LNB />
            <main className="flex-1 h-full overflow-hidden flex flex-col relative">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
