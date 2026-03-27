import React, {useEffect, useState} from 'react';
import UserProfileStyle from "../AppStyle/userProfile";
import {useAuth} from '../Auth/authHandler';
import {AUTH_ACTIONS} from '../Auth/authActions';
import {mockFetchUserProjects, mockCreateProject} from '../Auth/serverSimulation';
import AllHardwarePage from '../pages/AllHardwarePage';
import AllProjectsPage from '../pages/AllProjectsPage';
import ProjectInfoPage from '../pages/ProjectInfoPage';

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

    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [newProjectId, setNewProjectId] = useState('');
    const [isCreatingProject, setIsCreatingProject] = useState(false);


    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const response = await mockFetchUserProjects(user?.userid);
                if (response.success) setUserProjects(response.projects);
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
            proj.projectId.toLowerCase().includes(projectSearch.toLowerCase()) ||
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

    const handleCreateProject = async () => {
        if (!newProjectId.trim() || !newProjectName.trim()) {
            alert("Project ID and Name are required.");
            return;
        }
        setIsCreatingProject(true);
        try {
            const response = await mockCreateProject(
                { projectID: newProjectId.trim(), name: newProjectName.trim(), description: newProjectDescription.trim() },
                user?.userid
            );
            if (response.success) {
                alert(`Project "${response.data.name}" created successfully!`);
                setNewProjectId('');
                setNewProjectName('');
                setNewProjectDescription('');
                setUserProjects(prev => [...prev, { projectId: response.data.projectId, name: response.data.name }]);
            } else {
                alert(response.error || "Failed to create project.");
            }
        } catch (error) {
            console.error("Failed to create project", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsCreatingProject(false);
        }
    };

    const goToDashboard = () => setCurrentView(VIEWS.DASHBOARD);

    const handleOpenProject = (projectId) => {
        setActiveProjectId(projectId);
        setCurrentView(VIEWS.PROJECT_INFO);
    };
    const renderNavBar = () => (
        <div style={UserProfileStyle.navBar}>
            <h2 style={{margin: 0}}>Welcome {user?.username || '<Guest>'}</h2>
            <div style={UserProfileStyle.profileContainer}>
                <div
                    style={UserProfileStyle.profileCircle}
                    onClick={() => setIsProfileOpen(prev => !prev)}
                >
                    {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
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

    if (currentView === VIEWS.PROJECT_INFO) {
        return (
            <div style={UserProfileStyle.container}>
                <div style={UserProfileStyle.topTrim}></div>
                <ProjectInfoPage projectId={activeProjectId} userId={user?.userid} onBack={goToDashboard}/>
                <div style={UserProfileStyle.bottomTrim}></div>
            </div>
        );
    }

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
                                                        key={proj.projectId}
                                                        style={UserProfileStyle.searchDropdownItem}
                                                        onMouseDown={() => handleProjectSelect(proj.projectId)}
                                                    >
                                                        <strong>{proj.projectId}</strong> - {proj.name}
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
                            <input
                                style={UserProfileStyle.createProjectInput}
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                disabled={isCreatingProject}
                            />
                            <span style={UserProfileStyle.label}>Description:</span>
                            <input
                                style={UserProfileStyle.createProjectInput}
                                value={newProjectDescription}
                                onChange={(e) => setNewProjectDescription(e.target.value)}
                                disabled={isCreatingProject}
                            />
                            <span style={UserProfileStyle.label}>Project ID:</span>
                            <input
                                style={UserProfileStyle.createProjectInput}
                                value={newProjectId}
                                onChange={(e) => setNewProjectId(e.target.value)}
                                disabled={isCreatingProject}
                            />
                            <button
                                style={{...UserProfileStyle.submitBtn, alignSelf: 'flex-end'}}
                                onClick={handleCreateProject}
                                disabled={isCreatingProject}
                            >
                                {isCreatingProject ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ALL PROJECTS PAGE ── */}
                {currentView === VIEWS.ALL_PROJECTS && (
                    <AllProjectsPage userId={user?.userid} onBack={goToDashboard} onOpenProject={handleOpenProject}/>
                )}

                {/* ── ALL HARDWARE PAGE ── */}
                {currentView === VIEWS.ALL_HARDWARE && (
                    <AllHardwarePage onBack={goToDashboard}/>
                )}


            </div>

            <div style={UserProfileStyle.bottomTrim}></div>
        </div>
    );
};
export default UserPortal;