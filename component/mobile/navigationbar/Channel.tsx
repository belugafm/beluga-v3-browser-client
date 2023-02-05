import { ChannelObjectT } from "../../../api/object"
import { ThemeT, useTheme } from "../../theme"
import { DrawerButton } from "./DrawerButton"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgb(247,247,247)",
            color: "#6f767d",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgb(16,16,16)",
            color: "#6f767d",
        }
    }
    throw new Error()
}
export const ChannelNavigationbarComponent = ({ channel }: { channel: ChannelObjectT }) => {
    const [theme, setTheme] = useTheme()
    return (
        <div className="header">
            <div className="menu-button-area">
                <DrawerButton />
            </div>
            <div className="channel-name-area">
                <span className="status">{channel.status_string}</span>
                <span className="name">{channel.name}</span>
            </div>
            <style jsx>{`
                .header {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    box-sizing: border-box;
                    box-sizing: border-box;
                    height: 100%;
                }
                .channel-name-area {
                    box-sizing: border-box;
                    padding: 6px 0;
                    border-radius: 6px;
                    flex: 0 1 auto;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    transition: 0.05s;
                    font-size: 16px;
                    height: 100%;
                }
                .channel-name-area {
                    flex: 1 1 auto;
                }
                .status {
                    margin-right: 6px;
                }
                .menu-button-area {
                    width: 50px;
                    height: 50px;
                    margin-right: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}
