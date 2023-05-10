import React from 'react'
import "./Loading.css"
import LoddingGIF from "../../Assets/Spinner (1).gif"
const Loading = () => {
  return (
    <div className='Loading'>
        <img src={LoddingGIF} alt="Loading_Image"/>
    </div>
  )
}

export default Loading