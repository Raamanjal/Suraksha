
import React from 'react';
import { ShieldIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 flex items-center justify-center p-4 bg-black border-b border-gray-800">
       <ShieldIcon className="w-6 h-6 mr-2" />
       <h1 className="text-xl font-bold tracking-wider uppercase">SURAKSHA</h1>
    </header>
  );
};

export default Header;