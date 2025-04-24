import React, { useState, useEffect } from 'react';
import FooterCustom from './footer/footer'
import './menu.css';
import user from './icons/user.svg'
import users from './icons/users.svg'
import back from './icons/back2.svg'
import { useNavigate } from 'react-router-dom';

function Menu(){
    const navigate = useNavigate(); 

    const changeToPrivate = async () =>{
        console.log("Cliquei no botao")
        navigate('/mainPage');
    }

    const changeToPublic = async () =>{
        console.log("Cliquei no botao")
        navigate('/groupPage');
    }

    const goBack = async () =>{
        console.log("Cliquei no botao")
        navigate('/welcome');
    }


    return(
        <div className='page-background'>

            <div className='back-button' onClick={goBack}>
                <img src={back} className="back-icon-button" alt="add" />
            </div>

            <div className=' menu-div'>
                <div className='button-private' onClick={changeToPrivate}>
                    <img src={user} className="user-icon-button" alt="add" />
                    <a className='menu-message'>Check my backlog!</a>
                </div>

                <div className='button-public' onClick={changeToPublic}>
                    <img src={users} className="users-icon-button" alt="add" />
                    <a className='menu-message'>Check my team backlog!</a>
            
                </div>
   
            </div>
            <FooterCustom />
        </div>
    );
}

export default Menu;