import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addToLocal, getFromLocal } from '../utils/localstorage';
import { setAuthLoading, setProfile, setRole, setToken } from '../redux/slices/loginSlice';
import { Spinner } from '@nextui-org/react';
import StudentDashboard from '../modules/Dashboard/StudentDashboard';
import PublicDashboard from '../modules/Dashboard/PublicDashboard';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { initializeMetaTags } from '../utils/setMetaTags';
import { setThemeColors } from '../utils/setThemeColors';

const Index = () => {

    const { commonPostAPICall, commonPublicGetApiCalls } = useApiCallUtils()
    // Check if config exists, if so don't show loader initially
    const [configLoading, setConfigLoading] = useState(!getFromLocal('app_config'));
    const location = useLocation();

    const tokenData = getFromLocal("token")
    const authLoad = getFromLocal("authLoad")
    const website = getFromLocal("website")

    const token = useSelector((state: any) => state.login.token) || tokenData;
    const role_type = useSelector((state: any) => state.login.role_type)
    const authLoading = useSelector((state: any) => state.login.authLoading) || authLoad
    const dispatch = useDispatch();

    // Helper function to apply config from localStorage
    const applyStoredConfig = () => {
        const existingConfig = getFromLocal('app_config');
        if (existingConfig) {
            // Re-apply config values from localStorage
            initializeMetaTags();
            setThemeColors();
        }
    };

    // Check and apply existing config immediately, then fetch fresh config
    useEffect(() => {
        // Apply existing config immediately if available
        applyStoredConfig();
        // Always fetch fresh config to update if needed
        fetchAppConfig();
    }, []);

    // Re-apply config on route changes/navigation
    useEffect(() => {
        // Apply config whenever route changes
        applyStoredConfig();
    }, [location.pathname]);

    useEffect(() => {
        setTimeout(() => {
            findTheRole()
        }, 1500)
    }, [token])

    useEffect(() => {
        // alert(website)
        if (website !== null && website != "student") {
            window.localStorage.clear()
            window.open("/", "_self")
        }
    }, [])

    const fetchAppConfig = async () => {
        setConfigLoading(true);
        try {
            // Fetch config from backend - adjust endpoint as needed
            const { data, success } = await commonPublicGetApiCalls('/agent/get_agency');
            
            if (success && data) {
                console.log('Fetched config data:', data); // Debug log
                
                // Helper function to ensure full URL
                const ensureFullUrl = (url: string) => {
                    if (!url) return '';
                    if (url.startsWith('http://') || url.startsWith('https://')) {
                        return url;
                    }
                    // If it's a relative path, try to construct full URL
                    if (url.startsWith('www.')) {
                        return `https://${url}`;
                    }
                    return url;
                };
                console.log('data', data);
                
                // Map backend response to frontend config format
                // Note: Backend returns 'uuid' field, not 'agent_uuid'
                const config = {
                    AGENT_UUID: data.uuid,
                    AGENT_ID: data.id || data.agent_id || data.agentId || '',
                    PRIMARY_COLOR: data.primary_color || data.primaryColor || '',
                    PRIMARY_FOREGROUND_COLOR: data.primary_foreground_color || data.primaryForegroundColor || '',
                    DARK_PRIMARY_COLOR: data.dark_primary_color || data.darkPrimaryColor || '',
                    APP_NAME: data.app_name || data.appName || '',
                    SUPPORT_NUMBER: data.support_number || data.supportNumber || '',
                    SUPPORT_EMAIL: data.support_email || data.supportEmail || '',
                    CERTIFICATE_URL: ensureFullUrl(data.certificate_url || data.certificateUrl || ''),
                    AGENCY_ADDRESS: data.agency_address || data.agencyAddress || '',
                    // Use full URLs if available, otherwise fallback to relative paths
                    FAVICON_URL: data.favicon_url_full || data.faviconUrlFull || data.favicon_url || data.faviconUrl || '/logo.png',
                    META_DESCRIPTION: data.meta_description || data.metaDescription || '',
                    META_KEYWORDS: data.meta_keywords || data.metaKeywords || '',
                    OG_IMAGE: data.og_image_full || data.ogImageFull || data.og_image || data.ogImage || '/logo.png',
                    OG_URL: ensureFullUrl(data.og_url || data.ogUrl || '')
                };
                
                console.log('Mapped config:', config); // Debug log
                
                // Store in localStorage
                addToLocal('app_config', JSON.stringify(config));
                
                // Small delay to ensure localStorage is updated
                setTimeout(() => {
                    // Initialize meta tags, favicon, and title after config is loaded
                    initializeMetaTags();
                    
                    // Also update theme colors after config is loaded
                    setThemeColors();
                    
                    // Config loading complete
                    setConfigLoading(false);
                }, 100);
            } else {
                // If API fails, still try to initialize with defaults from env
                initializeMetaTags();
                setConfigLoading(false);
            }
        } catch (error) {
            console.error('Failed to fetch app config:', error);
            // Continue with default values from env if API fails
            const existingConfig = getFromLocal('app_config');
            if (existingConfig) {
                // Use existing config if API fails
                initializeMetaTags();
                setThemeColors();
            } else {
                // No existing config, use defaults
                initializeMetaTags();
            }
            setConfigLoading(false);
        }
    }

    const findTheRole = async () => {
        const { data, success } = await commonPostAPICall({}, "/user/kyc")

        if (success == true) {

            dispatch(setRole(data.role))
            dispatch(setAuthLoading('true'))
            localStorage.setItem("authLoad", 'false')
            dispatch(setToken(token))
            dispatch(setProfile({
                profileimage: data?.profile,
                user_name: data?.name,
                phone: data?.country_code + " " + data?.phone,
                email: data?.email
            }))
            addToLocal("profile", data.profile)
            addToLocal("phone_with_code", data.country_code + " " + data.phone)
            addToLocal("name", data.name)
            addToLocal("website", "student")

        } else {
            dispatch(setAuthLoading('true'))
            dispatch(setToken(null))
            // Only clear auth-related items, keep app_config
            localStorage.removeItem('token');
            localStorage.removeItem('authLoad');
            localStorage.removeItem('profile');
            localStorage.removeItem('phone_with_code');
            localStorage.removeItem('name');
            localStorage.removeItem('website');
            // Don't clear app_config - keep it for consistent branding
        }
    }
    // Show loader while config is being fetched
    if (configLoading) {
        return (
            <div className='bg-white dark:bg-slate-900'>
                <div className="flex flex-col justify-center w-screen h-screen items-center align-center space-x-2 bg-white dark:bg-slate-900">
                    <div className='flex flex-col justify-center align-center bg-[#535C9110] border-2 border-slate-300 p-20 rounded-lg gap-3 bg-white dark:bg-slate-900'>
                        <p>Loading Configuration...</p>
                        <Spinner />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {
                token && token !== null ?

                    authLoading == 'false'
                        ?
                        <div className='bg-white dark:bg-slate-900'>
                            <div className="flex flex-col justify-center w-screen h-screen items-center align-center space-x-2 bg-white dark:bg-slate-900">

                                <div className='flex flex-col justify-center align-center bg-[#535C9110] border-2 border-slate-300 p-20 rounded-lg gap-3 bg-white dark:bg-slate-900'>
                                    <p>Please Wait</p>
                                    <Spinner />
                                </div>
                            </div>
                        </div>
                        :
                        (
                            role_type == "user" && <StudentDashboard />
                        )
                    :
                    <PublicDashboard />
            }
        </>
    )
}

export default Index