import React, { useState } from 'react';
import PreferencesModal from '../Components/PreferencesModal';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export default function Home() {
    // 'text' or 'link'
    const [inputType, setInputType] = useState('link');
    const [userInput, setUserInput] = useState(null);
    const [userPreferences, setUserPreferences] = useState([])

    const [showModal, setShowModal] = useState(false);

    const { enqueueSnackbar } = useSnackbar()

    const submitUserInput = () => {
        setShowModal(false);
        console.log(userPreferences)

        var payload = {
            user_allergies: userPreferences.map(x => x.foodItem),
            useSelenium: false
        };

        if (inputType === "link") {
            payload["url"] = userInput;
        } else {
            payload["text_blob"] = userInput;
        }
        axios.post(process.env.REACT_APP_ES_URL, payload).then(({ data }) => {
            /* Pass this data to the results page */

            console.log(data)
        }).catch(ex => {
            enqueueSnackbar('Error Reviewing!', {
                variant: 'error'
            })
        })
    }

    const openPreferencesModal = () => {
        if (inputType == 'link' && userInput.substring(0, 5).toLowerCase() != 'https') return enqueueSnackbar('Input Type Mismatch!', {
            variant: 'error'
        })

        if (inputType == 'text' && userInput.substring(0, 5).toLowerCase() == 'https') return enqueueSnackbar('Input Type Mismatch!', {
            variant: 'error'
        })

        setShowModal(true)
    }

    return (
        <div className="flex grow flex-col items-center justify-center bg-gray-100">
            <div className="title">Recipe Allergy Scanner</div>
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
                    className={`${!userInput || userInput == "" ? "bg-gray-300 text-black" : "bg-blue-500 hover:bg-blue-700"} text-white text-lg font-extrabold rounded-full p-2 h-12 w-12 flex items-center justify-center transition duration-300`}
                    disabled={!userInput || userInput == ""}
                >
                    →
                </button>
            </div>
            {
                showModal && (
                    <PreferencesModal onModalClose={() => setShowModal(false)} onContinueClicked={() => { submitUserInput() }} initialItems={[]} onItemUpdate={(items) => setUserPreferences(items)} />
                )
            }
        </div>
    );
}
