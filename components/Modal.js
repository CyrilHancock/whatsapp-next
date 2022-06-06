import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtoms'
import { Dialog,Transition  } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import {auth, db,storage,getMetadata } from "../firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref,getDownloadURL,uploadString,listAll } from 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
const Modal = () => {
  const [user,loadingl]=useAuthState(auth)
  const router=useRouter();
    const [open,setOpen]=useRecoilState(modalState);
    const filePickerRef=useRef(null)
     const [selectedFile,setSelectedFile]=useState(null)
        const [loading,setLoading]=useState(false)
     function addImageToPost(e){
         const reader =new FileReader()
         if(e.target.files[0])
         {
             reader.readAsDataURL(e.target.files[0])
         }
         reader.onload=(readerEvent)=>{
             setSelectedFile(readerEvent.target.result)
         }

     }      
  async   function uploadPost()
     {
            if(loading) return ;

        setLoading(true)
        var current = new Date();
        const imageRef=ref(storage,`posts/${router.query.id}/${current}`);
            await uploadString(imageRef,selectedFile,"data_url").then(async snapshot=>{
                const downloadUrl=await getDownloadURL(imageRef);
                  const filetype=selectedFile.substring(0,20);
                  console.log(filetype)
                await addDoc(collection(db,`chats`,router.query.id,"messages"),{
                    timestamp:serverTimestamp(),
                    message:downloadUrl,
                    user:user.email,
                    photoURL:user.photoURL,
                    type:filetype,
                  });
            }) 
            setOpen(false)
            setLoading(false)
            setSelectedFile(null)
     }
     console.log(selectedFile);
return <Transition.Root show={open} as={Fragment} >
        <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
               <div className='flex  items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4  pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                       <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>                         
                    </Transition.Child>
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden="true">
                        &#0203;  
                    </span>
                    <Transition.Child 
                     as={Fragment} 
                     enter="ease-out duration-300"
                     enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                     enterTo="opacity-100 translate-y-0 sm:scale-100"
                     leave="ease-in duration-200"
                     leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                     leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                     >
                        <div className='inline-block align-bottom bg-white  rounded-lg px-4 pt-5 text-left overflow-hidden shadow-xl 
                        transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
                            <div>
                                {selectedFile?(<img src={selectedFile} className="w-full object-contain cursor-pointer" onClick={()=>setSelectedFile(null)} alt=''/>):( <div 
                                onClick={()=>filePickerRef.current.click()}
                                 className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 cursor-pointer'>
                                    <CameraIcon className='h-6 w-6 text-emerald-600 ' aria-hidden="true"/>

                                </div>)}
                               
                            <div>
                                <div className='mt-3 text-center sm:mt-5'>
                                    <Dialog.Title
                                    as='h3'
                                    className="text-lg leading-6 font-medium text-gray-900" >
                                           Upload a Photo 
                                    </Dialog.Title>
                                    <div>
                                        <input
                                        ref={filePickerRef}
                                        type="file"
                                        hidden
                                          onChange={addImageToPost}
                                        />
                                    </div>
                                 
                                </div>
                                </div>            



                                <div className='mt-5 sm:mt-6'>
                                    <button type='button'
                                    disabled={!selectedFile}
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base
                                     font-medium text-white hover:bg-emerald-700  focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-red-500 sm:text-sm  disabled:bg-gray-300  disabled:cursor-not-allowed hover:disabled:bg-gray-300  "
                                      onClick={uploadPost} 
                                    >
                                        {loading?"Uploading..." :"Upload Photo"}
                                        

                                    </button>

                                </div>
                            </div>
                            </div>    
                    </Transition.Child>
               </div>
        </Dialog>
  </Transition.Root>
    
  
}

export default Modal