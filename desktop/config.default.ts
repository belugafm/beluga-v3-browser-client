const config: {
    server: {
        domain: string
        https: boolean
        getBaseUrl: () => string
    }
    websocket: {
        uri: string
    }
    siteName: string
    markdown: {
        code: string
        big: string
        inlineCode: string
        italic: string
        underline: string
        bold: string
        strikethrough: string
    }
} = {
    server: {
        domain: "localhost.beluga.fm",
        https: false,
        getBaseUrl: () => {
            if (config.server.https) {
                return `https://${config.server.domain}`
            } else {
                return `http://${config.server.domain}`
            }
        },
    },
    websocket: {
        uri: "ws://localhost.beluga.fm/ws/",
    },
    siteName: "Beluga",
    markdown: {
        code: "```",
        big: "++",
        inlineCode: "`",
        italic: "*",
        underline: "__",
        bold: "**",
        strikethrough: "~~",
    },
}

export default config
