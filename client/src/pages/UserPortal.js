import React, {useEffect, useState} from 'react';
import UserProfileStyle from "../AppStyle/userProfile";
import {useAuth} from '../Auth/authHandler';
import {AUTH_ACTIONS} from '../Auth/authActions';
import {mockFetchUserProjects} from '../Auth/serverSimulation';
import AllHardwarePage from '../Pages/AllHardwarePage';
import AllProjectsPage from '../Pages/AllProjectsPage';
import ProjectInfoPage from '../Pages/ProjectInfoPage';

const VIEWS = {
    DASHBOARD: 'DASHBOARD',
    ALL_PROJECTS: 'ALL_PROJECTS',
    ALL_HARDWARE: 'ALL_HARDWARE',
    PROJECT_INFO: 'PROJECT_INFO',
};

const UserPortal = () => {
    const {user, handleAuthAction} = useAuth();

    const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
    const [activeProjectId, setActiveProjectId] = useState('');

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [projectSearch, setProjectSearch] = useState('');
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [userProjects, setUserProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const response = await mockFetchUserProjects(user?.userId);
                if (response.success) setUserProjects(response.data);
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

    const handleGoToProjectInfo = () => {
        if (!selectedProjectId) {
            alert("Please select a Project ID first.");
            return;
        }
        setActiveProjectId(selectedProjectId);
        setCurrentView(VIEWS.PROJECT_INFO);
    };

    const goToDashboard = () => setCurrentView(VIEWS.DASHBOARD);

    const renderNavBar = () => (
        <div style={UserProfileStyle.navBar}>
            <h2 style={{margin: 0}}>Welcome {user?.userName || '<Guest>'}</h2>
            <div style={UserProfileStyle.profileContainer}>
                <div
                    style={UserProfileStyle.profileCircle}
                    onClick={() => setIsProfileOpen(prev => !prev)}
                >
                    {user?.userName ? user.userName.charAt(0).toUpperCase() : '?'}
                </div>
                {isProfileOpen && (
                    <div style={UserProfileStyle.dropdownMenu}>
                        <div style={UserProfileStyle.dropdownItem} onClick={handleAccountClick}>Account</div>
                        <div style={UserProfileStyle.dropdownItem} onClick={handleSignOut}>Sign Out</div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={UserProfileStyle.container}>
            <div style={UserProfileStyle.topTrim}></div>
            <div style={UserProfileStyle.profileBox}>
                {renderNavBar()}

                {/* ── DASHBOARD ── */}
                {currentView === VIEWS.DASHBOARD && (
                    <div style={{marginTop: '20px'}}>
                        <button
                            style={UserProfileStyle.menuLink}
                            onClick={() => setCurrentView(VIEWS.ALL_PROJECTS)}
                        >
                            Get All Projects List
                        </button>
                        <button
                            style={UserProfileStyle.menuLink}
                            onClick={() => setCurrentView(VIEWS.ALL_HARDWARE)}
                        >
                            Get All Hardware List
                        </button>

                        {/* Use Existing Project */}
                        <div style={{marginTop: '20px'}}>
                            <strong style={{...UserProfileStyle.label, fontWeight: 'bold'}}>Use Existing
                                Project</strong>
                            <div style={UserProfileStyle.actionGroup}>
                                <span style={UserProfileStyle.label}>Project ID:</span>
                                <div style={{position: 'relative', flex: 1}}>
                                    <input
                                        style={{
                                            ...UserProfileStyle.selectInput,
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
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
                                                <div style={{...UserProfileStyle.searchDropdownItem, color: '#999'}}>
                                                    No projects found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button style={UserProfileStyle.submitBtn} onClick={handleGoToProjectInfo}>
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* Create New Project */}
                        <strong style={{...UserProfileStyle.label, marginTop: '10px', fontWeight: 'bold'}}>
                            Create New Project
                        </strong>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <span style={{...UserProfileStyle.label, marginTop: '10px'}}>Name:</span>
                            <input style={UserProfileStyle.createProjectInput}/>
                            <span style={UserProfileStyle.label}>Description:</span>
                            <input style={UserProfileStyle.createProjectInput}/>
                            <span style={UserProfileStyle.label}>Project ID:</span>
                            <input style={UserProfileStyle.createProjectInput}/>
                            <button style={{...UserProfileStyle.submitBtn, alignSelf: 'flex-end'}}>Create</button>
                        </div>
                    </div>
                )}

                {/* ── ALL PROJECTS PAGE ── */}
                {currentView === VIEWS.ALL_PROJECTS && (
                    <AllProjectsPage onBack={goToDashboard}/>
                )}

                {/* ── ALL HARDWARE PAGE ── */}
                {currentView === VIEWS.ALL_HARDWARE && (
                    <AllHardwarePage onBack={goToDashboard}/>
                )}

                {/* ── PROJECT INFO PAGE ── */}
                {currentView === VIEWS.PROJECT_INFO && (
                    <ProjectInfoPage projectId={activeProjectId} onBack={goToDashboard}/>
                )}
            </div>

            <div style={UserProfileStyle.bottomTrim}></div>
        </div>
    );
};
export default UserPortal;