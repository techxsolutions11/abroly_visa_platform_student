import useApiCallUtils from '@/hooks/useApiCallUtils';
import { Button, Card, CardBody } from '@nextui-org/react';
import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';


const Files = () => {
  const { commonPostAPICall } = useApiCallUtils()


  const { id } = useParams()

  const [files, setFiles] = useState([])

  useEffect(() => {
    initFilesDetailsAPICall()
  }, [])

  const initFilesDetailsAPICall = async () => {
    const { data, success } = await commonPostAPICall({ uuid: id }, "/content_writing_response/list_files")
    if (success && success == true) {
      setFiles(data)
    }

  }
  return (
    <div className='container mx-auto'>

      <Card className='container mx-auto mt-5'>
        <CardBody className="p-4 flex flex-col items-start gap-2">
          <h1 className='text-2xl'>Provided Documents</h1>
          <hr className='w-full' />

          <section className='flex flex-row flex-wrap gap-2 items-stretch justify-stretch'>
            {files && files.length != 0 ? files.map((item) => (
              <Card className="truncate hover:text-clip w-full md:w-fit">
                <CardBody>
                  <div className="py-3 flex flex-col gap-2 items-start">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                      File Type: {item?.file_type}
                    </div>
                    <p className="text-balance text-tiny">
                      {item?.file_name}
                    </p>
                    <p className="text-gray-500 text-tiny">Uploaded On : {new Date(item?.createdAt).toLocaleString()}</p>
                    <Button
                      className=""
                      onPress={() => {
                        FileSaver.saveAs(item.access_file, item.file_name);
                      }}
                    >
                      Download File
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )) : <p>No Documents Uploaded</p>}
          </section>

        </CardBody>

      </Card>
    </div>
  )
}

export default Files