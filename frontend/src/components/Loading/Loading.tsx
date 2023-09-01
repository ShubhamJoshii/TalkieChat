
import { useContext, useEffect } from "react";
import LogoLight from "../../assets/TalkieChatLight.png";
import LogoDark from "../../assets/TalkieChatDark.png";
import { MainFunction, ThemeState } from "../../routes/App";
const Loading = () => {
  const { updateTheme }: any = useContext(MainFunction);
  const theme: any = useContext(ThemeState);
  useEffect(() => {
    updateTheme();
  }, [])
  return (
    <div className='Loading'>
      {
        theme ?
        <img src={LogoLight} alt="Loading_Image" />
        :
        <img src={LogoDark} alt="Loading_Image" />
      }
      <div id="loading">
        <div id="loadingShow"></div>
      </div>
    </div>
  )
}

export default Loading