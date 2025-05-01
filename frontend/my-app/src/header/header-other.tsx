import './header-other.css';
import symbol from '../icons/menu.svg';
import DropDown from '../shared-components/drop-dowm-menu/drop-down';
import React, { useState, useEffect, useRef } from 'react';

function Header_Other(){

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowPopup(false);
        }
      }
  
      if (showPopup) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showPopup]);

    return (

      <div className='header-other'>

        <div className='header-menu-icon-div' onClick={() => setShowPopup(true)}>
          <img src={symbol} alt="menu" className='header-menu-icon' />
        </div>

        {showPopup && (
          <div ref={dropdownRef}>
            <DropDown />
          </div>
        )}

      </div>
  
    );
}

export default Header_Other;