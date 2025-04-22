import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './teamsBoardPage.css';
import FooterCustom from './footer/footer';
import HeaderCustom from './header/header';

type groupProps = {
    id: number;
    group_name: string;
  };
  
  type GroupChoiceProps = {
    currentGroup?: groupProps;
    groupList: groupProps[];
    SetCurrentGroup: React.Dispatch<React.SetStateAction<groupProps | undefined>>;
  };


function GroupChoice({ currentGroup, groupList, SetCurrentGroup }: GroupChoiceProps){
    return(

        <div className='group_choice'>
        <a id='group-choice-a'>Scroll threw your working teams: </a>
        <select className='group-box' value={currentGroup?.id || ''} onChange={(e) => {const selectedId = parseInt(e.target.value);
        const selectedGroup = groupList.find(group => group.id === selectedId);
        SetCurrentGroup(selectedGroup)}}>

        <option value="" disabled>Select a group</option>

        {groupList.map(group => (
            <option key={group.id} value={group.id}>{group.group_name} </option>))
        }

        </select>
    </div>



    )
};

function GroupPage(){

    const [Groups, SetGroups] = useState<groupProps[]>([]);
    const [currentGroup, SetCurrentGroup] = useState<groupProps>();

    const getGroups = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/groups', { 
            });

            SetGroups(response.data);     
            console.log('Groups from API: ', response.data);
        
          } 
          catch (error) {
            console.error('Error getting Groups from API:', error);
          }
    };

    useEffect(() => {
        getGroups();
        }, 
    []);

    return(
        <div className='teams-background'>
            <HeaderCustom/>
            <GroupChoice currentGroup={currentGroup} groupList={Groups} SetCurrentGroup={SetCurrentGroup}/>

            <div className='teams-main-board'>
                

            </div>

            <FooterCustom/>
            
        </div>
        
    )
}

export default GroupPage;