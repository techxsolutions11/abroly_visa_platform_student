
import path from "path"
import { lazy } from "react"

const Career = lazy(()=> import("@/modules/Career/Career"))
const ContactUs = lazy(()=> import("../components/ContactUs"))
const ContentWritingHistory = lazy(()=> import("../modules/ContentWritingHistory/ContentWritingHistory"))
const Files = lazy(()=> import("../modules/ContentWritingHistory/Files"))
const HealthInsurance = lazy(()=> import("../modules/HealthInsurance/HealthInsurance"))
const LangaugePrepDetails = lazy(()=> import("../modules/LanguagePrep/LangaugePrepDetails"))
const LanguagePrep = lazy(()=> import("../modules/LanguagePrep/LanguagePrep"))
const NotFound = lazy(()=> import("../modules/NotFound/NotFound"))
const IntroPage = lazy(()=> import("../modules/public/IntroPage"))
const Login = lazy(()=> import("../modules/public/Login"))
const PrivateIntroPage = lazy(()=> import("../modules/public/PrivateIntroPage"))
const Signup = lazy(()=> import("../modules/public/Signup"))
const SimCardListing = lazy(()=> import("../modules/SimcardListing/SimCardListing"))
const PublicStatic = lazy(()=> import("../modules/static/PublicStatic"))
const CareerDetails = lazy(()=> import("@/modules/Career/CareerDetails"))
const CareerHistory = lazy(()=> import("@/modules/Career/CareerHistory"))
const StudentProfile = lazy(()=> import("@/modules/Profile/StudentProfile"))
const ServiceInfo = lazy(()=> import("@/modules/Service_pages/ServiceInfo"))
const LanguagePrepPurchased = lazy(()=> import("@/modules/LanguagePrep/Purchased/LanguagePrepPurchased"))
const LanguagePrepPurchasedDetails = lazy(()=> import("@/modules/LanguagePrep/Purchased/Details/LanguagePrepPurchasedDetails"))
const SubPointDetails = lazy(()=> import("@/modules/LanguagePrep/Purchased/Details/SubPointDetails"))
const LanguagePrepPurchasedDetailsFullScreen = lazy(()=> import("@/modules/LanguagePrep/Purchased/Details/LanguagePrepPurchasedDetails"))
const LanguagePrepQuiz = lazy(()=> import("@/modules/LanguagePrep/Purchased/Quiz/LanguagePrepQuiz"))
const Certificate = lazy(()=> import("@/modules/LanguagePrep/Purchased/Certificate/Certificate"))
const Faq = lazy(()=> import("@/modules/public/Faq"))
const PublicEventBanners = lazy(()=> import("@/modules/EventBanners/PublicEventBanners"))
const VisaConsultationDetails = lazy(()=> import("@/modules/VisaConsultation/VisaConsultationDetails"))
const AcceptedApplicationProgress = lazy(()=> import("@/modules/VisaConsultation/AcceptedApplicationProgress"))
const AcceptedApplications = lazy(()=> import("@/modules/VisaConsultation/AcceptedApplications"))
const AgnetProfile = lazy(()=> import("@/modules/VisaConsultation/AgnetProfile"))
// const CoinHistory = lazy(()=> import("@/modules/Coins/CoinHistory"))
const OfflinePrep =  lazy(()=> import("@/modules/LanguagePrep/OfflinePrep"))
const ServicesRequest = lazy(()=> import("@/modules/ServiceRequests/ServicesRequest"))

export const PublicRoutes = [
    {
        path: "/",
        element: IntroPage
    },
    {
        path: "/login",
        element: Login
    },
    {
        path: "/signup",
        element: Signup
    },
    {
        path: "/contact_us",
        element: ContactUs
    },
    {
        path: "/sim_cards",
        element: SimCardListing
    },
    {
        path: "/health_insurance",
        element: HealthInsurance
    },
    {
        path: "/static/:id",
        element: PublicStatic
    },
    {
        path: "/services/:service",
        element: ServiceInfo
    },

    {
        path: "/services_request/:service",
        element: ServicesRequest
    },
    // public certificate validation
    {
        path: "/certificate/:id",
        element: Certificate
    },
    {
        path: "/faq",
        element: Faq
    },
    {
        path: "/event_banners",
        element: PublicEventBanners
    },
    {
        path: "*",
        element: NotFound
    },
]


export const StudentRoutes = [

    {
        path: "/",
        element: PrivateIntroPage
    },
    {
        path: "/contact_us",
        element: ContactUs
    },
    {
        path: "/sim_cards",
        element: SimCardListing
    },
    {
        path: "/health_insurance",
        element: HealthInsurance
    },
    {
        path: "/language_preparation",
        element: LanguagePrep
    },
    {
        path: "/language_preparation/:id",
        element: LangaugePrepDetails
    },
    // purchased language prep
    {
        path: "/purchased_language_prep",
        element: LanguagePrepPurchased
    },
    {
        path: "/purchased_language_prep/details/:id",
        element: LanguagePrepPurchasedDetails
    },
    {
        path: "/language_prep/quiz/:id",
        element: LanguagePrepQuiz
    },
    {
        path: "/language_prep/certificate/:id",
        element: Certificate
    },
    {
        path: "/purchased_language_prep/details_full/:id",
        element: LanguagePrepPurchasedDetailsFullScreen
    },
    {
        path: "/purchased_language_prep/sub_chapter/:purchase_id/:point_id",
        element: SubPointDetails
    },

    // offline language prep
    {
        path : "/offline_language_prep",
        element: OfflinePrep
    },


    {
        path: "/content_writing_history",
        element: ContentWritingHistory
    },
    {
        path: "/content_writing_files/:id",
        element: Files
    },
    {
        path: "/static/:id",
        element: PublicStatic
    },

    // job 
    {
        path: "/career/:pageNo",
        element: Career
    },
    {
        path: "/career/details/:uuid",
        element: CareerDetails
    },
    {
        path: "/career/history/list",
        element: CareerHistory
    },

    // service information
    {
        path: "/services/:service",
        element: ServiceInfo
    },
    {
        path: "/visa_consultation/:id",
        element: VisaConsultationDetails
    },
    {
        path: "/accepted_applications",
        element: AcceptedApplications
    },
    {
        path: "/accepted_applications/:id",
        element: AcceptedApplicationProgress
    },
    
    // agent profile
    {
        path: "/agent_profile/:id",
        element: AgnetProfile
    },

    // profile
    {
        path: "/student_profile",
        element: StudentProfile
    },
    
    // public certificate validation
    {
        path: "/certificate/:id",
        element: Certificate
    },

    // faq
    {
        path: "/faq",
        element: Faq
    },

    // event banners
    {
        path: "/event_banners",
        element: PublicEventBanners
    },
    {
        path: "/services_request/:service",
        element: ServicesRequest
    },

    // // event banners
    // {
    //     path: "/coin_history",
    //     element: CoinHistory
    // },

    // 404
    {
        path: "*",
        element: NotFound
    }
]