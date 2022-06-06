import '../styles/globals.css'
import {useAuthState} from "react-firebase-hooks/auth"
import { auth, db } from '../firebase'
import  Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil'
import Modal from '../components/Modal'

import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
function MyApp({ Component, pageProps }) {
  const [user,loading]=useAuthState(auth)

  useEffect(() => {
    if(user)
    {
      setDoc(doc(db,"users",user.uid),{
        email:user.email,
        lastSeen:serverTimestamp(), 
        photoURL:user.photoURL 
        
    },{merge:true})  
  } 
  
    
  }, [user])
  
  if (loading) {
    return <Loading/>
  }
  if(!user)
  {
    return <Login/>
  }
  return  <RecoilRoot>
  <Component {...pageProps} />
  </RecoilRoot>
  
}

export default MyApp
