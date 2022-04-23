import React, { createContext, useContext, useState } from "react"

import Cookie from "cookie"

type GlobalTheme = {
    light: boolean
    dark: boolean
}

type UserTheme = {
    linkPrimaryColor: string
}

export const defaultGlobalDarkTheme: GlobalTheme = {
    light: false,
    dark: true,
}

export const defaultGlobalLightTheme: GlobalTheme = {
    light: true,
    dark: false,
}

export const defaultUserDarkTheme: UserTheme = {
    linkPrimaryColor: "#64b5f6",
}
export const defaultUserLightTheme: UserTheme = {
    linkPrimaryColor: "#477da7",
}

export const getDefaultUserTheme = (theme: string) => {
    if (theme === "dark") {
        return defaultUserDarkTheme
    }
    if (theme === "light") {
        return defaultUserLightTheme
    }
    throw new Error("`theme`が不正です")
}

const defaultGlobalThemes = {
    dark: defaultGlobalDarkTheme,
    light: defaultGlobalLightTheme,
    current: defaultGlobalLightTheme,
    setCurrentTheme: null,
}

export type Themes = {
    global: {
        dark: GlobalTheme
        light: GlobalTheme
        current: GlobalTheme
        setCurrentTheme: (key: string) => any
    }
    user: UserTheme
}

const ThemeContext = createContext(null)

export const ThemeProvider = ({ userTheme, defaultGlobalThemeName, children }) => {
    const [currentGlobalThemeName, setCurrentGlobalThemeName]: [string, (key: string) => any] =
        useState(defaultGlobalThemeName ? defaultGlobalThemeName : "light")
    return (
        <ThemeContext.Provider
            value={{
                global: {
                    dark: defaultGlobalDarkTheme,
                    light: defaultGlobalLightTheme,
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
