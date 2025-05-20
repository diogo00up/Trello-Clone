import '../styles/board.css';
import "react-datepicker/dist/react-datepicker.css";
import {GroupChoiceProps } from '../props/props';

function GroupChoice({ currentGroup, groupList, SetCurrentGroup }: GroupChoiceProps){
    return(

      <div className='group_choice'>
        <a id='group-choice-a'>Team: </a>
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

export default GroupChoice;