const config: {
    server: {
        domain: string
        https: boolean
        get_base_url: () => string
    }
    websocket: {
        uri: string
    }
    site_name: string
    markdown: {
        code: string
        big: string
        inline_code: string
        italic: string
        underline: string
        bold: string
        strikethrough: string
    }
} = {
    server: {
        domain: "localhost.beluga.fm",
        https: false,
        get_base_url: () => {
            if (config.server.https) {
                return `https://${config.server.domain}`
            } else {
                return `http://${config.server.domain}`
            }
        },
    },
    websocket: {
        uri: "ws://localhost.beluga.fm:9001",
    },
    site_name: "Beluga",
    markdown: {
        code: "```",
        big: "++",
        inline_code: "`",
        italic: "*",
        underline: "__",
        bold: "**",
        strikethrough: "~~",
    },
}

export default config
