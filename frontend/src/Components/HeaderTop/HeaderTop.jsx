import React, { useEffect, useState } from "react";
import "./HeaderTop.css";
import { TiTick } from "react-icons/ti";
import { BiRefresh, BiSave } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx"
import { BsCloudDownloadFill } from "react-icons/bs"
import Logo from "../../Assets/TalkieChatLogo.png";
import axios from "axios";
import { uid } from "uid";
import { db, storage } from "../../firebase";
import { set, ref, update, onValue} from "firebase/database";
import PdfLogo from "../../Assets/pdfLogo.png"
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const HeaderTop = () => {
  const [randomNumber, setrandomNumber] = useState();
  const [addChatID, setAddChatID] = useState(false);
  const [NoOfUser, setNoOfUser] = useState("Single");
  const [groupImage, setGroupImage] = useState();
  const [groupName, setGroupName] = useState();
  const [selectedFeature, setSelectedFeature] = useState(false);
  const [selectFiles, setSelectFiles] = useState(null);
  const [shareMethod, setShareMethod] = useState(true);
  // const [urlCollection, setUrlCollection] = useState([]);
  const [SharesFilesReceive, setShareFilesReceive] = useState([]);
  const navigate = useNavigate();
  const copyNumber = async () => {
    navigator.clipboard.writeText(randomNumber);
    alert("Chat ID Copied " + randomNumber);
    await axios
      .get("/home")
      .then((result) => {
        let obj;
        if (NoOfUser === "Single") {
          obj = {
            chatType: "Single",
          };
        } else {
          obj = {
            GroupName: groupName,
            chatType: "Group",
          };
        }
        if (groupImage) {
          const uuid = uid();
          const name = groupImage;
          const imageRef = storageRef(storage, `images/${name.name + uuid}`);
          let imageURL = "";
          uploadBytes(imageRef, name)
            .then((res) => {
              alert("Image Upload");
              return getDownloadURL(res.ref);
            })
            .then((url) => {
              console.log(url);
              imageURL = url;

              set(ref(db, `${randomNumber}`), {
                ChatID: randomNumber,
                GroupImage: imageURL,
                ...obj,
                Users: [
                  {
                    User_id: result.data._id,
                    User_Name: result.data.Name,
                    User_Avatar: result.data.Avatar,
                    User_AvatarBackground: result.data.AvatarBackground,
                  },
                ],
              });
            });
        } else {
          set(ref(db, `${randomNumber}`), {
            ChatID: randomNumber,
            ...obj,
            Users: [
              {
                User_id: result.data._id,
                User_Name: result.data.Name,
                User_Avatar: result.data.Avatar,
                User_AvatarBackground: result.data.AvatarBackground,
              },
            ],
          });
        }
        // }
      })
      .catch((err) => { });
  };

  const saveChatID = async () => {
    await axios
      .get("/home")
      .then(
        (result) => {
          let data;
          onValue(ref(db, `${randomNumber}`), (snapshot) => {
            data = snapshot.val();
          });
          let a = data.Users.find((user) => user.User_id === result.data._id);
          if (a == undefined) {
            if (data.chatType === "Group") {
              update(ref(db, `${randomNumber}`), {
                Users: [
                  ...data.Users,
                  {
                    User_id: result.data._id,
                    User_Name: result.data.Name,
                    User_Avatar: result.data.Avatar,
                    User_AvatarBackground: result.data.AvatarBackground,
                  },
                ],
              });
            }
            if (data.chatType === "Single" && data.Users.length === 2) {
              alert("User Already Connected to someone else");
            }
            if (data.chatType === "Single" && data.Users.length < 2) {
              update(ref(db, `${randomNumber}`), {
                Users: [
                  ...data.Users,
                  {
                    User_id: result.data._id,
                    User_Name: result.data.Name,
                    User_Avatar: result.data.Avatar,
                    User_AvatarBackground: result.data.AvatarBackground,
                  },
                ],
              });
            }
          } else {
            alert("You are Already in this Group");
          }
          randomNumGenerate();
        }
      )
      .catch((err) => { });
  };

  const randomNumGenerate = () => {
    const num = Math.floor(Math.random() * 10000000);
    setrandomNumber(num);
  };

  useEffect(() => {
    randomNumGenerate();
  }, []);

  useEffect(() => {
    setGroupName(`Group_${randomNumber}`.substring(0, 10));
  }, [randomNumber]);

  const removeFile = (curr) => {
    let a = selectFiles.filter(e => e.name !== curr.name)
    setSelectFiles(a)
  }

  const shareFiles = async () => {
    let images = selectFiles.filter(e => e.type.includes("image/"));
    let files = selectFiles.filter(e => !e.type.includes("image/"));

    // let Messages = [];
    const uuid = uid();
    let prevImage = []
    let prevDocuments = []

    await axios.get("/home").then((res) => {
      {
        images.map((curr) => {
          const imageRef = storageRef(storage, `Share_Files${randomNumber}/Images/${curr.name + uuid}`);
          let imageURL = "";
          uploadBytes(imageRef, curr)
            .then((res) => {
              return getDownloadURL(res.ref);
            })
            .then((url) => {
              console.log(url);
              imageURL = url;
              prevImage.push(url);
              set(ref(db, `${randomNumber}`), {
                ShareID: randomNumber,
                Image: [...prevImage],
                Document: [...prevDocuments]
              })
            });
        }
        )
      }
      {
        files?.map((curr) => {
          const filesRef = storageRef(storage, `Share_Files${randomNumber}/Documents/${curr.name + uuid}`);
          // let imageURL = "";
          uploadBytes(filesRef, curr)
            .then((res) => {
              return getDownloadURL(res.ref);
            })
            .then((url) => {
              prevDocuments.push({ DocUrl: url, DocName: curr.name });
            });
          set(ref(db, `${randomNumber}`), {
            ShareID: randomNumber,
            Image: [...prevImage],
            Document: [...prevDocuments]
          })
        }
        )
      }
    })
  }

  
  const fetchShareFiles = async () => {
    // onValue(ref(db,`${randomNumber}`)).then(snapshot => {
    //   console.log(snapshot.val())
    // })
    console.log(randomNumber);
    onValue(ref(db, `${randomNumber}`), (snapshot) => {
      let data = snapshot.val();
      console.log(data);
      setShareFilesReceive(data);
    });
  }

  return (
    <header className="headerText">
      <div id="talkieHeaderLogo" onClick={() => navigate("/")}>
        <img src={Logo} id="LogoTalkieChat" alt="talkieChatLOGO" />
        <h4> TalkieChat</h4>
      </div>
      <div id="generateChatID">
        <p>Generate Chat ID</p>
        <div id="chatId">
          <div id="selectFeature">
            <h6 style={!selectedFeature ? { borderBottom: "3px solid green" } : {}} onClick={() => setSelectedFeature(false)}>Generate Chat ID</h6>
            <h6 style={selectedFeature ? { borderBottom: "3px solid green" } : {}} onClick={() => setSelectedFeature(true)}>Share a File</h6>
          </div>
          {
            !selectedFeature ? <>
              {addChatID === true ? (
                <>
                  <p>Enter Chat ID here:</p>
                  <div id="randomNum">
                    <input
                      type="text"
                      id="chatID"
                      placeholder="Enter Chat Id..."
                      onChange={(e) => setrandomNumber(e.target.value)}
                    />
                    <div>
                      <TiTick id="copyLogo" onClick={saveChatID} />
                    </div>
                  </div>
                  <div id="noOfUser">
                    <p id="addChatID" onClick={() => setAddChatID(false)}>
                      Generate Chat ID
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p>Chat ID is</p>
                  <div id="randomNum">
                    <h3>{randomNumber}</h3>
                    <div>
                      <TiTick id="copyLogo" onClick={copyNumber} />
                      <BiRefresh id="copyLogo" onClick={randomNumGenerate} />
                    </div>
                  </div>
                  {NoOfUser === "Group" && (
                    <div id="groupForm">
                      <input
                        type="text"
                        placeholder="Enter Group Name or Automatically assigned"
                        name="GroupName"
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                      <input
                        type="file"
                        id="uploadImg"
                        name="GroupDP"
                        onChange={(e) => setGroupImage(e.target.files[0])}
                      />
                      <label htmlFor="uploadImg">Upload Group DP</label>
                    </div>
                  )}
                  <div id="noOfUser">
                    <input
                      type="radio"
                      id="Single"
                      name="codeFor"
                      defaultChecked
                      onChange={(e) => setNoOfUser(e.target.id)}
                    />
                    <label htmlFor="Single">Single</label>
                    <input
                      type="radio"
                      name="codeFor"
                      id="Group"
                      onChange={(e) => setNoOfUser(e.target.id)}
                    />
                    <label htmlFor="Group">Group</label>
                    <p id="addChatID" onClick={() => setAddChatID(true)}>
                      Add Chat ID
                    </p>
                  </div>
                  <span>
                    Share this Chat ID to your friend to stabilize connection
                  </span>
                </>
              )}</> :
              <>
                {
                  shareMethod ?
                    <>
                      <div id="ShareAFile">
                        <div id="shareMethod">
                          <pre>Share a File </pre>
                          <p onClick={() => setShareMethod(false)}>Receive</p>
                        </div>
                        <div id="inputSharedFiles">
                          <input type="file" id="ShareFile" onChange={(e) => setSelectFiles(Object.values(e.target.files))} multiple />
                          <label htmlFor="ShareFile">Select a File</label>
                        </div>
                        {
                          selectFiles?.map((curr) => {
                            // console.log(curr)
                            return (
                              <div id="allSelectedFiles">
                                <p>{curr.name}</p>
                                <RxCross2 id="logo" onClick={() => removeFile(curr)} />
                              </div>
                            )
                          })
                        }
                        {
                          selectFiles && <div>
                            <button onClick={shareFiles}>Share File</button>
                            <p>Share this Id: {randomNumber}</p>
                          </div>
                        }
                        <br />
                        <span>Sharing Files Available in Database only for 24 hours</span>
                      </div>

                    </> : <>
                      <div id="ShareAFile">
                        <div id="shareMethod">
                          <pre>Receive Files</pre>
                          <p onClick={() => setShareMethod(true)}>Send Files</p>
                        </div>
                        <p>Enter Share File ID here:</p>
                        <div id="randomNum">
                          <input
                            type="text"
                            id="chatID"
                            placeholder="Enter Chat Id..."
                            onChange={(e) => setrandomNumber(e.target.value)}
                          />
                          <div>
                            <TiTick id="copyLogo" onClick={fetchShareFiles} />
                          </div>
                        </div>
                        <br />
                        {
                          SharesFilesReceive?.Image?.length > 0 && <div id="fileType">
                            <p>Images</p>
                            <BsCloudDownloadFill id="logo" />
                          </div>
                        }
                        <div id="sharedFileRecieve">
                          {
                            SharesFilesReceive?.Image?.map((curr) => {
                              return (
                                <div id="sharedImageRecieve">
                                  <img src={curr} alt="SharedImage"/>

                                  <div id="downloadImgHover">
                                      <BsCloudDownloadFill id="logo"/>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                        {
                          SharesFilesReceive?.Image?.length > 0 && <div id="fileType">
                            <p>Documents</p>
                            <BsCloudDownloadFill id="logo" />
                          </div>
                        }
                        <div id="sharedFileRecieve">

                          {
                            SharesFilesReceive?.Document?.map((curr) => {
                              return (
                                <div id="sharedDocRecieve">
                                  <img src={PdfLogo} alt="SharedImage" width="25px" />
                                  <a href={curr.DocUrl} download={curr.DocUrl}>{curr.DocName}</a>
                                  <BsCloudDownloadFill id="logo" />
                                </div>
                              )
                            })
                          }
                        </div>
                        <span>Sharing Files Available in Database only for 24 hours</span>
                      </div>


                    </>
                }


              </>
          }
        </div>
      </div>
    </header>
  );
};

export default HeaderTop;


{/* <div id="ShareAFile">
  <pre>Share a File </pre>
  <input type="file" id="ShareFile" onChange={(e) => setSelectFiles(Object.values(e.target.files))} multiple />
  <label htmlFor="ShareFile">Select a File</label>
  {
    selectFiles?.map((curr) => {
      // console.log(curr)
      return (
        <div id="allSelectedFiles">
          <p>{curr.name}</p>
          <RxCross2 id="logo" onClick={() => removeFile(curr)} />
        </div>
      )
    })
  }
  {
    selectFiles && <div>
      <button onClick={shareFiles}>Share File</button>
      <p>Share this Id: {randomNumber}</p>
    </div>
  }
  <br />
  <span>Sharing Files Available in Database only for 24 hours</span>
</div> */}
