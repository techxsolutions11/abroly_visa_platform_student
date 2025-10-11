// import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, useDisclosure } from '@nextui-org/react';
// import React from 'react'
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import { PublicRoutes, StudentRoutes } from '../../routes/AuthRoutes';
// import ThemeToggle from '../../components/ThemeToggle';
// import Footer from '../../components/Footer';
// import CommonConfirmation from '../../components/CommonConfirmation';
// import { handleLogout } from '../../utils/LogoutUtils';
import {
  BadgeCheck,
  BadgeIndianRupee,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Contact,
  CreditCard,
  Currency,
  Dock,
  Folder,
  Forward,
  Frame,
  Home,
  Languages,
  LifeBuoy,
  LogOut,
  Map,
  MapPin,
  MessageCircleQuestion,
  MoreHorizontal,
  PieChart,
  ScrollText,
  Send,
  Settings2,
  Share,
  Sparkles,
  SquareChartGantt,
  SquareTerminal,
  Trash2,
  UserCogIcon,
} from "lucide-react"


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Suspense, useEffect, useState } from "react"
import { Avatar, Button, Spinner, useDisclosure } from "@nextui-org/react"
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import { StudentRoutes } from "@/routes/AuthRoutes"
import CommonConfirmation from "@/components/CommonConfirmation"
import { handleLogout } from "@/utils/LogoutUtils"
import { useDispatch, useSelector } from "react-redux"
import CommonLocationSelector from "@/components/CommonLocationSelector"
import { setArea, setLatitude, setLongitude } from "@/redux/slices/userLocationSlice"
import { ErrorToast } from "@/utils/Toaster"
import { addToLocal } from "@/utils/localstorage"
import useApiCallUtils from "@/hooks/useApiCallUtils"
import { useQuery } from "@tanstack/react-query"
import aborlyIcon from "../../assets/logo.png"

