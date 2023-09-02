// import { useState } from "react";/
import { MdDarkMode } from "react-icons/md";
import { BsFillSunFill } from "react-icons/bs";
import Switch from "react-switch";
import { useContext, useEffect } from "react";
import { MainFunction, ThemeState } from "../../routes/App";
// import { useEffect } from "react";
const Theme = () => {
    const { updateTheme }: any = useContext(MainFunction);
    const theme: any = useContext(ThemeState);
    useEffect(() => {
        updateTheme();
    }, [])

    const handleChange = () => {
        window.localStorage.setItem('theme', JSON.stringify(theme === "Light" ? "Dark" : "Light"));
        updateTheme();
    }

    return (
        <div id="Theme">
            <Switch
                checked={theme === "Light"}
                onChange={handleChange}
                handleDiameter={28}
                offColor="#092e40"
                onColor="#fae9b1"
                offHandleColor="#25afee"
                onHandleColor="#f2c138"
                height={40}
                width={70}
                borderRadius={6}
                activeBoxShadow="0px 0px 1px 2px #fffc35"
                checkedIcon={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: 22,
                            color: "#25afee",
                            paddingRight: 2
                        }}
                    >
                        <MdDarkMode />
                    </div>
                }
                uncheckedIcon={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: 22,
                            color: "orange",
                            paddingRight: 2
                        }}
                    >
                        <BsFillSunFill />
                    </div>
                }

                checkedHandleIcon={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: 20,
                            color: "white"
                        }}
                    >
                        <BsFillSunFill />
                    </div>
                }
                uncheckedHandleIcon={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            color: "white",
                            fontSize: 18
                        }}
                    >
                        <MdDarkMode />
                    </div>
                }

                className="react-switch"
                id="small-radius-switch"
            />
        </div>
    )
}

export default Theme