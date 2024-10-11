import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import { msalConfig, loginRequest } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsal = async () => {
    try {
        await msalInstance.initialize();
    } catch (error) {
        console.error("MSAL initialization failed", error);
    }
};

export const signIn = async () => {
    try {
        await initializeMsal();
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        return loginResponse;
    } catch (error) {
        console.error("Login failed", error);
    }
};

export const signOut = async () => {
    try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.logoutPopup({
                account: accounts[0],
                postLogoutRedirectUri: "http://localhost:5173",
            });
        }
    } catch (error) {
        console.error("Logout failed", error);
    }
};

export const getToken = async () => {
    try {
        await initializeMsal();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
            console.log("No account logged in, skipping token acquisition.");
            return null;
        }

        const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        });

        return response.accessToken;
    } catch (error) {
        console.error("Token acquisition failed", error);
        return signIn();
    }
};

export const getUserProfile = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return null;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const profileResponse = await axios.get("https://graph.microsoft.com/v1.0/me", { headers });
        const profile = profileResponse.data;

        try {
            const photoResponse = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
                headers,
                responseType: "blob",
            });
            const photoUrl = URL.createObjectURL(photoResponse.data);
            profile.photo = photoUrl;
        } catch (error) {
            console.error("Failed to fetch profile picture", error);
            profile.photo = null; 
        }

        return profile;
    } catch (error) {
        console.error("Failed to fetch user profile", error);
    }
};

export { msalInstance };
