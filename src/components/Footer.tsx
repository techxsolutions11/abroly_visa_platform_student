// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@nextui-org/react';
// import { 
//   Facebook, 
//   Twitter, 
//   Linkedin, 
//   Instagram,
//   Mail,
//   Phone,
//   MapPin,
//   ArrowRight
// } from 'lucide-react';
// import useApiCallUtils from '@/hooks/useApiCallUtils';

// const Footer = () => {
//     const { commonPublicGetApiCalls } = useApiCallUtils()
//     const [initStaticPages, setInitStaticPages] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         initStaicPageListing();
//     }, []);

//     const initStaicPageListing = async () => {
//         const { data, success } = await commonPublicGetApiCalls("/static/list");
//         if (success && success == true) {
//             setInitStaticPages(data);
//         }
//     };

//     return (
//         <footer className="w-full bg-slate-900 text-white">
//             {/* Main Footer Content */}
//             <div className="max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
//                     {/* Brand Column */}
//                     <div className="col-span-2 lg:col-span-1">
//                         <a className="flex-none text-xl font-semibold text-white" href="/">
//                             {import.meta.env.VITE_APP_NAME}
//                         </a>
//                         <p className="mt-3 text-sm text-slate-400">
//                             Empowering visa consultants with intelligent CRM solutions to streamline operations and grow their business.
//                         </p>
//                         <div className="mt-4 flex space-x-4">
//                             {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
//                                 <a 
//                                     key={idx}
//                                     href="#" 
//                                     className="text-slate-400 hover:text-blue-500 transition-colors"
//                                 >
//                                     <Icon size={20} />
//                                 </a>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Static Pages Column */}
//                     <div>
//                         <h4 className="font-semibold text-white">Company</h4>
//                         <div className="mt-3 grid space-y-3">
//                             {initStaticPages.map((item: any, idx) => (
//                                 <p
//                                     key={idx}
//                                     // variant='light' 
//                                     className="justify-start p-0 text-sm text-slate-400 hover:text-blue-500 cursor-pointer"
//                                     onClick={() => navigate(`/static/${item?.url}`, { replace: true })}
//                                 >
//                                     {item?.title}
//                                 </p>
//                             ))}
//                             <a
//                                 className="justify-start p-0 text-sm text-slate-400 hover:text-blue-500 cursor-pointer"
//                                 onClick={() => navigate('/contact_us')}
//                             >
//                                 Contact Us
//                             </a>
//                         </div>
//                     </div>

//                     {/* Contact Info */}
//                     <div className='mr-0'>
//                         <h4 className="font-semibold text-white">Contact</h4>
//                         <div className="mt-3 grid space-y-3">
//                             <p className="flex items-center gap-2 text-sm text-slate-400">
//                                 <Mail size={16} />
//                                 {import.meta.env.VITE_SUPPORT_EMAIL}
//                             </p>
//                             <p className="flex items-center gap-2 text-sm text-slate-400">
//                                 <Phone size={16} />
//                                 +1 (555) 123-4567
//                             </p>
//                             <p className="flex items-center gap-2 text-sm text-slate-400">
//                                 <MapPin size={16} />
//                                 123 Business Ave, Suite 100
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom Bar */}
//                 <div className="mt-12 grid gap-y-2 sm:flex sm:justify-between sm:items-center border-t border-slate-700 pt-6">
//                     <div className="flex items-center gap-x-3">
//                         <p className="text-sm text-slate-400">
//                             © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.
//                         </p>
//                     </div>
//                     <div className="flex gap-x-4">
//                         <p className="text-sm text-slate-400">
//                             Developed by{' '}
//                             <a 
//                                 href='https://techxsolutions.in/' 
//                                 target='_blank'
//                                 className='text-blue-500 hover:text-blue-400 transition-colors'
//                             >
//                                 techxsolutions.in
//                             </a>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import useApiCallUtils from '@/hooks/useApiCallUtils';
import { getAppName, getSupportEmail, getSupportNumber } from '@/utils/config';

const Footer = () => {
    const { commonPublicGetApiCalls } = useApiCallUtils();
    const [staticPages, setStaticPages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaticPages();
    }, []);

    const fetchStaticPages = async () => {
        const { data, success } = await commonPublicGetApiCalls('/static/list');
        if (success) {
            setStaticPages(data);
        }
    };

    return (
        <footer className="w-full bg-gray-900 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="flex flex-col">
                        <Link to="/" className="text-2xl font-bold text-white mb-3">
                            {getAppName()}
                        </Link>
                        {/* <p className="text-sm text-gray-400 max-w-xs">
                            Get personalized guidance for admissions, scholarships, and visa processing at top universities worldwide.
                        </p> */}
                        <div className="mt-4 flex space-x-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Static Pages */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-white mb-3">Company</h4>
                        <ul className="space-y-2">
                            {staticPages?.filter((item: any) => item?.url !== "agent_tnc_signup").map((item, idx) => (
                                <li key={idx}>
                                    <p
                                        className="text-sm text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-200"
                                        onClick={() => navigate(`/static/${item.url}`)}
                                    >
                                        {item.title}
                                    </p>
                                </li>
                            ))}
                            <li>
                                <p
                                    className="text-sm text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-200"
                                    onClick={() => navigate('/contact_us')}
                                >
                                    Contact Us
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold text-white mb-3">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <Mail size={16} /> {getSupportEmail()}
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <Phone size={16} /> {getSupportNumber()}
                            </li>
                            {/* Uncomment if you want to add address */}
                            {/* <li className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={16} /> 123 Business Ave, Suite 100
            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-6 text-center sm:text-left">
                    <p className="text-sm text-gray-400 mb-4 sm:mb-0">
                        © {new Date().getFullYear()} {getAppName()}. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400">
                        Developed by
                        <a
                            href="https://techxsolutions.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-400 ml-1 transition-colors duration-200"
                        >
                            TechX Solutions
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;