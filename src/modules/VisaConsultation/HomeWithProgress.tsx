import ProgressTracker from "./ProgressTracker";
import PrivateIntroPage from "@/modules/public/PrivateIntroPage";

/** Logged-in home: the student's visa progress first, then the usual home page. */
const HomeWithProgress = () => (
    <>
        <ProgressTracker compact />
        <PrivateIntroPage />
    </>
);

export default HomeWithProgress;
