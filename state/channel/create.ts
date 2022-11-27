import * as api from "../../api"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/fetch"
import { createContext, useState } from "react"
import { ChannelGroupObjectT } from "../../api/object"
import { TrustRank } from "../../api/trust_rank"

export const useCreateChannelFormState = (channelGroup: ChannelGroupObjectT) => {
    const [nameField, setNameField] = useState({
        errorMessage: [],
        hint: [],
        value: "",
    })
    const [minimumTrustRankField, setMinimumTrustRankField] = useState({
        errorMessage: [],
        hint: [],
        value: TrustRank.Visitor,
    })
    const [globalErrorMessageField, setGlobalErrorMessageField] = useState({
        errorMessage: [],
        hint: [],
    })

    const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameField({
            errorMessage: nameField.errorMessage,
            hint: nameField.hint,
            value: event.target.value,
        })
    }

    const handleUpdateMinimumTrustRank = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMinimumTrustRankField({
            errorMessage: nameField.errorMessage,
            hint: nameField.hint,
            value: event.target.value,
        })
    }

    const create = async () => {
        try {
            return await api.channel.create({
                name: nameField.value,
                parentChannelGroupId: channelGroup.id,
                minimumTrustRank: minimumTrustRankField.value,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new api.Response(WebAPIUnavailableResponse)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const response = await create()
        if (response.ok) {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            setMinimumTrustRankField({
                errorMessage: [],
                hint: [],
                value: minimumTrustRankField.value,
            })
            const channel = response.channel
            if (channel) {
                location.href = `/channel/${channel.unique_name}`
            }
        } else {
            handleError(response)
        }
    }

    const handleError = (response: api.Response) => {
        if (response.argument === "name") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            setMinimumTrustRankField({
                errorMessage: [],
                hint: [],
                value: minimumTrustRankField.value,
            })
            return
        }
        if (response.argument === "parent_id") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            setMinimumTrustRankField({
                errorMessage: [],
                hint: [],
                value: minimumTrustRankField.value,
            })
            return
        }
        if (response.argument === "minimum_trust_rank") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            setMinimumTrustRankField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: minimumTrustRankField.value,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setNameField({
            errorMessage: [],
            hint: [],
            value: nameField.value,
        })
        setMinimumTrustRankField({
            errorMessage: [],
            hint: [],
            value: minimumTrustRankField.value,
        })
        setGlobalErrorMessageField({
            errorMessage: response.getErrorMessage(),
            hint: response.getHint(),
        })
    }

    return {
        nameField,
        minimumTrustRankField,
        globalErrorMessageField,
        handleUpdateName,
        handleUpdateMinimumTrustRank,
        handleSubmit,
    }
}

const context = {
    nameField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    minimumTrustRankField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    globalErrorMessageField: {
        errorMessage: [],
        hint: [],
    },
    handleUpdateName: null,
    handleUpdateMinimumTrustRank: null,
}

export const CreateChannelFormContext = createContext(context)
