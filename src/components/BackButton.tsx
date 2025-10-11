import { Button } from '@nextui-org/react'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ title }) => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-row items-center  w-fit ml-4 gap-2'>
            <Button
                isIconOnly
                variant='flat'
                size='sm'
                onPress={() => {
                    navigate(-1)
                }}
                color='default'
            >
                <ChevronLeft />
            </Button>

            <p>{title}</p>
        </div>
    )
}

export default BackButton