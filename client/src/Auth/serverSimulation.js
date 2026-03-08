/** * PLACEHOLDER: Simulated Database Calls */

const mockAuthFetch = (credentials) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isValid = credentials.userId === "cats" && 
                          credentials.password === "123456";
            resolve({ success: isValid });
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


export { mockAuthFetch, mockSignupApi, mockRequestResetApi };