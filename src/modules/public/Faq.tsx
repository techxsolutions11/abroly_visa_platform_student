import FaqSection from '@/components/FaqSection'
import React, { useEffect } from 'react'

const Faq = () => {
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    return (
        <div>
            <FaqSection />
        </div>
    )
}

export default Faq