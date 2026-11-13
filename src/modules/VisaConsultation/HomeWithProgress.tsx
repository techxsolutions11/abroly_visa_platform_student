import ProgressTracker from "./ProgressTracker";
import PrivateIntroPage from "@/modules/public/PrivateIntroPage";
import InstallAppCard from "@/components/InstallAppCard";

/** Logged-in home: the student's visa progress first, then the usual home page. */
const HomeWithProgress = () => (
    <>
        <InstallAppCard />
        <ProgressTracker compact />
        <PrivateIntroPage />
    </>
);

export default HomeWithProgress;
