
import Logo from "../../assets/TalkieChat.png";
const Loading = () => {
  return (
    <div className='Loading'>
      {/* <img src={LoddingGIF} alt="Loading_Image" /> */}
      <img src={Logo} alt="Loading_Image" />
      <div id="loading">
        <div id="loadingShow"></div>
      </div>
    </div>
  )
}

export default Loading