import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { usermodalState } from '../atoms/usermodalAtom'
import { Dialog,Transition  } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import {auth, db,storage} from "../firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref,getDownloadURL,uploadString} from 'firebase/storage'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as EmailValidator from "email-validator"
import {  query,where } from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore"

const Modal = () => {

  
    const captionRef=useRef(null)
  
  
        const [user,loading]=useAuthState(auth)

        const chatsRef = collection(db, "chats");
        const [chat,setChat]=useState([])
      // Create a query against the collection.
      const q = query(chatsRef, where("users","array-contains",user.email));
      const [chatsSnapshot]=useCollection(q)
      
      
      const [open,setOpen]=useRecoilState(usermodalState);
      
      
        async function createNewChat(){
        if(!captionRef.current.value) return null;
      
        if(EmailValidator.validate(captionRef.current.value)&&!chatAlreadyExist(captionRef.current.value) &&captionRef.current.value!=user.email){
          // We need to add chat in database
          const docRef=await addDoc(collection(db,"chats"),{
            users:[user.email,captionRef.current.value],
            
        })
        }
        else
        {
          alert(`chat with ${captionRef.current.value} already exist or invalid email`)
        }
        setOpen(false);
      }
      const  chatAlreadyExist=(recipientEmail)=>!!chatsSnapshot?.docs.find(chat=>chat.data().users.find(user=>user===recipientEmail)?.length>0)
      
return <Transition.Root show={open} as={Fragment}>
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
                               
                               
                            <div>
                                <div className='mt-3 text-center sm:mt-5'>
                                  
                                    <div className='mt-2'>
                                        <input
                                        className='border-none focus:ring-0  w-full text-center '
                                        type="email"
                                        ref={captionRef}
                                        placeholder="Please enter a email" />

                                    </div>
                                </div>
                                </div>            



                                <div className='mt-5 sm:mt-6'>
                                    <button type='button'
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base
                                     font-medium text-white hover:bg-emerald-700  focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-red-500 sm:text-sm  disabled:bg-gray-300  disabled:cursor-not-allowed hover:disabled:bg-gray-300  "
                                      onClick={createNewChat} 
                                    >
                                        {loading?"Uploading..." :"Add new user to Chat"}
                                        

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