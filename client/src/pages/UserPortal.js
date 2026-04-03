import {useEffect, useState} from 'react';
import UserProfileStyle from "../AppStyle/userProfile";
import '../styles/UserPortal.css';
import {useAuth} from '../Auth/authHandler';
import useTheme from '../hooks/useTheme';
import {apiFetchUserProjects, apiCreateProject} from '../Auth/apiCalls';
import { SuccessPopup } from '../components/popups';
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
    const {user, signout} = useAuth();
    const {theme, toggleTheme} = useTheme();

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
    const projectidTaken = newProjectId.trim().length > 0 &&
        userProjects.some(p => p.projectid.toLowerCase() === newProjectId.trim().toLowerCase());
    const [successMsg, setSuccessMsg] = useState({show: false, msg: ""});


    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const response = await apiFetchUserProjects();
                if (response.status === 200) setUserProjects(response.projectslist ?? []);
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
            proj.projectid.toLowerCase().includes(projectSearch.toLowerCase()) ||
            proj.name.toLowerCase().includes(projectSearch.toLowerCase())
        )
        : [];

    const showDropdown = isProjectDropdownOpen && projectSearch.length >= 2 && !isLoadingProjects;

    const handleSignOut = () => signout();
    const handleAccountClick = () => setIsProfileOpen(false);

    const handleProjectSelect = (projectid) => {
        setProjectSearch(projectid);
        setSelectedProjectId(projectid);
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
            const response = await apiCreateProject(
                { projectid: newProjectId.trim(), name: newProjectName.trim(), description: newProjectDescription.trim() }
            );
            if (response.status === 200) {
                setSuccessMsg({show: true, msg: `Project "${response.name}" created successfully!`});
                setNewProjectId('');
                setNewProjectName('');
                setNewProjectDescription('');
                setUserProjects(prev => [...prev, { projectid: response.projectid, name: response.name }]);
            } else {
                alert(response.message || "Failed to create project.");
            }
        } catch (error) {
            console.error("Failed to create project", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsCreatingProject(false);
        }
    };

    const goToDashboard = () => setCurrentView(VIEWS.DASHBOARD);

    const handleOpenProject = (projectid) => {
        setActiveProjectId(projectid);
        setCurrentView(VIEWS.PROJECT_INFO);
    };
    const renderNavBar = () => (
        <div style={UserProfileStyle.navBar}>
            <h1 className="nav-title">Welcome {user?.username || '<Guest>'}</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <button
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '4px 8px',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
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
        </div>
    );

    if (currentView === VIEWS.PROJECT_INFO) {
        return (
            <div style={UserProfileStyle.container}>
                <div style={UserProfileStyle.topTrim}></div>
                <ProjectInfoPage projectid={activeProjectId} userid={user?.userid} onBack={goToDashboard}/>
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
                    <div className="dashboard-section">
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
                        <div className="dashboard-section">
                            <strong style={UserProfileStyle.label}>Use Existing Project</strong>
                            <div style={UserProfileStyle.actionGroup}>
                                <span style={UserProfileStyle.label}>Project ID:</span>
                                <div className="search-wrapper">
                                    <input
                                        style={UserProfileStyle.selectInput}
                                        className="full-width-input"
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
                                                        key={proj.projectid}
                                                        style={UserProfileStyle.searchDropdownItem}
                                                        onMouseDown={() => handleProjectSelect(proj.projectid)}
                                                    >
                                                        <strong>{proj.projectid}</strong> - {proj.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={UserProfileStyle.searchDropdownItem} className="dropdown-empty">
                                                    No projects found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button style={UserProfileStyle.submitBtn} onClick={handleGoToProjectInfo}>
                                    Open
                                </button>
                            </div>
                        </div>

                        {/* Create New Project */}
                        <strong style={UserProfileStyle.label}>Create New Project</strong>
                        <div className="create-form">
                            <span style={UserProfileStyle.label}>Name:</span>
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
                                className={projectidTaken ? 'input-error' : ''}
                                value={newProjectId}
                                onChange={(e) => setNewProjectId(e.target.value)}
                                disabled={isCreatingProject}
                            />
                            {projectidTaken && (
                                <span className="project-id-error">Project ID already exists.</span>
                            )}
                            <button
                                style={UserProfileStyle.submitBtn}
                                className="align-end"
                                onClick={handleCreateProject}
                                disabled={isCreatingProject || projectidTaken}
                            >
                                {isCreatingProject ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ALL PROJECTS PAGE ── */}
                {currentView === VIEWS.ALL_PROJECTS && (
                    <div className="scroll-view">
                        <AllProjectsPage userid={user?.userid} onBack={goToDashboard} onOpenProject={handleOpenProject}/>
                    </div>
                )}

                {/* ── ALL HARDWARE PAGE ── */}
                {currentView === VIEWS.ALL_HARDWARE && (
                    <div className="scroll-view">
                        <AllHardwarePage onBack={goToDashboard}/>
                    </div>
                )}


            </div>

            <div style={UserProfileStyle.bottomTrim}></div>
            <SuccessPopup
                showPopup={successMsg.show}
                message={successMsg.msg}
                onClose={() => setSuccessMsg({show: false, msg: ""})}
            />
        </div>
    );
};
export default UserPortal;