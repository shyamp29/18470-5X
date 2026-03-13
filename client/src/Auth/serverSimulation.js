/** * PLACEHOLDER: Simulated Database Calls */

const mockAuthFetch = (credentials) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isValid = credentials.userId === "cats" &&
                credentials.password === "123456";
            resolve({ success: isValid,
                user:{ Id: credentials.userId, userName: "Tester"}
             });
        }, 2000);
    });
};

const mockSignupApi = async (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const existingEmails = ["admin@test.com", "user@test.com"];
            if (existingEmails.includes(userData.email)) {
                resolve({ success: false, message: "This email is already registered in our database." });
            } else {
                resolve({ success: true, user: { name: userData.userName } });
            }
        }, 2000);
    });
};

const mockRequestResetApi = async (email) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulated database of registered users
            const existingEmails = ["admin@test.com", "user@test.com", "guest@example.com"];

            if (existingEmails.includes(email)) {
                // Success: Email found, simulate sending the reset message
                resolve({
                    success: true,
                    message: "A reset link has been sent to your email."
                });
            } else {
                // Failure: Email not in our system
                resolve({
                    success: false,
                    message: "This email address is not recognized in our system."
                });
            }
        }, 1500); // 1.5s simulated network lag
    });
};

let mockDatabase = {
    hardware: [
        { id: "HWSet1", name: "Hardware Set 1", capacity: 100, available: 60 },
        { id: "HWSet2", name: "Hardware Set 2", capacity: 200, available: 150 },
        { id: "HWSet3", name: "Hardware Set 3", capacity: 50, available: 10 }
    ],
    projects: [
        {
            projectId: "PROJ-101",
            projectName: "System Alpha",
            description: "Main server allocation testing.",
            allocatedHardware: [
                { hwId: "HWSet1", allocated: 20 },
                { hwId: "HWSet2", allocated: 10 }
            ]
        },
        {
            projectId: "PROJ-102",
            projectName: "Beta Testing",
            description: "Secondary node deployment.",
            allocatedHardware: [
                { hwId: "HWSet1", allocated: 20 },
                { hwId: "HWSet3", allocated: 40 }
            ]
        }
    ]
};

const mockFetchUserProjects = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userProjects = mockDatabase.projects.map(p => ({
                id: p.projectId,
                name: p.projectName
            }));
            resolve({
                success: true, data: [
                    { id: 'PROJ-101', name: 'Hardware Set Allocation' },
                    { id: 'PROJ-102', name: 'System Alpha' },
                    { id: 'PROJ-103', name: 'Beta Testing' },
                    { id: 'PROJ-104', name: 'Cloud Server Migration' },
                    { id: 'PROJ-105', name: 'Data Pipeline V2' }
                ]
            });
        }, 1000);
    });
};

const mockFetchAllProjects = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const projectsList = mockDatabase.projects.map(p => ({
                projectId: p.projectId,
                projectName: p.projectName,
                description: p.description
            }));
            resolve({ success: true, data: projectsList });
        }, 1500);
    });
};

const mockFetchAllHardware = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: mockDatabase.hardware });
        }, 1500);
    });
};

const mockFetchProjectInfo = (projectId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const project = mockDatabase.projects.find(p => p.projectId === projectId);

            if (!project) {
                resolve({ success: false, message: "Project not found." });
                return;
            }

            const hardwareDetails = mockDatabase.hardware.map(hw => {
                const allocation = project.allocatedHardware.find(a => a.hwId === hw.id);
                return {
                    hwId: hw.id,
                    name: hw.name,
                    capacity: hw.capacity,
                    available: hw.available,
                    allocated: allocation ? allocation.allocated : 0
                };
            });

            const projectInfoResponse = {
                projectId: project.projectId,
                projectName: project.projectName,
                description: project.description,
                hardware: hardwareDetails
            };

            resolve({ success: true, data: projectInfoResponse });
        }, 1500);
    });
};

const mockCreateProject = (projectData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const exists = mockDatabase.projects.find(p => p.projectId === projectData.projectId);

            if (exists) {
                resolve({ success: false, message: "A project with this ID already exists." });
            } else {
                const newProject = {
                    projectId: projectData.projectId,
                    projectName: projectData.projectName,
                    description: projectData.description,
                    allocatedHardware: []
                };
                mockDatabase.projects.push(newProject);

                resolve({ success: true, message: "Project created successfully!", data: newProject });
            }
        }, 2000);
    });
};

export {
    mockAuthFetch, mockSignupApi, mockRequestResetApi,
    mockFetchUserProjects, mockFetchAllProjects,
    mockFetchAllHardware, mockFetchProjectInfo, mockCreateProject
};