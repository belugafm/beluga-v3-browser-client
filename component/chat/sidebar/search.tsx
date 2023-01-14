import { Themes, useTheme } from "../../theme"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#e6e6e6",
            focusBackgroundColor: "#fff",
            focusBorderColor: "#2a85ff",
            fill: "#6f767d",
            color: "#000000",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(0,0,0,0.3)",
            focusBackgroundColor: "rgba(0,0,0,0.3)",
            focusBorderColor: "#2a85ff",
            fill: "#6f767d",
            color: "#ffffff",
        }
    }
    throw new Error()
}

export const SearchComponent = () => {
    const [theme] = useTheme()
    return (
        <>
            <form className="search" action="/search">
                <svg className="icon">
                    <use href="#icon-search"></use>
                </svg>
                <input type="text" name="text" placeholder="検索" />
            </form>
            <style jsx>{`
                .search {
                    height: 40px;
                    position: relative;
                    border-radius: 8px;
                    margin-bottom: 10px;
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
