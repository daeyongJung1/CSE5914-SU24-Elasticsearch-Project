// src/components/DataRow.js

import React from 'react';

const DataRow = ({ item1, item2, item3 }) => {
    return (
        <div className="flex justify-between py-2 px-4 border-b border-gray-200">
            <div className="w-1/3 break-words">{item1}</div>
            <div className="w-1/3 break-words">{item2}</div>
            <div className="w-1/3 break-words">{item3}</div>
        </div>
    );
};

export default DataRow;
