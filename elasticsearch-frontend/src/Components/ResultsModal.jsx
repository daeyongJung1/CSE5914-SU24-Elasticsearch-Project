import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import trackedAllergens from '../Util/TrackedAllergens';

export default function ResultsModal({ query, queryType, data, onModalClose }) {
    console.log(data);

    const { enqueueSnackbar } = useSnackbar();

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-lg z-10 w-2/3 h-3/4 flex flex-col relative">
                <button onClick={onModalClose} className="text-lg absolute top-2 left-2">&times;</button>
                <div className="flex flex-col mb-4">
                    <h2 className="text-xl font-bold text-center mt-5">Results</h2>
                </div>
                <div className="flex flex-col mt-5 ml-5">
                    <h2 className="text-large font-semibold text-start">Query</h2>
                    <h3 className="text-sm font-semibold text-start text-gray-500">{query}</h3>
                </div>
                <div className="flex-grow mb-4 overflow-auto mt-4">
                    <h2 className="text-xl font-bold text-center">Matched Avoidances</h2>
                    <div className="flex flex-grow">
                        <div className="flex-grow p-4 overflow-auto rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergy Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger Foods</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{trackedAllergens.find(allergen => allergen.key === item.allergen).display_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.ingredients.map((ingredient, idx) => (
                                                        <span key={idx} className="bg-red-500 text-white px-2 py-1 rounded-md">{ingredient}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                    <p>These are food item matches from your search. They may not be part of the recipe</p>
                </div>
            </div>
        </div>
    );
}
