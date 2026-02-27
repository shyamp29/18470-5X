import React from 'react';
import UserProfileStyle from "../AppStyle/userProfile";

const UserPortal = () => {
  return (
    <div style={UserProfileStyle.container}>
      <div style={UserProfileStyle.topTrim}></div>
      
      <div style={UserProfileStyle.profileBox}>
        {/* Navigation Bar Section */}
        <div style={UserProfileStyle.navBar}>
          <h2 style={{ margin: 0 }}>Welcome {"<user name>"}</h2>
          <button style={UserProfileStyle.profileIcon}>H</button>
        </div>

        {/* Action Links Section */}
        <div style={{ marginTop: '20px' }}>
          <button style={UserProfileStyle.menuLink}>Get All Projects list</button>
          <button style={UserProfileStyle.menuLink}>Get All Hardware list</button>
          
          <button style={UserProfileStyle.menuLink}>Get Project info</button>
          <div style={UserProfileStyle.actionGroup}>
            <span style={UserProfileStyle.label}>Enter Project ID:</span>
            <input type="text" placeholder="Project ID" style={UserProfileStyle.input} />
            <button style={UserProfileStyle.submitBtn}>Submit</button>
          </div>

          <button style={UserProfileStyle.menuLink}>Create new project</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
             <span style={UserProfileStyle.label}>Name:</span>
            <input style={UserProfileStyle.createProjectInput} />
              <span style={UserProfileStyle.label}>Description:</span>
           <input style={UserProfileStyle.createProjectInput} />
              <span style={UserProfileStyle.label}>ProjectID:</span>
           <input style={UserProfileStyle.createProjectInput} />
            <button style={{ ...UserProfileStyle.submitBtn, alignSelf: 'flex-end' }}>Create</button>
          </div>
        </div>
      </div>

      <div style={UserProfileStyle.bottomTrim}></div>
    </div>
  );
};

export default UserPortal;