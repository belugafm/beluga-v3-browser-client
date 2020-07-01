import React, { createContext, useState, useContext, ReactType } from "react"

type GlobalTheme = {
    backgroundPrimaryColor: string
    backgroundSecondaryColor: string
    fontPrimaryColor: string
    fontSecondaryColor: string
    borderPrimaryColor: string
    errorMessageFontColor: string
    boxShadow: string
    transitionDuration: string
}

type UserTheme = {
    linkPrimaryColor: string
}

const defaultGlobalDarkTheme: GlobalTheme = {
    backgroundPrimaryColor: "#202020",
    backgroundSecondaryColor: "#2d2d2d",
    fontPrimaryColor: "#FFFFFF",
    fontSecondaryColor: "#717171",
    borderPrimaryColor: "#4c4c4c",
    errorMessageFontColor: "#DC162F",
    boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
    transitionDuration: "0.05s",
}

const defaultGlobalLightTheme: GlobalTheme = {
    backgroundPrimaryColor: "#f6f6f6",
    backgroundSecondaryColor: "#fefefe",
    fontPrimaryColor: "#222222",
    fontSecondaryColor: "#c5c5c5",
    borderPrimaryColor: "#efefef",
    errorMessageFontColor: "#DC162F",
    boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
    transitionDuration: "0.05s",
}

export const defaultUserTheme: UserTheme = {
    linkPrimaryColor: "",
}

const defaultGlobalThemes = {
    dark: defaultGlobalDarkTheme,
    light: defaultGlobalLightTheme,
    current: defaultGlobalLightTheme,
    setCurrentTheme: null,
}

type Themes = {
    global: {
        dark: GlobalTheme
        light: GlobalTheme
        current: GlobalTheme
        setCurrentTheme: (key: string) => any
    }
    user: UserTheme
}

const ThemeContext = createContext(null)

export const ThemeProvider = ({
    userTheme,
    defaultGlobalThemeName,
    children,
}) => {
    const [currentGlobalThemeName, setCurrentGlobalThemeName]: [
        string,
        (key: string) => any
    ] = useState(defaultGlobalThemeName)
    return (
        <ThemeContext.Provider
            value={{
                global: {
                    dark: defaultGlobalDarkTheme,
                    light: defaultGlobalLightTheme,
                    current: defaultGlobalThemes[currentGlobalThemeName],
                    setCurrentTheme: (key: string) => {
                        console.log("key", key)
                        if (key !== "dark" && key !== "light") {
                            return
                        }
                        setCurrentGlobalThemeName(key)
                    },
                },
                user: userTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): [Themes, (key: string) => any] => {
    const themes: Themes = useContext(ThemeContext)
    return [themes, themes.global.setCurrentTheme]
}
