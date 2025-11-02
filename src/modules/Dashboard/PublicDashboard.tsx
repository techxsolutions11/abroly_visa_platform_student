import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Spinner } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { HiHome, HiAcademicCap, HiGlobeAlt, HiPhone, HiOutlineMenuAlt4 } from 'react-icons/hi';
import ThemeToggle from '../../components/ThemeToggle';
import { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PublicRoutes } from '@/routes/AuthRoutes';
import Footer from '@/components/Footer';
import { LogIn, MessageCircleQuestion } from 'lucide-react';
import aborlyIcon from "../../assets/logo.png"
import { getAppName, getConfig } from '@/utils/config'

const PublicDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        {
            title: "Home",
            to: "/",
            icon: <HiHome className="text-xl" />
        },
        {
            title: "FAQs",
            to: "/faq",
            icon: <MessageCircleQuestion className="text-xl" />
        },
        {
            title: "Contact",
            to: "/contact_us",
            icon: <HiPhone className="text-xl" />
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                onMenuOpenChange={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
                className={
                    `transition-all duration-300 ${isScrolled ? 'shadow-lg backdrop-blur-lg bg-background/70' : ''}
                    ${isScrolled ? "h-14" : "h-16"}
                    `}
                maxWidth="xl"
            >
                <NavbarContent>
                    <NavbarMenuToggle
                        icon={<HiOutlineMenuAlt4 className="text-2xl" />}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer "
                        >
                            {/* <FaGraduationCap className="text-primary text-3xl" />
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                {getAppName()}
                            </span> */}
                            {/* <img src={aborlyIcon} alt="Aborly" className="w-12 h-12" /> */}
                            <img src={getConfig('FAVICON_URL')} alt="techxuniverse" className="w-12 h-12" />
                        </motion.div>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-3" justify="center">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <NavbarItem key={`${item.title}-${index}`}>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Button
                                        className={`min-w-[120px] ${isActive
                                            ? 'bg-primary text-white'
                                            : 'bg-default text-default-600 hover:bg-default-200'
                                            }`}
                                        variant={isActive ? "solid" : "flat"}
                                        onClick={() => navigate(item.to)}
                                        startContent={item.icon}
                                    >
                                        {item.title}
                                    </Button>
                                </motion.div>
                            </NavbarItem>
                        );
                    })}
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem className="flex gap-3 items-center">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                variant="flat"
                                color="primary"
                                onPress={() => navigate("/signup")}
                                className="hidden sm:flex bg-primary text-white"
                                startContent={<HiAcademicCap className="text-lg" />}
                            >
                                Sign Up
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                color="primary"
                                variant="solid"
                                className='bg-primary'
                                onPress={() => navigate("/login")}
                                startContent={<LogIn className="text-lg" />}
                            >
                                Login
                            </Button>
                        </motion.div>
                    </NavbarItem>
                </NavbarContent>

                {/* Mobile Menu */}
                <NavbarMenu className="pt-6">
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.title}-${index}`}>
                            <Link
                                className="w-full py-2 flex items-center gap-3 text-default-600 hover:text-primary"
                                onClick={() => {
                                    navigate(item.to);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>

            {/* Main Content */}
            <main className="flex-grow">
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        {PublicRoutes.map((item: any) => (
                            <Route key={item.path} path={item.path} element={<item.element />} />
                        ))}
                    </Routes>
                </Suspense>
            </main>

            <Footer />
        </div>
    );
};

export default PublicDashboard;