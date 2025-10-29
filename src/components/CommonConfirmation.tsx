import { Button } from "@nextui-org/react";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
} from "@nextui-org/react";
import { TriangleAlert } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";

const CommonConfirmation = ({ isOpen, onOpenChange, title, handleSubmit, nagativeTitle, positiveTitle }: any) => {
  const isMobile = useIsMobile()
  if(isMobile) {
    return <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent className="px-5">
        <h1>{title}</h1>
      <DialogFooter className="flex flex-row gap-2 items-end justify-end">
      <Button variant="bordered" color="default" size="sm" className="w-fit" onClick={()=>onOpenChange()}>{nagativeTitle}</Button>
      <Button variant="shadow" color="danger" size="sm" className="w-fit" onClick={()=>handleSubmit()}>{positiveTitle}</Button>

      </DialogFooter>
      </DialogContent>
    </Dialog>
  };
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement='bottom'>
      <DrawerContent>
        <DrawerBody>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className='flex flex-col items-center justify-center gap-2'>
              <TriangleAlert className="mx-auto mb-4 h-14 w-14 text-yellow-900 animate-pulse" />
              {title}
            </DrawerHeader>
          </div>
        </DrawerBody>
        <DrawerFooter className={`flex flex-row justify-center gap-4 mx-auto`}>
          <Button variant='shadow' color='primary' onClick={onOpenChange}>
            {nagativeTitle}
          </Button>
          <Button variant='shadow' color='danger'
            
            onClick={() =>{
              console.log("KEY PRESS");
              handleSubmit()}
            }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
              >
            {positiveTitle}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CommonConfirmation