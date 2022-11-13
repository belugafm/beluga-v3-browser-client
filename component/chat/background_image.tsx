import { Themes, useTheme } from "../theme"

export const BackgroundImageComponent = ({ children, url }) => {
    if (url == null) {
        return children
    }
    return (
        <>
            <div className="bg">
                <div className="blur">{children}</div>
            </div>
            <style jsx>{`
                .bg {
                    background-image: url(${url});
                }
            `}</style>
        </>
    )
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            // backgroundColor: "rgba(8, 8, 11, 0.9)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
        }
    }
    throw new Error()
}

export const BackgroundImageBackdropFilterComponent = ({ children, url }) => {
    if (url == null) {
        return children
    }
    const [theme] = useTheme()
    return (
        <>
            <div className="bg">
                <div className="blur">{children}</div>
            </div>
            <style jsx>{`
                .bg {
                    background-image: url(${url});
                }
                .blur {
                    backdrop-filter: blur(50px);
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
            `}</style>
        </>
    )
}
