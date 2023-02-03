import { ThemeT } from "../../../theme"

import { MessageObjectT } from "../../../../../api/object"

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
                    padding: 12px 0 12px 0;
                }
                .title-container {
                    flex: 1 1 auto;
                    padding: 6px 10px;
                }
                .title {
                    font-weight: bold;
                    font-size: 16px;
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
