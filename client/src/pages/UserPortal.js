import React, { useState, useEffect } from 'react';
import UserProfileStyle from "../AppStyle/userProfile";
import { useAuth } from '../Auth/authHandler';
import { AUTH_ACTIONS } from '../Auth/authActions';
import {
  mockFetchUserProjects,
  mockFetchAllProjects,
  mockFetchAllHardware,
  mockFetchProjectInfo
} from '../Auth/serverSimulation';


const UserPortal = () => {
  const { user, handleAuthAction } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [projectSearch, setProjectSearch] = useState('');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [activePopup, setActivePopup] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isFetchingPopup, setIsFetchingPopup] = useState(false);
  const [expandedHardwareId, setExpandedHardwareId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await mockFetchUserProjects(user?.userId);
        if (response.success) {
          setUserProjects(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [user]);

  const filteredProjects = projectSearch.length >= 2
    ? userProjects.filter(proj =>
      proj.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
      proj.name.toLowerCase().includes(projectSearch.toLowerCase())
    )
    : [];

  const showDropdown = isProjectDropdownOpen && projectSearch.length >= 2 && !isLoadingProjects;

  const handleSignOut = () => handleAuthAction(AUTH_ACTIONS.SIGNOUT);

  const handleAccountClick = () => setIsProfileOpen(false);

  const handleProjectSelect = (projectId) => {
    setProjectSearch(projectId);
    setSelectedProjectId(projectId);
    setIsProjectDropdownOpen(false);
  };

  const handleGetAllProjects = async () => {
    setIsFetchingPopup(true);
    setActivePopup('ALL_PROJECTS');
    const res = await mockFetchAllProjects();
    if (res.success) setPopupData(res.data);
    setIsFetchingPopup(false);
  };

  const handleGetAllHardware = async () => {
    setIsFetchingPopup(true);
    setActivePopup('ALL_HARDWARE');
    const res = await mockFetchAllHardware();
    if (res.success) setPopupData(res.data);
    setIsFetchingPopup(false);
  };

  const handleGetProjectInfo = async () => {
    if (!selectedProjectId) {
      alert("Please select a Project ID first.");
      return;
    }
    setIsFetchingPopup(true);
    setActivePopup('PROJECT_INFO');
    const res = await mockFetchProjectInfo(selectedProjectId);
    if (res.success) setPopupData(res.data);
    setIsFetchingPopup(false);
  };

  const closePopup = () => {
    setActivePopup(null);
    setPopupData(null);
    setExpandedHardwareId(null);
  };

  return (
    <div style={UserProfileStyle.container}>
      <div style={UserProfileStyle.topTrim}></div>

      <div style={UserProfileStyle.profileBox}>
        {/* Navigation Bar Section */}
        <div style={UserProfileStyle.navBar}>
          <h2 style={{ margin: 0 }}>Welcome {user?.userName || '<user name>'}</h2>

          <div style={UserProfileStyle.profileContainer}>
            <div
              style={UserProfileStyle.profileCircle}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {user?.userName ? user.userName.charAt(0).toUpperCase() : '$!'}
            </div>

            {isProfileOpen && (
              <div style={UserProfileStyle.dropdownMenu}>
                <div style={UserProfileStyle.dropdownItem} onClick={handleAccountClick}>
                  Account
                </div>
                <div style={UserProfileStyle.dropdownItem} onClick={handleSignOut}>
                  Signout
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Links Section */}
        <div style={{ marginTop: '20px' }}>
          <button style={UserProfileStyle.menuLink} onClick={handleGetAllProjects}>Get All Projects list</button>
          <button style={UserProfileStyle.menuLink} onClick={handleGetAllHardware}>Get All Hardware list</button>

          <div style={{ marginTop: '20px' }}>
            <strong style={{ ...UserProfileStyle.label, fontWeight: 'bold' }}>Get Project info</strong>
            <div style={UserProfileStyle.actionGroup}>
              <span style={UserProfileStyle.label}>Enter Project ID:</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  style={{ ...UserProfileStyle.selectInput, width: '100%', boxSizing: 'border-box' }}
                  placeholder={isLoadingProjects ? "Loading projects..." : "Search Project ID or Name..."}
                  value={projectSearch}
                  disabled={isLoadingProjects}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    setIsProjectDropdownOpen(true);
                  }}
                  onFocus={() => setIsProjectDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsProjectDropdownOpen(false), 200)}
                />
                {showDropdown && (
                  <div style={UserProfileStyle.searchDropdown}>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((proj) => (
                        <div
                          key={proj.id}
                          style={UserProfileStyle.searchDropdownItem}
                          onMouseDown={() => handleProjectSelect(proj.id)}
                        >
                          <strong>{proj.id}</strong> - {proj.name}
                        </div>
                      ))
                    ) : (
                      <div style={{ ...UserProfileStyle.searchDropdownItem, color: '#999' }}>
                        No projects found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button style={UserProfileStyle.submitBtn} onClick={handleGetProjectInfo}>Submit</button>
            </div>
          </div>


          <strong style={{ ...UserProfileStyle.label, marginTop: '10px', fontWeight: 'bold' }}>Create new project</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ ...UserProfileStyle.label, marginTop: '10px' }}>Name:</span>
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

      {/* Popup modals */}
      {activePopup && (
        <div style={UserProfileStyle.modalOverlay}>
          <div style={activePopup === 'PROJECT_INFO' ? UserProfileStyle.largeModalContent : UserProfileStyle.modalContent}>

            {/* Close Button */}
            <button style={UserProfileStyle.closeModalBtn} onClick={closePopup}>X</button>

            {isFetchingPopup ? (
              <h3>Loading data...</h3>
            ) : (
              <>
                {/* 1. ALL PROJECTS LIST */}
                {activePopup === 'ALL_PROJECTS' && popupData && (
                  <div>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Projects list</h2>
                    <table style={UserProfileStyle.table}>
                      <thead>
                        <tr>
                          <th style={UserProfileStyle.th}>Project ID</th>
                          <th style={UserProfileStyle.th}>Project name</th>
                          <th style={UserProfileStyle.th}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popupData.map((proj, idx) => (
                          <tr key={idx}>
                            <td style={UserProfileStyle.td}>{proj.projectId}</td>
                            <td style={UserProfileStyle.td}>{proj.projectName}</td>
                            <td style={UserProfileStyle.td}>{proj.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: '20px' }}>
                      <h3>Total HW usage:</h3>
                      <p>HW set1: XXX</p>
                      <p>HW set2: YYY</p>
                    </div>
                  </div>
                )}

                {/* 2. ALL HARDWARE LIST */}
                {activePopup === 'ALL_HARDWARE' && popupData && (
                  <div>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Hardware list</h2>
                    {popupData.map((hw) => (
                      <div key={hw.id} style={{ marginBottom: '10px' }}>
                        <h4
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#000' }}
                          onClick={() => setExpandedHardwareId(expandedHardwareId === hw.id ? null : hw.id)}
                        >
                          {hw.name}
                        </h4>

                        {/* Expandable Hardware Details Table */}
                        {expandedHardwareId === hw.id && (
                          <table style={{ ...UserProfileStyle.table, width: '70%', marginLeft: '20px' }}>
                            <tbody>
                              <tr>
                                <th style={{ ...UserProfileStyle.th, width: '50%' }}>Capacity</th>
                                <td style={UserProfileStyle.td}>{hw.capacity}</td>
                              </tr>
                              <tr>
                                <th style={UserProfileStyle.th}>Availability</th>
                                <td style={UserProfileStyle.td}>{hw.available}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. PROJECT INFO PAGE */}
                {activePopup === 'PROJECT_INFO' && popupData && (
                  <div>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Project ID info</h2>
                    <p><strong>Project name:</strong> {popupData.projectName}</p>
                    <p><strong>Description:</strong> {popupData.description}</p>

                    <table style={{ ...UserProfileStyle.table, marginTop: '20px' }}>
                      <thead>
                        <tr>
                          <th style={UserProfileStyle.th}>HW</th>
                          <th style={UserProfileStyle.th}>Capacity</th>
                          <th style={UserProfileStyle.th}>Available</th>
                          <th style={UserProfileStyle.th}>Allocated</th>
                          <th style={UserProfileStyle.th}>Request</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popupData.hardware.map((hw, idx) => (
                          <tr key={idx}>
                            <td style={UserProfileStyle.td}><strong>{hw.name}</strong></td>
                            <td style={UserProfileStyle.td}>{hw.capacity}</td>
                            <td style={UserProfileStyle.td}>{hw.available}</td>
                            <td style={UserProfileStyle.td}>{hw.allocated}</td>
                            <td style={UserProfileStyle.td}>
                              <input
                                type="number"
                                min="0"
                                max={hw.available}
                                style={{ width: '60px', padding: '5px' }}
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'right', marginTop: '15px' }}>
                      <button style={UserProfileStyle.submitBtn}>Submit</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPortal;