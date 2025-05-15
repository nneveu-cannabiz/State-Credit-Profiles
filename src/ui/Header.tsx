import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary py-2">
      <div className="container mx-auto px-4 flex items-center gap-4 text-white">
        <img 
          src="https://i.imgur.com/0jslDI9.png"
          alt="CCA Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-2xl font-semibold">CCA State Credit Profile</h1>
      </div>
    </header>
  );
};

export default Header;