const data = {
  navMain: [
    {
      title: "Introduction",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Events",
          url: "/event_banners",
        },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: SquareChartGantt,
      isActive: true,
      items: [
        {
          title: "Health Insurenace",
          url: "/services/health_ins",
        },
        {
          title: "Sim Cards",
          url: "/services/sim_card",
        },
        {
          title: "Visa & Course Consultation",
          url: "/services/visa_consultation",
        },
        {
          title: "Accommodation",
          url: "/services/accommodation",
        },

      ],
    },
    {
      title: "Visa & Course Consultation",
      url: "#",
      icon: Dock,
      isActive: true,
      items: [
        {
          title: "Raise an application",
          url: "/services/visa_consultation",
        },
        {
          title: "Accepted Applications",
          url: "/accepted_applications",
        },
      ],
    },
    {
      title: "Language Preparation",
      url: "#",
      icon: Languages,
      isActive: true,
      items: [
        {
          title: "View All",
          url: "/services/language",
        },
        {
          title: "Purchased",
          url: "/purchased_language_prep",
        },
        {
          title: "Offline",
          url: "/offline_language_prep",
        },
      ],
    },
    {
      title: "Content Writing",
      url: "#",
      icon: ScrollText,
      isActive: true,
      items: [
        {
          title: "SOP",
          url: "/services/sop",
        },
        {
          title: "Motivation Letter",
          url: "/services/motivation",
        },
        {
          title: "Cover Letter",
          url: "/services/cover",
        },
        {
          title: "Purchased",
          url: "/content_writing_history",
        },
      ],
    },
    {
      title: "Career",
      url: "#",
      icon: Briefcase,
      isActive: true,
      items: [
        {
          title: "Current Openings",
          url: "/career/1",
        },
        {
          title: "Applications",
          url: "/career/history/list",
        },
      ],
    },

  ],
  navSecondary: [
    {
      title: "FAQs",
      url: "/faq",
      icon: MessageCircleQuestion,
    },
    {
      title: "Contact Us",
      url: "/contact_us",
      icon: Contact,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  profile: [
    {
      title: "Your Profile",
      url: "#",
      icon: UserCogIcon,
      isActive: true,
      items: [
        {
          title: "Student Profile",
          url: "/student_profile",
        },
        // {
        //   title: "Visa Profile",
        //   url: "/",
        // },
      ],
    },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
  ],
}


const placesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

const StudentDashboard = () => {

  // for logout
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isLocationOpen, onOpenChange: onLocationOpenChange } = useDisclosure();
  const {commonGetAPICalls} = useApiCallUtils()

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const { phone, email, profileimage, user_name } = useSelector((state: any) => state.login);


  const { latitude, longitude, area } = useSelector((state: any) => state.user_location);

  useEffect(() => {
    if (area == "") {
      handleGetCurrentLocation();
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLatitude(latitude));
          addToLocal("latitude", latitude + "");
          dispatch(setLongitude(longitude));
          addToLocal("longitude", longitude + "");

          // Fetch the area using the Geocoding API
          await fetchAreaFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          ErrorToast("Failed to get your location. Please enable location services.");
        },
        {
          enableHighAccuracy: true, // Request high-accuracy location
          timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0, // Do not use cached location
        }
      );
    } else {
      ErrorToast("Geolocation is not supported by your browser.");
    }
  };

  const fetchAreaFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${placesApiKey}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address; // Full address
        const areaName = data.results[0].address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name; // Area name
        dispatch(setArea(areaName || formattedAddress || "Unknown Area"));
        addToLocal("area", areaName || formattedAddress || "Unknown Area");
      } else {
        console.error("Failed to fetch area:", data);
        dispatch(setArea("Unknown Area"));
      }
    } catch (error) {
      console.error("Error fetching area:", error);
      dispatch(setArea("Unknown Area"));
    }
  };

  // api to get coins
  const coinsBalance = async () =>{
    const {data,success,message } = await commonGetAPICalls(`/coins/student/get_coins_balance`) 
    if(success && success == true){
      return data 
    }
    throw new Error(message)
  }

  const {data:balance} = useQuery({
    queryKey:['coins_balance'],
    queryFn:coinsBalance,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  })

  return (
    <>
      <SidebarProvider className="bg-white">
        <Sidebar collapsible="icon" className="bg-white md:bg-transparent" >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={aborlyIcon} alt="Abroly"  /> 
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Abroly
                    </span>
                    <span className="truncate text-xs">
                      Student
                    </span>
                  </div>
                </SidebarMenuButton>

              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {data?.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span className="text-[12px] font-semibold">{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  className={`${window.location.pathname == subItem.url && 'bg-gray-100'} text-xs -my-1`}
                                  to={subItem.url}
                                >{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Personal Details</SidebarGroupLabel>
              <SidebarMenu>
                {data.profile.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span className="text-[12px] font-semibold">{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  className={`${window.location.pathname == subItem.url && 'bg-gray-100'}`}
                                  to={subItem.url}
                                >{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.navSecondary.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild size="sm">
                        <Link
                          to={item.url}
                        >
                          <item.icon />
                          <span className="text-[12px] font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar
                        src={profileimage}
                        showFallback
                        className="h-8 w-8 rounded-lg"
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user_name}
                        </span>
                        <span className="truncate text-xs">
                          {phone}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar
                          src={profileimage}
                          showFallback
                          className="h-8 w-8 rounded-lg"
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user_name}
                          </span>
                          <span className="truncate text-xs">
                            {phone}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onOpenChange}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Button size="sm" onClick={() => { onLocationOpenChange() }} startContent={<MapPin className="p-1" />} color="primary">{area !== "" ? area : "Select Your Location"}</Button>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Button size="sm" variant="flat" className="ml-auto"
              onClick={()=> {
                navigate("/coin_history")
              }}
              startContent={<BadgeIndianRupee className="p-1" />} color="success"><p className="font-bold text-lg">{balance}</p></Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Suspense fallback={<Spinner />}>
              <Routes>
                {
                  StudentRoutes.map(
                    (item: any) => <Route key={item.path} path={item.path} element={<item.element />} />)
                }
              </Routes>
            </Suspense>
          </div>
        </SidebarInset>

        <CommonLocationSelector
          isOpen={isLocationOpen}
          onOpenChange={onLocationOpenChange}
        />

      </SidebarProvider >

      <CommonConfirmation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={"Are you sure want to logout ?"}
        handleSubmit={() => {
          handleLogout(navigate)
        }}
        nagativeTitle={"No"}
        positiveTitle={"Yes"}
      />
    </>

  )
}

export default StudentDashboard