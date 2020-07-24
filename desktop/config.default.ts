const config: {
    server: {
        domain: string
        https: boolean
    }
    websocket: {
        uri: string
    }
    site_name: string
} = {
    server: {
        domain: "localhost.beluga.fm",
        https: false,
    },
    websocket: {
        uri: "ws://localhost.beluga.fm:9001",
    },
    site_name: "Beluga",
}

export default config
