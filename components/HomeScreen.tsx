import React, { useState, useRef, useCallback } from 'react';
import { View, Contact } from '../types';
import { EMERGENCY_NUMBER_POLICE, EMERGENCY_NUMBER_AMBULANCE, EMERGENCY_NUMBER_FIRE } from '../constants';
import { PhoneIcon, FireIcon, BellAlertIcon } from './Icons';

interface HomeScreenProps {
  setView: (view: View) => void;
  contacts: Contact[];
  message: string;
}

const PoliceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.06 8.625a.75.75 0 01.75-.75h4.38a.75.75 0 010 1.5H9.81a.75.75 0 01-.75-.75zM10.125 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm-1.06 2.625a.75.75 0 000 1.5h5.25a.75.75 0 000-1.5H9.065z" clipRule="evenodd" />
    </svg>
);

const AmbulanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ setView, contacts, message }) => {
  const [locationInfo, setLocationInfo] = useState('');
  const [siren, setSiren] = useState<{ pause: () => void } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSosPress = () => {
    setLocationInfo('Hold for 3 seconds to call 112...');
    pressTimer.current = setTimeout(() => {
      setLocationInfo('Calling emergency number 112...');
      window.location.href = `tel:${EMERGENCY_NUMBER_POLICE}`;
      pressTimer.current = null; // Prevent release action after long press
    }, 3000);
  };

  const handleSosRelease = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      // It was a short press (single tap)
      sendSOSMessage();
    }
  };
  
  const sendSOSMessage = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const enabledContacts = contacts.filter(c => c.enabled);
    if (enabledContacts.length === 0) {
      alert("No emergency contacts enabled. Please add or enable contacts in the 'My Contacts' section.");
      setLocationInfo('');
      return;
    }

    setLocationInfo('Getting your location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const fullMessage = `${message}\n${mapsLink}`;
        
        const phoneNumbers = enabledContacts.map(c => c.phone).join(',');
        
        // Use the sms: protocol which works on mobile devices
        const smsUri = `sms:${phoneNumbers}?body=${encodeURIComponent(fullMessage)}`;
        
        setLocationInfo(`Opening messaging app to alert contacts...`);
        
        // This will open the user's default messaging app
        window.location.href = smsUri;
      },
      () => {
        setLocationInfo("Unable to retrieve location.");
        alert("Unable to retrieve your location. Please enable location services.");
      }
    );
  };

  const toggleSiren = useCallback(() => {
    if (siren) {
      siren.pause();
      setSiren(null);
    } else {
        const audioContext = new (window.AudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sawtooth';
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        
        oscillator.start();
        
        const intervalId = setInterval(() => {
             if (audioContext.state === 'running') {
                const time = audioContext.currentTime;
                oscillator.frequency.cancelScheduledValues(time);
                oscillator.frequency.setValueAtTime(oscillator.frequency.value, time);
                oscillator.frequency.linearRampToValueAtTime(1000, time + 0.5);
                oscillator.frequency.linearRampToValueAtTime(800, time + 1);
            }
        }, 1000);

        const newSiren = {
            pause: () => {
                clearInterval(intervalId);
                oscillator.stop();
                audioContext.close();
            }
        };
        setSiren(newSiren);
    }
  }, [siren]);


  const SafetyToolButton: React.FC<{
      icon: React.ReactNode;
      label: string;
      onClick: () => void;
      className?: string;
  }> = ({ icon, label, onClick, className = '' }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-lg bg-gray-900 aspect-square transition-transform active:scale-95 ${className}`}>
        {icon}
        <span className="text-sm mt-2 font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="text-center mb-6 flex-shrink-0">
        <h2 className="text-lg font-semibold">Vibhuti Khand, Gomti Nagar, Lucknow</h2>
        <p className="text-sm text-gray-400">{locationInfo}</p>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <button
          onMouseDown={handleSosPress}
          onMouseUp={handleSosRelease}
          onTouchStart={handleSosPress}
          onTouchEnd={handleSosRelease}
          className="w-48 h-48 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-transform active:scale-90"
        >
          SOS
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 flex-shrink-0">
         <SafetyToolButton icon={<PoliceIcon className="w-8 h-8"/>} label="Police" onClick={() => window.location.href = `tel:${EMERGENCY_NUMBER_POLICE}`} />
         <SafetyToolButton icon={<PhoneIcon className="w-8 h-8"/>} label="Fake Call" onClick={() => setView(View.FAKE_CALL)} />
         <SafetyToolButton icon={<FireIcon className="w-8 h-8"/>} label="Fire" onClick={() => window.location.href = `tel:${EMERGENCY_NUMBER_FIRE}`} />
         <SafetyToolButton icon={<AmbulanceIcon className="w-8 h-8"/>} label="Ambulance" onClick={() => window.location.href = `tel:${EMERGENCY_NUMBER_AMBULANCE}`} />
         <SafetyToolButton icon={<BellAlertIcon className="w-8 h-8"/>} label="Siren" onClick={toggleSiren} className={siren ? 'text-red-500' : ''} />
      </div>
    </div>
  );
};

export default HomeScreen;
