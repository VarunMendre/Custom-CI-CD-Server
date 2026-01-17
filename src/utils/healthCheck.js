import axios from "axios";

export const verifyHealth = async (url, retries = 5, delayMs = 5000) => {
    for (let i = 1; i <= retries; i++) {
        try {
            const response = await axios.get(url, { timeout: 5000 });
            if (response.status === 200) return true;
        } catch (error) {
            // Continue retrying
        }
        if (i < retries) await new Promise(res => setTimeout(res, delayMs));
    }
    throw new Error(`Health check failed for ${url} after ${retries} attempts`);
};
