import React, { createContext, useContext, useState } from "react"

import Cookie from "cookie"

type GlobalTheme = {
    light: boolean
    lightWithBgImage: boolean
    dark: boolean
    darkWithBgImage: boolean
}

type UserTheme = {
    linkPrimaryColor: string
}

export const defaultGlobalDarkTheme: GlobalTheme = {
    light: false,
    lightWithBgImage: false,
    dark: true,
    darkWithBgImage: false,
}
export const defaultGlobalDarkWithBgImageTheme: GlobalTheme = {
    light: false,
    lightWithBgImage: false,
    dark: false,
    darkWithBgImage: true,
}
export const defaultGlobalLightTheme: GlobalTheme = {
    light: true,
    lightWithBgImage: false,
    dark: false,
    darkWithBgImage: false,
}
export const defaultGlobalLightWithBgImageTheme: GlobalTheme = {
    light: false,
    lightWithBgImage: true,
    dark: false,
    darkWithBgImage: false,
}

export const defaultUserDarkTheme: UserTheme = {
    linkPrimaryColor: "#64b5f6",
}
export const defaultUserDarkWithBgImageTheme: UserTheme = {
    linkPrimaryColor: "#64b5f6",
}
export const defaultUserLightTheme: UserTheme = {
    linkPrimaryColor: "#477da7",
}
export const defaultUserLightWithBgImageTheme: UserTheme = {
    linkPrimaryColor: "#477da7",
}

export const getDefaultUserTheme = (theme: string) => {
    if (theme === "dark") {
        return defaultUserDarkTheme
    }
    if (theme === "dark_bg") {
        return defaultUserDarkWithBgImageTheme
    }
    if (theme === "light") {
        return defaultUserLightTheme
    }
    if (theme === "light_bg") {
        return defaultUserLightWithBgImageTheme
    }
    throw new Error("`theme`が不正です")
}

const defaultGlobalThemes = {
    dark: defaultGlobalDarkTheme,
    dark_bg: defaultGlobalDarkWithBgImageTheme,
    light: defaultGlobalLightTheme,
    light_bg: defaultGlobalLightWithBgImageTheme,
}

export type Themes = {
    global: {
        current: GlobalTheme
        setCurrentTheme: (key: string) => any
    }
    user: UserTheme
}

const ThemeContext = createContext<Themes>(null)

export const ThemeProvider = ({ userTheme, defaultGlobalThemeName, children }) => {
    const [currentGlobalThemeName, setCurrentGlobalThemeName]: [string, (key: string) => any] =
        useState(defaultGlobalThemeName ? defaultGlobalThemeName : "light")
    return (
        <ThemeContext.Provider
            value={{
                global: {
                    current: defaultGlobalThemes[currentGlobalThemeName],
                    setCurrentTheme: (key: string) => {
                        if (key !== "dark" && key !== "light") {
                            return
                        }
                        document.cookie = Cookie.serialize("theme", key, {
                            expires: new Date(Date.now() + 86400 * 180),
                            path: "/",
                            domain: location.host,
                        })
                        setCurrentGlobalThemeName(key)
                    },
                },
                user: userTheme ? userTheme : getDefaultUserTheme(currentGlobalThemeName),
            }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): [Themes, (key: string) => any] => {
    const themes: Themes = useContext(ThemeContext)
    return [themes, themes.global.setCurrentTheme]
}
