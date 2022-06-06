import moment from 'moment'
import Image from 'next/image'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'

function Message({user,message}) {
  const [userLoggedIn,loading]=useAuthState(auth)
   const TypeOfMessage=user===userLoggedIn.email?Sender:Reciever; 
   const checkwhetherImage=(type,message)=>{
    if(type?.includes("image")){
      return ( <img onClick={()=>window.open(message, '_blank').focus()} onContextMenu={()=>alert("success")} className='w-100 h-60' src={message} alt="Sent Image"/>);
    }
    else if(type?.includes("application/pdf")){
      return (<object className='overscroll-none' width="100%" height="400" data={message} type="application/pdf">   </object>);
    }
    else
    {
      return message;
    }
   }
  return (
    <Container>
      <TypeOfMessage>
        {(checkwhetherImage(message.type,message.message))}
          <TimeStamp>
        {message.timestamp?moment(message.timestamp).format("LT"):"..."}

        </TimeStamp>
        </TypeOfMessage>    
    </Container>
  )
}

export default Message




const Container=styled.div`
`

const MessageElement=styled.p`
width:fit-content;
padding:15px;
border-radius:8px;
margin: 10px;
min-width:60px;
padding-bottom:26px;
position:relative;
text-align:right;
`
const Sender=styled(MessageElement)`
margin-left: auto;
background-color: #dcf8c6;
height:fit-content;

`
const Reciever=styled(MessageElement)`
background-color: whitesmoke;
text-align:left;
height:fit-content;
`
const TimeStamp=styled.span`
color: gray;
padding:10px;
font-size:9px;
position: absolute;
bottom:0;
text-align:right;
right:0 ;

`