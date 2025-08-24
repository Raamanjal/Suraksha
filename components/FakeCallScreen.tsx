
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { PhoneIcon, PhoneXMarkIcon } from './Icons';

interface FakeCallScreenProps {
  setView: (view: View) => void;
}

const FakeCallScreen: React.FC<FakeCallScreenProps> = ({ setView }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const handleEndCall = () => {
        setView(View.HOME);
    };

  return (
    <div className="bg-black text-white h-full flex flex-col justify-between items-center p-8">
        <div className="text-center mt-16">
            <p className="text-xl">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold">M</span>
            </div>
            <h1 className="text-4xl font-semibold">Mom</h1>
            <p className="text-gray-400 text-lg">+91 98765 43210</p>
            <p className="text-gray-400 mt-2">mobile</p>
        </div>

        <div className="w-full flex justify-around items-center">
            <div className="flex flex-col items-center">
                <button onClick={handleEndCall} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-10 h-10" />
                </button>
                <span className="mt-2">Answer</span>
            </div>
             <div className="flex flex-col items-center">
                <button onClick={handleEndCall} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                    <PhoneXMarkIcon className="w-10 h-10" />
                </button>
                 <span className="mt-2">Decline</span>
            </div>
        </div>
    </div>
  );
};

export default FakeCallScreen;