import { Circle } from 'better-react-spinkit'
import FadingCircle from 'better-react-spinkit/dist/FadingCircle'
import React from 'react'

function Loading() {
  return (
    <center style={{display:"grid",placeItems:"center",height:"100vh"}}><div>
        <img src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' alt='whatsapp'
        height={200}
        width={200}
        style={{marginBottom:10}}/>
        <FadingCircle color="#3CBC2B" size={60}/>
        </div></center>
  )
}

export default Loading