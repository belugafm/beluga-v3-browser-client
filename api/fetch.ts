import * as TypeCheck from "../lib/type_check"

import {
    ChannelGroupObjectT,
    ChannelObjectT,
    FileObjectT,
    MessageObjectT,
    UserObjectT,
} from "./object"

import config from "../config"

export class UnexpectedResponseError extends Error {
    constructor() {
        super()
        Object.setPrototypeOf(this, UnexpectedResponseError.prototype)
    }
}

export class ServerError extends Error {
    constructor() {
        super()
        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

interface ResponseInterface {
    hint?: string[]
    description?: string[]
    additional_message?: string
    argument?: string
    error_code: string
    ok: boolean
    channel?: ChannelObjectT
    channels?: ChannelObjectT[]
    channel_group?: ChannelGroupObjectT
    channel_groups?: ChannelGroupObjectT[]
    message?: MessageObjectT
    user?: UserObjectT
    messages?: MessageObjectT[]
    files?: FileObjectT[]
    authenticity_token?: string
    oauth_token?: string
    oauth_token_secret?: string
}

export class Response implements ResponseInterface {
    hint: string[]
    description: string[]
    additional_message?: string
    argument?: string
    error_code: string
    ok: boolean
    channel?: ChannelObjectT
    channels?: ChannelObjectT[]
    channel_group?: ChannelGroupObjectT
    channel_groups?: ChannelGroupObjectT[]
    message?: MessageObjectT
    user?: UserObjectT
    messages?: MessageObjectT[]
    files?: FileObjectT[]
    authenticityToken?: string
    oauthToken?: string
    oauthTokenSecret?: string
    constructor(response: ResponseInterface) {
        if (TypeCheck.isBoolean(response.ok) === false) {
            throw new UnexpectedResponseError()
        }
        if (response.ok === false) {
            if (TypeCheck.isArrayOrNull(response.hint) === false) {
                throw new UnexpectedResponseError()
            }
            if (TypeCheck.isArrayOrNull(response.description) === false) {
                throw new UnexpectedResponseError()
            }
            if (TypeCheck.isStringOrNull(response.additional_message) === false) {
                throw new UnexpectedResponseError()
            }
            if (TypeCheck.isStringOrNull(response.argument) === false) {
                throw new UnexpectedResponseError()
            }
            if (TypeCheck.isString(response.error_code) === false) {
                throw new UnexpectedResponseError()
            }
        }
        this.hint = response.hint ? response.hint : []
        this.description = response.description ? response.description : []
        this.additional_message = response.additional_message
        this.argument = response.argument
        this.error_code = response.error_code
        this.ok = response.ok

        if (response.channel_group) {
            this.channel_group = response.channel_group
        }
        if (response.channel_groups) {
            this.channel_groups = response.channel_groups
        }
        if (response.channel) {
            this.channel = response.channel
        }
        if (response.channels) {
            this.channels = response.channels
        }
        if (response.user) {
            this.user = response.user
        }
        if (response.messages) {
            this.messages = response.messages
        }
        if (response.message) {
            this.message = response.message
        }
        if (response.authenticity_token) {
            this.authenticityToken = response.authenticity_token
        }
        if (response.oauth_token) {
            this.oauthToken = response.oauth_token
        }
        if (response.oauth_token_secret) {
            this.oauthTokenSecret = response.oauth_token_secret
        }
        if (response.files) {
            this.files = response.files
        }
    }
    getErrorMessage() {
        const errorMessage = []
        this.description.forEach((line) => {
            errorMessage.push(line)
        })
        if (this.additional_message) {
            errorMessage.push(this.additional_message)
        }
        return errorMessage
    }
    getHint() {
        return this.hint
    }
    getErrorCode() {
        return this.error_code
    }
}

export const WebAPIUnavailableResponse: ResponseInterface = {
    description: ["サーバーに接続できませんでした"],
    hint: ["しばらく時間をおいてからアクセスしてください"],
    error_code: "webapi_not_available",
    ok: false,
}

export const WebAPIUnexpectedErrorResponse: ResponseInterface = {
    description: ["サーバーで問題が発生しました"],
    hint: ["管理者にお問い合わせください"],
    error_code: "webapi_unexpected_error",
    ok: false,
}

export function get(method_url: string, query: any): Promise<Response> {
    return new Promise((resolve, reject) => {
        const protocol = config.server.https ? "https" : "http"
        const params = new URLSearchParams(query)
        const endpointUrl = new URL(`${protocol}://${config.server.domain}/api/v1/${method_url}`)
        endpointUrl.search = params.toString()
        fetch(endpointUrl.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "X-From": location.href,
            },
        })
            .then(async (data) => {
                if (data.status !== 200) {
                    return reject(new ServerError())
                }
                try {
                    const response = new Response(await data.json())
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
            .catch((error) => {
                console.error(endpointUrl)
                console.error(error)
                reject(error)
            })
    })
}

export function post(method_url: string, body: object): Promise<Response> {
    return new Promise((resolve, reject) => {
        const protocol = config.server.https ? "https" : "http"
        const endpointUrl = `${protocol}://${config.server.domain}/api/v1/${method_url}`
        fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "X-From": location.href,
            },
            body: JSON.stringify(body),
        })
            .then(async (data) => {
                if (data.status !== 200) {
                    return reject(new ServerError())
                }
                try {
                    const response = new Response(await data.json())
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
            .catch((error) => {
                console.error(endpointUrl)
                console.error(error)
                reject(error)
            })
    })
}

export function postFormData(method_url: string, body: FormData): Promise<Response> {
    return new Promise((resolve, reject) => {
        const protocol = config.server.https ? "https" : "http"
        const endpointUrl = `${protocol}://${config.server.domain}/api/v1/${method_url}`
        fetch(endpointUrl, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-From": location.href,
            },
            body: body,
        })
            .then(async (data) => {
                if (data.status !== 200) {
                    return reject(new ServerError())
                }
                try {
                    const response = new Response(await data.json())
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
            .catch((error) => {
                console.error(endpointUrl)
                console.error(error)
                reject(error)
            })
    })
}