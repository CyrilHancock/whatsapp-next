import { Avatar } from '@material-ui/core'
import { collection, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail'

function Chat({id,users}) {
  const [user,loading]=useAuthState(auth)
  const chatsRef = collection(db, "users");
  const q = query(chatsRef, where("email","==",getRecipientEmail(users,user)));
  const [recipientSnapshot]=useCollection(q)
  const recipient=recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail=getRecipientEmail(users,user)
  const router=useRouter();
  function enterChat()
  {
    router.push(`/chats/${id}`)
  }
  return (
    <Container onClick={enterChat}>
      {recipient?(<UserAvatar src={recipient.photoURL}/>):(<UserAvatar>{recipientEmail[0]}</UserAvatar>)}
      
 <p> 
   {recipientEmail}
   </p>       
    </Container>
  )
}

export default Chat
const Container=styled.div`
display: flex;
align-items:center;
cursor: pointer;
padding: 15px;
word-break: break-word;
:hover{
  background-color:#e9eaeb;
}
`

const UserAvatar=styled(Avatar)`
margin:5px;
margin-right:15px;
`