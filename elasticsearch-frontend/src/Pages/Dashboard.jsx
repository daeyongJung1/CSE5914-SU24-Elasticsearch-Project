import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import DataRow from '../Components/DataRow';
import PreferencesModal from '../Components/PreferencesModal';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import ResultsModal from '../Components/ResultsModal';

const Dashboard = () => {
    const { user, processUserUpdate, logout } = useAuth();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [userPreferences, setUserPreferences] = useState(user?.preferences ? user.preferences : []);
    const [userQueries, setUserQueries] = useState(user?.queries ? user.queries : []);
    const [selectedResult, setSelectedResult] = useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const processUserPreferencesUpdate = () => {
        setShowAddModal(false);
        axios.patch(process.env.REACT_APP_API_URL + '/user/preferences', {
            preferences: userPreferences
        }).then(({ data }) => {
            processUserUpdate(data);
        }).catch(ex => {
            enqueueSnackbar("Error Syncing With Cloud", {
                variant: "error"
            });
        });
    };

    const removeAccount = () => {
        const password = prompt("Please enter your password to delete your account:");
        if (!password) return;
        
        axios.post(process.env.REACT_APP_API_URL + '/user/delete', {
            password: password
        }).then(() => {
            enqueueSnackbar("Account deleted successfully", {
                variant: "success"
            });
            logout();
        }).catch(ex => {
            enqueueSnackbar("Error deleting account", {
                variant: "error"
            });
        });
    }

    return (
        <div className="flex grow p-4">
            <div className="w-1/6 p-4 rounded-lg bg-gray-100 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] max-h-[85vh]">
                <h1 className="text-xl font-bold mb-2">Welcome Back,</h1>
                <p className="mb-10 text-gray-500">{user ? user.username : ""}</p>
                <button onClick={() => setShowAddModal(true)} className="w-full bg-gray-200 text-black font-semibold py-2 px-4 rounded mb-4 hover:bg-gray-300">Edit Avoidances</button>
                <button onClick={removeAccount} className="w-full bg-gray-200 text-black font-semibold py-2 px-4 rounded mb-4 hover:bg-gray-300">Delete Account</button>
            </div>
            <div className="flex w-5/6 ml-4">
                <div className="w-1/4 flex flex-col bg-gray-100 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] p-4 overflow-y-auto max-h-[85vh]">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-300 font-bold mt-8">
                        <div className="w-2/3">Food Item</div>
                        <div className="w-1/3">Reason</div>
                    </div>
                    {userPreferences.map((item, index) => (
                        <div key={"preferences-" + index} className="flex justify-between py-2 px-4 border-b border-gray-200">
                            <div className="w-2/3 break-words">{item.display_name}</div>
                            <div className="w-1/3 break-words">{item.reason}</div>
                        </div>
                    ))}
                </div>
                <div className="w-3/4 bg-gray-100 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] p-4 overflow-y-auto max-h-[85vh] ml-4">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-300 font-bold mt-8">
                        <div className="w-1/2">Query</div>
                        <div className="w-1/4">Results</div>
                        <div className="w-1/4">Actions</div>
                    </div>
                    {userQueries.map((item, index) => (
                        <div key={index} className="flex flex-row justify-between items-center py-2 px-4 border-b border-gray-200">
                            <div className="w-1/2 truncate ">
                                {item.query}
                            </div>
                            <div className="w-1/4 break-words">
                                <div className={`mx-2 py-1 rounded-md ${item.results.length === 0 ? 'bg-green-500' : 'bg-red-500'} text-white text-center`}>
                                    {item.results.length === 0 ? 'Clean' : `${item.results.length} match${item.results.length > 1 ? 'es' : ''} found`}
                                </div>
                            </div>
                            <div className="w-1/4">
                                <button onClick={() => {
                                    setSelectedResult({
                                        query: item.query,
                                        queryType: item.queryType,
                                        results: item.results
                                    });
                                    setShowResultsModal(true);
                                }} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out hover:scale-105">
                                    Details<i className="fas fa-info-circle ml-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showAddModal && (
                <PreferencesModal
                    onModalClose={() => setShowAddModal(false)}
                    onContinueClicked={processUserPreferencesUpdate}
                    initialItems={userPreferences}
                    onItemUpdate={(items) => setUserPreferences(items)}
                />
            )}
            {showResultsModal && (
                <ResultsModal
                    onModalClose={() => setShowResultsModal(false)}
                    query={selectedResult.query}
                    queryType={selectedResult.queryType}
                    data={selectedResult.results}              
                />
            )}
        </div>
    );
};

export default Dashboard;
