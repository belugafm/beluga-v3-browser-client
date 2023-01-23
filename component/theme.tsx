import React, { createContext, useContext, useState } from "react"

import Cookie from "cookie"
import config from "../config"

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
}

export type ThemeT = {
    global: {
        current: GlobalTheme
        setCurrentTheme: (value: string) => any
    }
    user: UserTheme
}

const ThemeContext = createContext<ThemeT>(null)

export const ThemeProvider = ({ userTheme, defaultGlobalThemeName, children }) => {
    const [currentGlobalThemeName, setCurrentGlobalThemeName]: [string, (value: string) => any] =
        useState(defaultGlobalThemeName ? defaultGlobalThemeName : "light")
    return (
        <ThemeContext.Provider
            value={{
                global: {
                    current: defaultGlobalThemes[currentGlobalThemeName],
                    setCurrentTheme: (value: string) => {
                        if (value !== "dark" && value !== "light") {
                            return
                        }
                        document.cookie = Cookie.serialize("theme", value, {
                            expires: new Date(Date.now() + 86400 * 180),
                            path: "/",
                            domain: config.server.domain,
                        })
                        setCurrentGlobalThemeName(value)
                    },
                },
                user: userTheme ? userTheme : getDefaultUserTheme(currentGlobalThemeName),
            }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): [ThemeT, (value: string) => any] => {
    const themes: ThemeT = useContext(ThemeContext)
    return [themes, themes.global.setCurrentTheme]
}
