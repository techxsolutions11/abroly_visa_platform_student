import { Button } from '@nextui-org/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div>
            <section className="flex items-center h-full p-16">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl">
                            <span className="sr-only">Error</span>404
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                        <p className="mt-4 mb-8">But dont worry, you can find plenty of other things on our homepage.</p>
                        {/* <a rel="noopener noreferrer" href="#" className="px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50">Back to homepage</a> */}
                        <section className='flex items-center justify-center gap-4'>
                            <Button 
                            onPress={()=>{
                                navigate("/")
                            }}
                            variant='flat' color='secondary'> {"<"} Back To Home</Button>
                            <Button 
                            onPress={()=>{
                                navigate("/contact_us")
                            }}
                            variant='flat' color='warning'>Contact Us {">"}</Button>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NotFound