
import { Button } from '@material-ui/core'
import { OAuthProvider, signInWithPopup } from 'firebase/auth'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { auth,provider } from '../firebase'

function   Login() {
 function signIn(){
    signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log(result);
    // // Apple credential
    // const credential = OAuthProvider.credentialFromResult(result);
    // const accessToken = credential.accessToken;
    // const idToken = credential.idToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The credential that was used.
    // const credential = OAuthProvider.credentialFromError(error);

    // ...
  });
     
 }
    return (
    <Container>
        <Head>
            <title>
                Login
            </title>
        </Head>
        <LoginContainer>
            <Logo src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'/>
            <Button onClick={signIn} variant='outlined'>
            Sign in  with Google
            </Button>
        </LoginContainer>
    </Container>
  )
}
export default Login
const Container=styled.div`
display:grid;
place-items:center;
height: 100vh;
background-color:whitesmoke;

`
const LoginContainer=styled.div`
padding:100px;
display: flex;
flex-direction:column;
align-items: center;
background-color: white;
border-radius: 5px;
box-shadow:0px 4px 14px -3px rgba(0,0,0,0.78);
`

const Logo=styled.img`
height: 200px;
width: 200px;
margin-bottom: 50px;
`