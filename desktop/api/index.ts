import * as TypeCheck from "../lib/type_check"
import { resolve } from "path"

class UnexpectedResponseError extends Error {
    constructor() {
        super()
        Object.setPrototypeOf(this, UnexpectedResponseError.prototype)
    }
}

interface ResponseInterface {
    hint?: string[]
    description?: string[]
    additional_message?: string
    argument?: string
    error_code: string
    ok: boolean
}

export class Response implements ResponseInterface {
    hint: string[]
    description: string[]
    additional_message?: string
    argument?: string
    error_code: string
    ok: boolean
    constructor(response: ResponseInterface) {
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
        if (TypeCheck.isBoolean(response.ok) === false) {
            throw new UnexpectedResponseError()
        }
        this.hint = response.hint ? response.hint : []
        this.description = response.description ? response.description : []
        this.additional_message = response.additional_message
        this.argument = response.argument
        this.error_code = response.error_code
        this.ok = response.ok
    }
    getErrorMessage() {
        const error_message = []
        this.description.forEach((line) => {
            error_message.push(line)
        })
        if (this.additional_message) {
            error_message.push(this.additional_message)
        }
        return error_message
    }
    getHint() {
        return this.hint
    }
    getErrorCode() {
        return this.error_code
    }
}

export function post(method_url: string, body: object): Promise<Response> {
    return new Promise((resolve, reject) => {
        fetch(`/api/v1/${method_url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(body),
        })
            .then(async (data) => {
                try {
                    const response = new Response(await data.json())
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}
