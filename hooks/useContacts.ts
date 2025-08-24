
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../types';

const CONTACTS_KEY = 'suraksha_contacts';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const storedContacts = localStorage.getItem(CONTACTS_KEY);
      return storedContacts ? JSON.parse(storedContacts) : [];
    } catch (error) {
      console.error("Error parsing contacts from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = useCallback((name: string, phone: string) => {
    const newContact: Contact = {
      id: new Date().toISOString(),
      name,
      phone,
      enabled: true
    };
    setContacts(prev => [...prev, newContact]);
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, []);

  const toggleContact = useCallback((id: string) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, enabled: !contact.enabled } : contact
      )
    );
  }, []);

  return { contacts, addContact, removeContact, toggleContact };
};