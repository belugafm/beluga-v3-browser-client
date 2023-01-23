import { ThemeT } from "../../../theme"

import { MessageObjectT } from "../../../../api/object"

export const ThreadHeaderComponent = ({
    message,
    theme,
}: {
    message: MessageObjectT
    theme: ThemeT
}) => {
    const getStyle = (theme: ThemeT) => {
        if (theme.global.current.light) {
            return {
                color: "#000",
            }
        }
        if (theme.global.current.dark) {
            return {
                color: "#fff",
            }
        }
        throw new Error()
    }
    return (
        <div className="header">
            <div className="title-container">
                <span className="title">スレッド</span>
            </div>
            <style jsx>{`
                .header {
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    padding: 20px 20px 20px 10px;
                }
                .title-container {
                    flex: 1 1 auto;
                }
                .title {
                    font-size: 20px;
                    font-weight: bold;
                }
            `}</style>
            <style jsx>{`
                .header {
                    color: ${getStyle(theme)["color"]};
                }
            `}</style>
        </div>
    )
}
