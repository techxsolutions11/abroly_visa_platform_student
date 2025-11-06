import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Panel, PanelGroup, Progress } from 'rsuite'
import ReactPlayer from 'react-player'
import { Button, Slider, Spinner } from '@nextui-org/react'
import { CheckCheck, CheckCircle, Circle, CirclePause, CirclePlay, Maximize, Minimize, Play, Volume1, Volume2 } from 'lucide-react'
import { SuccessToast } from '@/utils/Toaster'
import useApiCallUtils from '@/hooks/useApiCallUtils'

const LanguagePrepPurchasedDetailsFullScreen = () => {

    const { commonPostAPICall } = useApiCallUtils()

    const { id } = useParams()

    const [courseDetails, setCourseDetails] = useState<any>({})
    const [currentVideo, setCurrentVideo] = useState("");
    const [currentSubPoint, setCurrentSubPoint] = useState<any>({})

    const [loading, setIsLoading] = useState(true)

    // progress records
    const [progressTrack, setProgressTrack] = useState([])

    useEffect(() => {
        findDetails()
        progressRecordFind()

    }, [])

    const findDetails = async () => {
        setIsLoading(true)
        const { data, success } = await commonPostAPICall({ uuid: id }, "/language_prep/student/purchase_course_details")
        if (success && success == true) {
            setCourseDetails(data)
            // setCurrentVideo(data?.chapters?.[0]?.chapter_points?.[0]?.video_url)
            // setCurrentSubPoint(data?.chapters?.[0]?.chapter_points?.[0])
        }
        setIsLoading(false)
    }

    // find progress
    const progressRecordFind = async () => {
        const { data, success } = await commonPostAPICall({ uuid: id }, "/language_prep/student/progress_check")
        if (success && success == true) {
            setProgressTrack(data)
        }
    }

    // update Progress
    const progressUpdate = async () => {
        if (checkCompletedOrNot(currentSubPoint?.uuid)) {
            SuccessToast("Already Completed")
            return
        }
        const { data, success } = await commonPostAPICall({ uuid: currentSubPoint?.uuid }, "/language_prep/student/progress_update", true)
        if (success && success == true) {
            setProgressTrack(data)
            progressRecordFind()

        }
        // next point

    }

    const checkCompletedOrNot = (uuid) => {
        return progressTrack?.filter((item: any) => item?.sub_point_uuid == uuid && item?.is_completed == 1).length == 1
    }
    const checkEveryChapterCompletedOrNot = (chapters) => {

        const countIsComplte = []
        chapters?.map((el) => {
            countIsComplte.push(checkCompletedOrNot(el?.uuid))
        })

        // return progressTrack?.filter((item: any) => item?.sub_point_uuid == uuid && item?.is_completed == 1).length == 1
        return countIsComplte.filter((item: any) => item == false).length == 0
    }

    const playerRef = useRef(null);
    const playerWrapperRef = useRef(null); // Reference for the player wrapper
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState<any>(0.8);
    const [played, setPlayed] = useState<any>(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quality, setQuality] = useState('hd1080'); // Example qualities: 'hd1080', 'hd720', 'small'

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleProgress = (state) => {
        setPlayed(state.played);
    };

    const handleSeekChange = (value) => {
        playerRef.current.seekTo(value);
        setPlayed(value);
        setIsPlaying(true);
    };

    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            playerWrapperRef.current.requestFullscreen();
        }
    };

    const handleQualityChange = (value) => {
        setQuality(value);
        // Logic to change video quality can be added here
        if (playerRef.current && playerRef.current.getInternalPlayer()) {
            const player = playerRef.current.getInternalPlayer();
            player.setPlaybackQuality(value); // Set the video quality dynamically
        }
    };

    // Update fullscreen state when the fullscreen mode changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement) {
                setIsFullscreen(true);
            } else {
                setIsFullscreen(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const onPlayerReady = () => {
        const player = playerRef.current.getInternalPlayer();
        player.setPlaybackQuality(quality); // Set initial quality
    };

    const refPlayerSection = useRef(null)

    console.log(progressTrack?.reduce((total, current) => (current?.is_completed == 1) ? total + 1 : total + 0, 0));

    const navigate = useNavigate()

    return (
        <div className='w-[90vw] sm:w-full '>
            {loading == true ? <div className='flex items-center justify-center my-5'><Spinner /></div> :
                <>

                    <div className="flex flex-col lg:flex-row">

                        {/* Video Section */}
                        <div className="flex-1 sm:w-full lg:h-[90vh] overflow-y-scroll" ref={refPlayerSection}>
                            <div className="p-4 mx-auto space-y-6">
                                {/* Course Title */}
                                <div className="border-b pb-4">
                                    <h1 className="text-2xl font-semibold text-gray-800">{courseDetails?.title}</h1>

                                </div>

                                {/* Progress Section */}
                                <div className="space-y-2">
                                    <h2 className="text-lg font-medium text-gray-700">Course Progress</h2>
                                    <div className="flex items-center">
                                        <Progress
                                            percent={Math.floor(
                                                (progressTrack?.reduce(
                                                    (total, current) => current?.is_completed ? total + 1 : total, 0
                                                ) / progressTrack?.length) * 100
                                            )}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Complete all chapters to unlock the final quiz and test your knowledge.
                                    </p>
                                </div>

                                {/* Quiz Button */}
                                {Math.floor(
                                    (progressTrack?.reduce(
                                        (total, current) => current?.is_completed ? total + 1 : total, 0
                                    ) / progressTrack?.length) * 100
                                ) === 100 && (
                                        <div className="pt-4">
                                            <Button 
                                            onClick={()=>{
                                                navigate(`/language_prep/quiz/${id}`)
                                            }}
                                            className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700">
                                                Take Final Quiz
                                            </Button>
                                        </div>
                                    )}
                            </div>
                            {currentSubPoint?.video_url && currentSubPoint?.video_url !== "" &&
                                <div
                                    ref={playerWrapperRef}
                                    className="relative aspect-video"
                                    style={{ position: isFullscreen ? 'fixed' : 'relative', zIndex: isFullscreen ? 1000 : 'auto' }}
                                >
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={currentVideo}
                                        playing={isPlaying}
                                        volume={volume}
                                        onProgress={handleProgress}
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        loop={false}
                                        onPause={() => setIsPlaying(false)}
                                        onPlay={() => setIsPlaying(true)}
                                        onReady={onPlayerReady}
                                        onEnded={() => {
                                            progressUpdate()
                                        }}
                                        config={{
                                            youtube: {
                                                playerVars: {
                                                    controls: 2,
                                                    rel: 0,
                                                    showinfo: 0,
                                                    modestbranding: 1,
                                                    fs: 0,
                                                    iv_load_policy: 3,
                                                    playlist: '',
                                                    enablejsapi: import.meta.env.VITE_IS_LOCAL !== "true" ? 1 : 0
                                                },
                                            },
                                        }}
                                    />

                                    {/* Custom Controls */}
                                    <div
                                        className={`absolute invisible bottom-0 left-0 w-full p-4 transition-all ${isFullscreen ? 'bg-black bg-opacity-60' : 'hover:bg-black'}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {/* Top Row Controls */}
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <div className="flex items-center">
                                                {/* Play/Pause Section */}
                                                <Button
                                                    onClick={togglePlayPause}
                                                    variant="solid"
                                                    isIconOnly
                                                    color="primary"
                                                    aria-label={isPlaying ? "Pause" : "Play"}
                                                    size="sm"
                                                >
                                                    {isPlaying ? <CirclePause className="p-1" /> : <CirclePlay className="p-1" />}
                                                </Button>
                                            </div>
                                            <div className='flex-grow'></div>

                                            <div className="flex items-center">
                                                {/* Volume Section */}
                                                <Slider
                                                    aria-label="Volume"
                                                    size="md"
                                                    color="success"
                                                    minValue={0}
                                                    maxValue={1}
                                                    step={0.01}
                                                    startContent={<Volume1 className="p-1 text-white" />}
                                                    endContent={<Volume2 className="p-1 text-white" />}
                                                    value={volume}
                                                    onChange={setVolume}
                                                    style={{ width: 120 }}
                                                />
                                            </div>
                                            <div className="flex items-center ml-4 mt-2">
                                                <Button
                                                    variant="flat"
                                                    size="sm"
                                                    onClick={() => handleQualityChange(quality === 'hd720' ? 'hd1080' : 'hd720')}
                                                    className="text-white"
                                                >
                                                    {quality === 'hd720' ? '720p' : '1080p'}
                                                </Button>
                                            </div>

                                            <div className="flex items-center ml-4">
                                                {/* Fullscreen Control Section */}
                                                <Button
                                                    onClick={toggleFullscreen}
                                                    variant="solid"
                                                    isIconOnly
                                                    color="primary"
                                                    size="sm"
                                                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                                >
                                                    {isFullscreen ? <Minimize className="p-1" /> : <Maximize className="p-1" />}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Bottom Timeline */}
                                        <div className="w-full">
                                            <Slider
                                                size="lg"
                                                minValue={0}
                                                maxValue={1}
                                                step={0.01}
                                                value={played}
                                                onChange={handleSeekChange}
                                                style={{ width: '100%' }}
                                                className="w-full"
                                                aria-label="Progress"
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="p-4 space-y-2">
                                <div className='ml-auto w-fit'>
                                    <Button
                                        size="sm"
                                        variant='shadow'
                                        color="primary"
                                        onPress={progressUpdate}
                                        className={currentSubPoint?.uuid ? "visible" : "hidden"}
                                    > <CheckCheck className='p-1 -mr-2' />
                                        {!checkCompletedOrNot(currentSubPoint?.uuid) ? "Mark As Complete" : "Already Completed"}
                                    </Button>
                                </div>

                                {/* Title */}
                                <div className="">
                                    <h1 className="text-2xl font-semibold text-gray-800">{currentSubPoint?.title}</h1>
                                </div>

                                {/* Short Description */}
                                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: currentSubPoint?.short_description }}></div>

                                {/* PDF File Section */}
                                {currentSubPoint?.file && (
                                    <div className="px-6 py-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Download PDF</h3>
                                        <a
                                            href={currentSubPoint?.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        >
                                            Download PDF
                                        </a>
                                    </div>
                                )}

                                <h1 className="text-xl font-semibold text-gray-800">Description</h1>
                                {/* Short Description */}
                                <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: courseDetails?.description }} />
                            </div>
                        </div>

                        {/* Course Content Section */}
                        {/* fixed right-0 top-0 */}
                        <div className="lg:w-[400px] bg-white overflow-y-auto sm:w-full lg:h-[90vh] ">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-lg font-bold">Course content</h2>
                            </div>

                            <div className="p-1">
                                <PanelGroup accordion bordered>
                                    {courseDetails?.chapters?.map((chapter, index) => (
                                        <Panel
                                            key={index}
                                            header={
                                                <div
                                                    className="flex items-center justify-between cursor-pointer p-1 rounded-lg"
                                                    onClick={() => { }}
                                                >
                                                    <div>
                                                        <h3 className="font-semibold">Section {index + 1}: {chapter?.chapter_name}</h3>
                                                        <p className="text-sm text-gray-500 flex flex-row items-center gap-2">
                                                            {chapter?.chapter_points.length} Points • {checkEveryChapterCompletedOrNot(chapter?.chapter_points) == true ? (<>
                                                                <CheckCircle className="text-green-500 " size={20} />
                                                            </>
                                                            ) : (
                                                                <>
                                                                    <Circle className="text-gray-500 " size={20} />
                                                                </>
                                                            )}
                                                        </p>
                                                        <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: chapter?.description }}></div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div key={index} className="mb-6">
                                                <div className="mt-2">
                                                    {chapter?.chapter_points?.map((point, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-start p-4 ${currentSubPoint.uuid == point.uuid && "bg-gray-200"} hover:bg-gray-100 cursor-pointer`}
                                                            onClick={() => {
                                                                refPlayerSection?.current.scrollTo(0, 0)
                                                                setCurrentVideo(point?.video_url)
                                                                setCurrentSubPoint(point)
                                                            }}
                                                        >
                                                            <div className="mr-3">
                                                                {point?.video_url ? (
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className='w-full'>
                                                                <section className="flex flex-row gap-2 items-center justify-between">
                                                                    <h4 className="text-sm font-medium flex-grow">{point?.title}</h4>
                                                                    {checkCompletedOrNot(point?.uuid) == true
                                                                        ? (<>
                                                                            <CheckCircle className="text-green-500 " size={15} />
                                                                        </>
                                                                        ) : (
                                                                            <>
                                                                                <Circle className="text-gray-500 " size={15} />
                                                                            </>
                                                                        )
                                                                    }
                                                                </section>

                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {point?.video_url ? 'Video' : 'Reading'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Panel>
                                    ))}
                                </PanelGroup>
                            </div>
                        </div>

                    </div>
                </>
            }
        </div >

    )
}

export default LanguagePrepPurchasedDetailsFullScreen