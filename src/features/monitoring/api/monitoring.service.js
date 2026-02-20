import monitorClient from './monitorClient';

const ENDPOINT = '/api/v1/health';

export const monitoringService = {
    getOverview: () => monitorClient.get(`${ENDPOINT}/overview`), // Returns { healthLevel, uptimeSeconds... }
    getSystem: () => monitorClient.get(`${ENDPOINT}/system`),     // Returns { cpu, memory, disk... }
    getApp: () => monitorClient.get(`${ENDPOINT}/app`),           // Returns { isRunning, status... }
};