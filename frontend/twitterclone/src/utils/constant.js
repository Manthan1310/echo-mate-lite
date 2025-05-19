// Frontend constants.js
// Dynamically determine the API endpoint based on environment
const getAPIBaseURL = () => {
    // Check if we're in production by looking at the hostname
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Local development
        return "http://localhost:8080/api/v1";
    } else {
        // Production on EC2 or elsewhere
        // Use the same hostname as the frontend but with backend port
        return `http://${hostname}:8080/api/v1`;
        // If you're using HTTPS in production, use:
        // return `https://${hostname}/api/v1`;
    }
};

const BASE_API_URL = getAPIBaseURL();

export const USER_API_END_POINT = `${BASE_API_URL}/user`;
export const TWEET_API_END_POINT = `${BASE_API_URL}/tweet`;

export const timeSince = (timestamp) => {
    let time = Date.parse(timestamp);
    let now = Date.now();
    let secondsPast = (now - time) / 1000;
    let suffix = 'ago';

    let intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (let i in intervals) {
        let interval = intervals[i];
        if (secondsPast >= interval) {
            let count = Math.floor(secondsPast / interval);
            return `${count} ${i} ${count > 1 ? 's' : ''} ${suffix}`;
        }
    }
    
    return 'just now';
}
