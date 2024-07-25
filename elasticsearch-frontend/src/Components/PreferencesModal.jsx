import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import trackedAllergens from '../Util/TrackedAllergens';

export default function MultiStepModal({ initialItems, onModalClose, onItemUpdate, onContinueClicked }) {
    const [items, setItems] = useState(initialItems || []);
    const [newItem, setNewItem] = useState('');
    const [newReason, setNewReason] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const handleAddItem = () => {
        if (newItem && newReason) {
            const selectedAllergen = trackedAllergens.find(allergen => allergen.key === newItem);
            if (items.filter(x => x.food_target === newItem).length !== 0) {
                enqueueSnackbar('Item Already Selected!', {
                    variant: 'info'
                });
                return;
            }
            const updatedItems = [...items, { food_target: selectedAllergen.key, display_name: selectedAllergen.display_name, reason: newReason }];
            setItems(updatedItems);
            onItemUpdate(updatedItems);
            setNewItem('');
            setNewReason('');
        }
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, idx) => idx !== index);
        setItems(updatedItems);
        onItemUpdate(updatedItems);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-lg z-10 w-2/3 h-2/3 flex flex-col relative overflow-hidden">
                <button onClick={onModalClose} className="text-lg absolute top-2 left-2">&times;</button>
                <h2 className="text-xl font-bold text-center mb-4">Selected Preferences</h2>
                <div className="flex flex-grow overflow-hidden">
                    <div className="flex-grow p-4 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{trackedAllergens.find(allergen => allergen.key === item.food_target).display_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/3 flex flex-col items-center p-4 bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] rounded-md m-4">
                        <select
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="mb-4 p-2 border rounded w-full"
                        >
                            <option value="">Select Food Item</option>
                            {trackedAllergens.map((allergen, index) => (
                                <option key={index} value={allergen.key}>{allergen.display_name}</option>
                            ))}
                        </select>
                        <select
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            className="mb-4 p-2 border rounded w-full"
                        >
                            <option value="">Select Reason</option>
                            <option value="Allergy">Allergy</option>
                            <option value="Preference">Preference</option>
                            <option value="Diet">Diet</option>
                        </select>
                        <button onClick={handleAddItem} className="p-2 bg-blue-500 text-white rounded-md w-full mt-auto">Add +</button>
                    </div>
                </div>
                <button onClick={onContinueClicked} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full mt-4 self-center">
                    Continue →
                </button>
            </div>
        </div>
    );
}
