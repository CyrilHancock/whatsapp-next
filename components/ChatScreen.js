import { Avatar, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import MoreVert from '@material-ui/icons/MoreVert'
import { AttachFile } from '@material-ui/icons'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, orderBy, setDoc,doc,addDoc, where, query } from 'firebase/firestore'
import Message from './Message'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtoms'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"    
import MicIcon from "@material-ui/icons/Mic"
import { serverTimestamp } from "firebase/firestore";
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from "timeago-react"

import { Dropdown } from 'react-bootstrap'
function ChatScreen({chat,messages}) {
  const inputEl = useRef(null);
  const [user]=useAuthState(auth)
  const router=useRouter();
  const endOfMessageRef=useRef();
  const [open,setOpen]=useRecoilState(modalState)
  const [messagesSnaphot]=useCollection(query(collection(db,`chats`,router.query.id,"messages"),orderBy("timestamp","asc")))
  const [recipientSnapshot]=useCollection(query(collection(db,"users"),where("email","==",getRecipientEmail(chat.users,user))))
  const showMessages=()=>{
   if(messagesSnaphot)
   {
    return messagesSnaphot.docs.map(message=>(
      <Message
      key={message.id}
      user={message.data().user}
      message={{
         ...message.data(),
         timestamp:message.data().timestamp?.toDate().getTime()
      }}/>

      
    ))
   }
   else
   {
   return JSON.parse(messages).map(message=>(
     <Message key={message.id} user={message.user} message={message}/>
   ))
  }
}
const scrollToBottom=()=>{
  endOfMessageRef.current.scrollIntoView({
    behavior:"smooth",
    block:"start",
  })
}

 async function sendMessage(e){
    e.preventDefault()

    await setDoc(doc(db, "users",user.uid),{
      lastSeen:serverTimestamp(),

    },{merge:true})
await  addDoc(collection(db,`chats`,router.query.id,"messages"),{
  timestamp:serverTimestamp(),
  message:inputEl.current.value,
  user:user.email,
  photoURL:user.photoURL
});

    inputEl.current.value=""
  scrollToBottom();
  }
  const recipient=recipientSnapshot?.docs?.[0]?.data()
  const recipentEmail=getRecipientEmail(chat.users,user)
  const [menu,setMenu]=useState(false);
  const onClick = () => setMenu(!menu);
  return (
    <Container>
      <Header>
      {recipient?(<Avatar  src={recipient?.photoURL}/>):(<Avatar>{recipentEmail[0]}</Avatar>)}
      <HeaderInformation>
        <h3 className='text-base'>
          {recipentEmail}
        </h3>
        {recipientSnapshot?(<p>Last active:{' '} {recipient?.lastSeen?.toDate()?(
          <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
        ):("Unavailable")}</p>):(<p>Loading Last Acttive</p>)}
        
      </HeaderInformation>
      <HeaderIcons>
      <IconButton>
        
        <AttachFile onClick={()=>setOpen(true)} />
        
      </IconButton>
      <IconButton>
      <Dropdown>
  <Dropdown.Toggle className='outline-0 border-0 focus:outline-0 active:border-0 active:shadow-none' >
  <MoreVert  className='text-gray-500 ' onClick={onClick}/>
  </Dropdown.Toggle>
  <Dropdown.Menu className={`bg-white top-0 border  text-black text-xl ${menu==true?"flex":"hidden"}`}>
    <Dropdown.Item onClick={() => auth.signOut()}>Logout</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>
     
      </IconButton>
      </HeaderIcons>
      </Header>
    <MessageContainer>
      {showMessages()}
      <EndOfMessage ref={endOfMessageRef}/>

      </MessageContainer>  
      <InputContainer>
      <InsertEmoticonIcon/>
      <Input ref={inputEl}/>     
      <button disabled={!inputEl} type='submit' hidden onClick={sendMessage}></button>
      <MicIcon/>
      </InputContainer>
    </Container>
  )
}

export default ChatScreen



const Container=styled.div`
`

const Header=styled.div`
display: flex;
position: sticky;
background-color: white ;
z-index:100;
top: 0;
padding:11px;
height:80px;
align-items: center;
border-bottom:1px solid whitesmoke;
`

const HeaderInformation=styled.div`
flex: 1;
margin-left:15px;
>h3{
  margin-bottom:3px;

}
>p{
  font-size: 14px;
  color: gray;

}
`

const HeaderIcons=styled.div`
 `
 const MessageContainer=styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh;



`
 const EndOfMessage=styled.div`
 margin-bottom: 50px;
 `

 const InputContainer=styled.form`
 display: flex;
 align-items: center;
 padding: 10px;
 position:sticky;
 bottom:0;
 background-color: white;
 z-index:100;

 `
 const Input=styled.input`
 flex:1;
 outline:0;
 border:none;
border-radius :10px;
background-color: whitesmoke;
padding:20px;
margin-left:15px;
margin-right: 15px;

 `