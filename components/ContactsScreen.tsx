
import React, { useState } from 'react';
import { Contact } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface ContactsScreenProps {
  contacts: Contact[];
  addContact: (name: string, phone: string) => void;
  removeContact: (id: string) => void;
  toggleContact: (id: string) => void;
}

const ContactItem: React.FC<{
  contact: Contact;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ contact, onToggle, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg mb-3">
      <div>
        <p className="font-semibold text-lg">{contact.name}</p>
        <p className="text-gray-400">{contact.phone}</p>
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor={`toggle-${contact.id}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" id={`toggle-${contact.id}`} className="sr-only" checked={contact.enabled} onChange={() => onToggle(contact.id)} />
            <div className={`block w-14 h-8 rounded-full ${contact.enabled ? 'bg-red-600' : 'bg-gray-600'}`}></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform duration-300 ease-in-out" style={{ transform: contact.enabled ? 'translateX(100%)' : 'translateX(0)' }}></div>
          </div>
        </label>
        <button onClick={() => onRemove(contact.id)} className="text-gray-500 hover:text-red-500">
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};


const AddContactModal: React.FC<{onAdd: (name: string, phone: string) => void, onClose: () => void}> = ({onAdd, onClose}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && phone){
            onAdd(name, phone);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                     <input 
                        type="tel"
                        placeholder="Phone Number (+91)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,12))}
                        className="w-full bg-gray-700 p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex justify-end space-x-3">
                         <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-gray-300 hover:bg-gray-700">Cancel</button>
                         <button type="submit" className="py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 font-semibold">Save Contact</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ contacts, addContact, removeContact, toggleContact }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddContact = (name: string, phone: string) => {
        addContact(name, phone);
        setIsModalOpen(false);
    }
  return (
    <div className="p-4 h-full relative">
      <h2 className="text-xl font-bold mb-4 px-2">My Contacts</h2>
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <ContactItem key={contact.id} contact={contact} onToggle={toggleContact} onRemove={removeContact} />
        ))
      ) : (
        <div className="text-center py-16 text-gray-500">
            <p>No emergency contacts added yet.</p>
            <p>Tap the '+' button to add one.</p>
        </div>
      )}
       <button onClick={() => setIsModalOpen(true)} className="absolute bottom-24 right-6 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all transform active:scale-95">
        <PlusIcon className="w-8 h-8" />
      </button>

      {isModalOpen && <AddContactModal onAdd={handleAddContact} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ContactsScreen;