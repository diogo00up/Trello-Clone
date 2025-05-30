import close from '../../icons/x.svg'
import { AdminSettingsProps } from '../props/props';


function AdminSettings({ AdminSettingsRef, setAdminSettings, GroupMembers, currentGroup,NotGroupMember,handleToggleAdmin,kickMember,enviteMember}: AdminSettingsProps){

    return(
        <div className='admin-box' ref={AdminSettingsRef}>
          <div onClick={() => setAdminSettings(false)} id='close-admin' >
            <img src={close} id='close-admin-x' />
          </div>
          
          <h4>Group members:</h4>
          {GroupMembers.map(member => (
            <div key={member.id} className='admin_line-info' >
              <a>ID: {member.id}</a>
              <a>Username: {member.username}</a>

              <a>IsAdmin ? 
                <input type="checkbox" checked={member.is_admin} onChange={() => handleToggleAdmin(member.id, member.group_id, !member.is_admin)}/>
              </a>

              {currentGroup?.id !== undefined && (
              <a className='kick-member' onClick={() => kickMember(member.id, currentGroup.id)}>Kick member</a>
              )}

            </div>
            ))
          }
          <h4>Invite Members:</h4>

          {
            NotGroupMember.map(notMember =>(
              <div key={notMember.id} className='admin_line-info' >
                <a>ID: {notMember.id}</a>
                <a>Username: {notMember.username}</a>
                {currentGroup?.id !== undefined && (
                <a className='envite-member' onClick={() => enviteMember(notMember.id, currentGroup.id)}>
                  Invite Member
                </a>
              )}
              </div>
            ))
          }
        </div>
    )
}

export default AdminSettings;