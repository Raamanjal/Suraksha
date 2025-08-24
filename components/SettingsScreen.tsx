
import React from 'react';

interface SettingsScreenProps {
  message: string;
  setMessage: (message: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ message, setMessage }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 px-2">Settings</h2>
      
      <div className="bg-gray-900 rounded-lg p-4">
          <label htmlFor="sos-message" className="block text-md font-semibold text-gray-300 mb-2">
            Predefined SOS Message
          </label>
          <textarea
            id="sos-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            placeholder="Enter your emergency message..."
          ></textarea>
          <p className="text-xs text-gray-500 mt-2">Your current location will be automatically appended to this message when you send an SOS.</p>
      </div>
    </div>
  );
};

export default SettingsScreen;