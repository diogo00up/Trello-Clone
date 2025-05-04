import './header-other.css';
import symbol from '../icons/menu.svg';
import back from '../icons/back2.svg';
import DropDown from '../shared-components/drop-dowm-menu/drop-down';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Header_Other(){

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const goBack = async () => {
      console.log("goback");
      navigate('/menu');  
    }

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
    
        <div className='go-back-icon-div' onClick={goBack}>
          <img src={back} className="back-icon" alt="add" />
        </div>
    
        <div className='header-menu-container'>
          <div className='header-menu-icon-div' onClick={() => setShowPopup(prev => !prev)}>
            <img src={symbol} alt="menu" className='header-menu-icon' />
          </div>
    
          {showPopup && (
            <div className='dropdown-wrapper' ref={dropdownRef}>
              <DropDown />
            </div>
          )}
        </div>
    
      </div>
    );
}

export default Header_Other;