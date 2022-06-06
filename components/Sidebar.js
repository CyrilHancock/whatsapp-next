import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import Modal from '../components/Modal'
import  ChatIcon  from "@material-ui/icons/Chat";
import  MoreVertIcon  from "@material-ui/icons/MoreVert";
import  SearchIcon  from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator"
import { auth, db } from "../firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore"
import Chat from "./Chat";
import { useRecoilState } from 'recoil'
import { usermodalState } from '../atoms/usermodalAtom'
import { useEffect, useState } from "react";
import NewChat from './NewChat'

 function Sidebar() {
  const [user,loading]=useAuthState(auth)

  const chatsRef = collection(db, "chats");
  const [chat,setChat]=useState([])
// Create a query against the collection.
const q = query(chatsRef, where("users","array-contains",user.email));
const [chatsSnapshot]=useCollection(q)


const [open,setOpen]=useRecoilState(usermodalState);


  async function createNewChat(){
    const input=prompt("Please enter an Email address for the user you wish to chat with")
  if(!input) return null;

  if(EmailValidator.validate(input)&&!chatAlreadyExist(input) &&input!=user.email){
    // We need to add chat in database
    const docRef=await addDoc(collection(db,"chats"),{
      users:[user.email,input],
      
  })
  }
  else
  {
    alert(`chat with ${input} already exist or invalid email`)
  }

}
const  chatAlreadyExist=(recipientEmail)=>!!chatsSnapshot?.docs.find(chat=>chat.data().users.find(user=>user===recipientEmail)?.length>0)

return (
<Container>
      <Header>
        <UserAvatar  src={user.photoURL} onClick={() => auth.signOut()}/>
        <IconsContainer>
            <IconButton>
           <ChatIcon/>  

            </IconButton>
            <IconButton>
           <MoreVertIcon/>
                
                </IconButton>
       
        </IconsContainer>
      </Header>
      <Search>
      <SearchIcon/>
        <SearchInput placeholder="Search in Chats"/>
        
      </Search>
    <SideBarButton onClick={()=>setOpen(true)}>
        START A NEW CHAT 
    </SideBarButton>
      {/* <ListofChat/> */}
     {chatsSnapshot?.docs.map(c=>(
     <Chat key={c.id} id={c.id} users={c.data().users}/>
     ))}       
      <NewChat/>

    </Container>
    
  );
}

export default Sidebar;

const Container = styled.div`
flex:0.45;
border-right:1px solid whitesmoke;
height:100vh;
min-width:300px;
max-width:350px;
overflow-y:scroll;
::-webkit-scrollbar{
  display: none;
}
-ms-overflow-style:none;
scrollbar-width:none;
`;
const Header = styled.div`
display:flex;
position:sticky;
top:0;
background-color:white;
z-index: 1;
justify-content: space-between;
align-items: center;
padding:15px ;
height: 80px;
border-bottom:1px  solid whitesmoke;
`
const UserAvatar=styled(Avatar)`
cursor: pointer;
:hover{
opacity:0.0;
}
`
const IconsContainer=styled.div`
`
const Search=styled.div`
display: flex;
align-items: center;
padding:20px;
border-radius:2px;


`
const SearchInput=styled.input`
outline-width: 0;
border: none;
flex:1;

`
const SideBarButton=styled(Button)`
width: 100% ;
&&&{

  border-top:1px solid whitesmoke;
  border-bottom:1px solid whitesmoke;
}

`