
import { useState, useEffect } from 'react';
import { DEFAULT_SOS_MESSAGE } from '../constants';

const MESSAGE_KEY = 'suraksha_sos_message';

export const useSOSMessage = () => {
  const [message, setMessage] = useState<string>(() => {
    return localStorage.getItem(MESSAGE_KEY) || DEFAULT_SOS_MESSAGE;
  });

  useEffect(() => {
    localStorage.setItem(MESSAGE_KEY, message);
  }, [message]);

  return { message, setMessage };
};