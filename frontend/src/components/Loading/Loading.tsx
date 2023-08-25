import LoddingGIF from "../../assets/Spinner (1).gif"
const Loading = () => {
  return (
    <div className='Loading'>
      <img src={LoddingGIF} alt="Loading_Image" />
      <div id="loading">
        <div id="loadingShow"></div>
      </div>
    </div>
  )
}

export default Loading