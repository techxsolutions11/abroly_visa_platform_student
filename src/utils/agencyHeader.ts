import axios from 'axios';
import { getAgentUuid } from './config';

/**
 * Every request from the student portal carries the agency (tenant) it runs for,
 * so the backend keeps students of different agencies separate.
 * The agency is resolved from the subdomain at start-up (see routes/Index.tsx -> /agent/get_agency).
 */
export const registerAgencyHeader = () => {
    axios.interceptors.request.use((config) => {
        const agencyUuid = getAgentUuid();
        if (agencyUuid && config.headers && !config.headers['X-Agency-UUID']) {
            config.headers['X-Agency-UUID'] = agencyUuid;
        }
        return config;
    });
};
