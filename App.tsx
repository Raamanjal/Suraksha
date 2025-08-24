
import React, { useState, useCallback } from 'react';
import { View, Contact } from './types';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ContactsScreen from './components/ContactsScreen';
import SettingsScreen from './components/SettingsScreen';
import ResourcesScreen from './components/ResourcesScreen';
import FakeCallScreen from './components/FakeCallScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { useContacts } from './hooks/useContacts';
import { useSOSMessage } from './hooks/useSOSMessage';

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [view, setView] = useState<View>(View.HOME);
  const { contacts, addContact, removeContact, toggleContact } = useContacts();
  const { message, setMessage } = useSOSMessage();

  const renderView = useCallback(() => {
    switch (view) {
      case View.HOME:
        return <HomeScreen setView={setView} contacts={contacts} message={message} />;
      case View.CONTACTS:
        return <ContactsScreen contacts={contacts} addContact={addContact} removeContact={removeContact} toggleContact={toggleContact} />;
      case View.RESOURCES:
        return <ResourcesScreen />;
      case View.SETTINGS:
        return <SettingsScreen message={message} setMessage={setMessage} />;
      case View.FAKE_CALL:
        return <FakeCallScreen setView={setView} />;
      default:
        return <HomeScreen setView={setView} contacts={contacts} message={message} />;
    }
  }, [view, contacts, message, addContact, removeContact, toggleContact]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  const isSubView = view === View.FAKE_CALL;

  return (
    <div className="max-w-sm mx-auto h-[100dvh] bg-black text-white flex flex-col font-sans overflow-hidden shadow-2xl">
      {!isSubView && <Header />}
      <main className="flex-grow overflow-y-auto">
        {renderView()}
      </main>
      {!isSubView && <BottomNav activeView={view} setView={setView} />}
    </div>
  );
};

export default App;