import React, { useState, useEffect } from 'react';
import avatar1 from '../../icons/avatar1.svg';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

import './drop-down.css';

type UserProps = {
    id: string;
    username: string;   
    email: string;
    
}

function DropDown(){
    const token = sessionStorage.getItem('access_token');

    const [loggedUser, setLoggedUser] = useState<UserProps>();
    
    const navigate = useNavigate();

    const logOut = async () => {
        console.log("logout");
        sessionStorage.clear();
        navigate('/welcome');    
    }

    const getUserInfo = async () => {
        console.log("Get user info");
          try {
            const response = await axios.get('http://127.0.0.1:8000/retrieveUserInfo', 
                {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                }
            );
        
            console.log('Current User info:', response.data);
            setLoggedUser(response.data);

            } 
            
            catch (error) {
                console.error('Retrieve error:', error);
            }
    }

    useEffect(()=>{
        getUserInfo()
    }, []);

    return(
        <div className='drop-down-menu'>
            <label className='menu-title'>Account</label>

            <div className='user-info'>

                <div className='user-avatar'>
                    <img src={avatar1} className="user-avatar-icon" />
                </div>

                <div className='user-info-a'>
                    <a>{loggedUser?.username}</a>
                    <a>{loggedUser?.email}</a>
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