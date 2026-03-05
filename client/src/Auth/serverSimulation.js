/** * PLACEHOLDER: Simulated Database Calls */

const mockAuthFetch = (credentials) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isValid = credentials.userId === "validUser" && 
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

export { mockAuthFetch, mockSignupApi };