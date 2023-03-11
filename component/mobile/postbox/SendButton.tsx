import { ThemeT } from "../../Theme"
import classnames from "classnames"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            fill: "#1a1d1f",
            hoverFill: "#fff",
            backgroundColor: "#f4f4f4",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#787878",
            hoverFill: "#fff",
            backgroundColor: "#242424",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    throw new Error()
}

export const SendButtonComponent = ({
    theme,
    text,
    handlePostMessage,
}: {
    theme: ThemeT
    text: string
    handlePostMessage: () => Promise<void>
}) => {
    return (
        <div
            className={classnames("send-button-container", {
                ready: text.length > 0,
            })}>
            <button className="send-message-button normal">
                <svg className="icon">
                    <use href="#icon-editor-send-outline"></use>
                </svg>
            </button>
            <button className="send-message-button active" onTouchStart={handlePostMessage}>
                <svg className="icon">
                    <use href="#icon-editor-send-fill"></use>
                </svg>
            </button>
            <style jsx>{`
                .send-message-button {
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: 5px;
                    outline: none;
                    border: none;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    transition: 0.05s;
                    margin-right: 2px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 36px;
                }
                .send-message-button:last-child {
                    margin-right: 0;
                }
                .send-message-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .send-button-container {
                    position: relative;
                    width: 36px;
                }
                .send-button-container > .send-message-button.active {
                    opacity: 0;
                }
                .send-button-container.ready > .send-message-button.active {
                    opacity: 1;
                }
            `}</style>
            <style jsx>{`
                .send-message-button.normal {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .send-message-button.active {
                    background-color: ${getStyle(theme)["focusBackgroundColor"]};
                }
                .send-message-button.active:hover {
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .send-message-button.normal > .icon {
                    fill: ${getStyle(theme)["fill"]};
                }
                .send-message-button.active > .icon {
                    fill: ${getStyle(theme)["hoverFill"]};
                }
                .send-message-button.active:hover > .icon {
                    fill: ${getStyle(theme)["hoverFill"]};
                }
            `}</style>
        </div>
    )
}
