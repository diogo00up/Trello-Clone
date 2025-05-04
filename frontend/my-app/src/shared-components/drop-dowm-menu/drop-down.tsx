import React, { useState, useEffect } from 'react';
import avatar1 from '../../icons/avatar1.svg';
import {useNavigate } from 'react-router-dom';

import './drop-down.css';

function DropDown(){
    const token = sessionStorage.getItem('access_token');

    const navigate = useNavigate();

    const logOut = async () => {
        console.log("logout");
        sessionStorage.clear();
        navigate('/welcome');
        
      }

    return(
        <div className='drop-down-menu'>
            <label className='menu-title'>Account</label>

            <div className='user-info'>

                <div className='user-avatar'>
                    <img src={avatar1} className="user-avatar-icon" />
                </div>

                <div className='user-info-a'>
                    <a>diogo13350@hotmail.com</a>
                    <a>Diogo Tomáz</a>
                </div>

            </div>

            <div className='lines'>
                <a>Manage account</a>
            </div>

            <hr></hr>

            <div className='lines'>
                <a>Setting</a>
            </div>

            <div className='lines'>
                <a>Help</a>
            </div>
            <hr></hr>
            <div className='lines' onClick={logOut} >
                <a>Log out</a>
            </div>

        </div>
        
    );
 
}

export default DropDown;