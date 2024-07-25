import React, { useState } from 'react';
import PreferencesModal from '../Components/PreferencesModal';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import ResultsModal from '../Components/ResultsModal';
import { useAuth } from '../Contexts/AuthContext';

export default function Home() {
    const [inputType, setInputType] = useState('link');
    const [userInput, setUserInput] = useState(null);
    const [userPreferences, setUserPreferences] = useState([])

    const [showModal, setShowModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false)
    const [queryResults, setQueryResults] = useState(null)

    const { enqueueSnackbar } = useSnackbar()
    const { user, processUserUpdate } = useAuth();

    const submitUserInput = (avoidances) => {
        enqueueSnackbar("Processing", {
            variant: 'info'
        })
        setShowModal(false);
        console.log(avoidances)

        var payload = {
            user_allergies: avoidances.map(x => x.food_target),
            useSelenium: false
        };

        if (inputType === "link") {
            payload["url"] = userInput;
        } else {
            payload["text_blob"] = userInput;
        }
        axios.post(process.env.REACT_APP_ES_URL, payload).then(({ data }) => {
            console.log(data)
            let formattedData = formatData(data);
            if (user) {
                let tempUser = { ...user }

                tempUser.queries.unshift({
                    query_type: inputType,
                    query: userInput,
                    has_flag: data.length > 0,
                    results: formattedData,
                    date: Date.now()
                })

                if (tempUser.queries.length > 10) {
                    tempUser.queries = tempUser.queries.slice(0, 10)
                }

                axios.patch(process.env.REACT_APP_API_URL + '/user/queries', {
                    queries: tempUser.queries
                }).then(({ data }) => {
                    processUserUpdate(data);
                }).catch(ex => {
                    enqueueSnackbar("Error Syncing With Cloud", {
                        variant: "error"
                    });
                });
            }

            setQueryResults(formattedData)
            setShowResultsModal(true)
        }).catch(ex => {

            console.log(ex)

            enqueueSnackbar('Error Reviewing!', {
                variant: 'error'
            })
        })
    }

    function formatData(data) {
        const categorizedResults = data.reduce((acc, curr) => {
            const categoryIndex = acc.findIndex(item => item.allergen === curr.allergen);

            if (categoryIndex > -1) {
                if (!acc[categoryIndex].ingredients.includes(curr.ingredient)) {
                    acc[categoryIndex].ingredients.push(curr.ingredient);
                }
            } else {
                acc.push({ allergen: curr.allergen, ingredients: [curr.ingredient] });
            }

            return acc;
        }, []);

        return categorizedResults;
    }

    const openPreferencesModal = () => {
        if (inputType == 'link' && userInput.substring(0, 5).toLowerCase() != 'https') return enqueueSnackbar('Input Type Mismatch!', {
            variant: 'error'
        })

        if (inputType == 'text' && userInput.substring(0, 5).toLowerCase() == 'https') return enqueueSnackbar('Input Type Mismatch!', {
            variant: 'error'
        })

        if (user != null && user.preferences.length > 0) {
            submitUserInput(user.preferences)
        }
        else if (user != null) {
            enqueueSnackbar("You can save preferences in your account!", {
                variant: "info"
            })
            setShowModal(true);
        }
        else {
            setShowModal(true)
        }
    }

    return (
        <div className="flex grow flex-col items-center justify-center bg-gray-100 p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to The Recipe Scanner!</h1>
                <p className="text-lg text-gray-600">Enter a link or text to check recipes for allergens based on your preferences</p>
            </div>
            <textarea
                type={inputType === 'link' ? "url" : "text"}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={inputType === 'text' ? "Enter text here" : "Enter link here"}
                className={`form-input mt-2 block transition-all duration-500 ease-in-out resize-none overflow-hidden ${inputType === 'text' ? 'w-1/2 h-32 px-4 py-3' : 'w-1/3 h-10 px-3 py-2'
                    } text-gray-700 border rounded-md focus:outline-none focus:shadow-outline`}
            />
            <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex rounded-full h-12 bg-gray-300 p-1 w-48 justify-center">
                    <button
                        onClick={() => setInputType('link')}
                        className={`flex-1 text-center rounded-full py-2 ${inputType === 'link' ? 'bg-blue-500 text-white' : 'text-gray-700'
                            } transition-colors duration-300 ease-in-out`}
                    >
                        Link
                    </button>
                    <button
                        onClick={() => setInputType('text')}
                        className={`flex-1 text-center rounded-full py-2 ${inputType === 'text' ? 'bg-blue-500 text-white' : 'text-gray-700'
                            } transition-colors duration-300 ease-in-out`}
                    >
                        Text Input
                    </button>
                </div>

                <button
                    onClick={openPreferencesModal}
                    className={`${!userInput || userInput == "" ? "bg-gray-300 text-black" : "bg-blue-500 hover:bg-blue-700"} text-white text-lg font-extrabold rounded-full pb-1 h-12 w-12 flex items-center justify-center transition duration-300`}
                    disabled={!userInput || userInput == ""}
                >
                    →
                </button>
            </div>
            {
                showModal && (
                    <PreferencesModal 
                        onModalClose={() => setShowModal(false)}
                        onContinueClicked={() => { submitUserInput(userPreferences) }} 
                        initialItems={[]} 
                        onItemUpdate={(items) => setUserPreferences(items)} 
                    />
                )
            }
            {showResultsModal && (
                <ResultsModal
                    onModalClose={() => setShowResultsModal(false)}
                    query={userInput}
                    queryType={inputType}
                    data={queryResults}              
                />
            )}
        </div>
    );
}
