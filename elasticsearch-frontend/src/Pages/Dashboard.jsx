// src/components/Dashboard.js

import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import DataRow from '../Components/DataRow';

const Dashboard = () => {
    const { user } = useAuth();

    const [showAddModal, setShowAddModal] = useState(false)

    // Sample data arrays
    const foodData = [
        { foodItem: 'Dairy', reason: 'Allergy', action: 'Delete' },
        { foodItem: 'Gluten', reason: 'Allergy', action: 'Delete' },
        { foodItem: 'Pickles', reason: 'Preference', action: 'Delete' },
    ];

    const queryData = [
        { query: 'https://natashaskitchen.com/perfect-burger-recipe/', results: 'Clean!', actions: 'Delete' },
        {
            query: `Sliced cheese (our favorite is thick-sliced, medium cheddar)
                    Dill pickle slices
                    Fresh red onions (or caramelized onions)
                    Tomato,
                    Green leaf or iceberg lettuce,
                    Avocado
                    Bacon + pineapple + the BBQ sauce below
                    Jalapeños to add some heat `, results: 'Pickles', actions: 'Delete'
        },
    ];

    return (
        <div className="flex grow p-4">
            <div className="w-72 p-4 rounded-lg bg-gray-100 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]">
                <h1 className="text-xl font-bold mb-2">Welcome Back,</h1>
                <p className="mb-10 text-gray-500">{user.user}</p>
                <button className="w-full bg-gray-200 text-black font-semibold py-2 px-4 rounded mb-4 hover:bg-gray-300">Add Avoidance</button>
                <button className="w-full bg-gray-200 text-black font-semibold py-2 px-4 rounded mb-4 hover:bg-gray-300">Reset Password</button>
            </div>
            <div className="flex w-full ml-4 grid grid-cols-2 gap-4">
                <div className="flex-grow bg-gray-100 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] p-4 overflow-y-auto">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-300 font-bold mt-8">
                        <div className="w-1/3">Food Item</div>
                        <div className="w-1/3">Reason</div>
                        <div className="w-1/3">Action</div>
                    </div>
                    {foodData.map((item, index) => (
                        <DataRow
                            key={index}
                            item1={item.foodItem}
                            item2={item.reason}
                            item3={item.action}
                        />
                    ))}
                </div>
                <div className="flex-grow bg-gray-100 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] p-4 overflow-y-auto">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-300 font-bold mt-8">
                        <div className="w-1/3">Query</div>
                        <div className="w-1/3">Results</div>
                        <div className="w-1/3">Actions</div>
                    </div>
                    {queryData.map((item, index) => (
                        <DataRow
                            key={index}
                            item1={item.query}
                            item2={item.results}
                            item3={item.actions}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
