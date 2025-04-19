import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './teamsBoardPage.css';
import FooterCustom from './footer/footer';
import HeaderCustom from './header/header';

function GroupPage(){
    return(
        <div className='teams-background'>
            <HeaderCustom/>

            <div className='teams-main-board'>
                <a>OLaaaaaaaaaaaaaaaaaaaaaaaaa</a>
            </div>

            <FooterCustom/>
            
        </div>
        
    )
}

export default GroupPage;