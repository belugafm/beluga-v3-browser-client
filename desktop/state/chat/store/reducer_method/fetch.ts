import { copyChannel, copyMessage, copyUser, copyDomainData } from "../domain_data/copy"
import { addMessage, addChannel, addUser } from "../domain_data/add"
import { DomainDataT } from "../types/domain_data"
import { Response } from "../../../../api"

export async function fetch<T>(
    prevDomainData: DomainDataT,
    method: (query: T) => Promise<Response>,
    query: T
): Promise<[DomainDataT, Response]> {
    try {
        const response = await method(query)
        let nextDomainData = copyDomainData(prevDomainData)
        if (response.message) {
            nextDomainData = addMessage(copyMessage(response.message), nextDomainData)
        }
        if (response.user) {
            nextDomainData = addUser(copyUser(response.user), nextDomainData)
        }
        if (response.messages) {
            response.messages.forEach((message) => {
                nextDomainData = addMessage(copyMessage(message), nextDomainData)
            })
        }
        if (response.channel) {
            nextDomainData = addChannel(copyChannel(response.channel), nextDomainData)
        }
        if (response.channels) {
            response.channels.forEach((channel) => {
                nextDomainData = addChannel(copyChannel(channel), nextDomainData)
            })
        }

        return [nextDomainData, response]
    } catch (error) {}
    return [prevDomainData, null]
}
