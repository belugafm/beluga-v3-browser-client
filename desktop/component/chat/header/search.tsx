import { Themes } from "../../theme"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            backgroundColor: "#f4f4f4",
            focusBackgroundColor: "#fff",
            focusBorderColor: "#2a85ff",
            fill: "#6f767d",
            color: "#aaa",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            backgroundColor: "#111315",
            focusBackgroundColor: "#111315",
            focusBorderColor: "#2a85ff",
            fill: "#6f767d",
            color: "#aaa",
        }
    }
    throw new Error()
}

export const SearchComponent = ({ theme }: { theme: Themes }) => {
    return (
        <>
            <div className="search">
                <svg className="icon">
                    <use href="#icon-search"></use>
                </svg>
                <input type="text" placeholder="検索" />
            </div>
            <style jsx>{`
                .search {
                    width: 300px;
                    height: 40px;
                    border-radius: 8px;
                    position: relative;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    margin-right: 12px;
                    flex-shrink: 0;
                    stroke-width: 0.5px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                    cursor: pointer;
                }
                input {
                    padding: 0 0 0 40px;
                    margin: 0;
                    height: 100%;
                    width: 100%;
                    border-radius: 8px;
                    box-sizing: border-box;
                    border: 2px solid transparent;
                    font-size: 15px;
                    transition: all 0.1s;
                    background-color: transparent;
                    outline: none;
                }
            `}</style>
            <style jsx>{`
                .search {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .icon {
                    fill: ${getStyle(theme)["fill"]};
                }
                input:focus {
                    background-color: ${getStyle(theme)["focusBackgroundColor"]};
                    border-color: ${getStyle(theme)["focusBorderColor"]};
                    color: ${getStyle(theme)["color"]};
                }
            `}</style>
        </>
    )
}
