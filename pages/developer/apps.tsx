import * as api from "../../api"
import { Response } from "../../api"

import Head from "next/head"
import { ThemeProvider } from "../../component/Theme"
import useSWR from "swr"
import { InputComponent } from "../../component/desktop/form/Input"
import { useState } from "react"
import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/fetch"

export default () => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [callbackUrl, setCallbackUrl] = useState("")
    const [read, setRead] = useState(true)
    const [write, setWrite] = useState(false)
    const [consumerKey, setConsumerKey] = useState("")
    const [consumerSecret, setConsumerSecret] = useState("")

    const { data, error } = useSWR("/api/app/list_apps", () => {
        return api.app.listApps()
    })
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    const createApp = async () => {
        try {
            return await api.app.create({
                name,
                description,
                callbackUrl,
                read,
                write,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new Response(WebAPIUnavailableResponse)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const response = await createApp()
        if (response.ok) {
            setName("")
            setDescription("")
            setCallbackUrl("")
            setConsumerKey(response.consumerKey)
            setConsumerSecret(response.consumerSecret)
        }
    }

    const appDomList = []
    data.apps.forEach((app, index) => {
        appDomList.push(
            <div className="container" key={index}>
                <div className="section">
                    <label>名前</label>
                    <p>{app.name}</p>
                </div>
                <div className="section">
                    <label>説明</label>
                    <p>{app.description}</p>
                </div>
                <div className="section">
                    <label>コールバックURL</label>
                    <p>{app.callback_url}</p>
                </div>
                <div className="section">
                    <label>token</label>
                    <p>{app.token}</p>
                </div>
                <div className="section">
                    <label>secret（今後これは表示されなくなります）</label>
                    <p>{app.secret}</p>
                </div>
                <style jsx>{`
                    .container {
                        margin: 10px;
                        border-bottom: 1px solid #333;
                        padding: 10px;
                    }
                    .section {
                        margin-bottom: 10px;
                    }
                    label {
                        font-size: 14px;
                        font-weight: bold;
                        padding: 0;
                        margin: 0;
                    }
                    p {
                        padding: 0;
                        margin: 0;
                    }
                `}</style>
            </div>
        )
    })
    return (
        <>
            <Head>
                <title>アプリケーション一覧</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={null}>
                <div className="apps">
                    <p>アプリケーション一覧</p>
                    {appDomList}
                </div>
                <form method="POST" action="" onSubmit={handleSubmit}>
                    <InputComponent
                        label="アプリケーション名"
                        type="text"
                        name="name"
                        value={name}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputComponent
                        label="アプリケーションの説明"
                        type="text"
                        name="description"
                        value={description}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <InputComponent
                        label="コールバックURL"
                        type="text"
                        name="callback_url"
                        value={callbackUrl}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setCallbackUrl(e.target.value)}
                    />
                    <div>
                        <input
                            type="checkbox"
                            checked={read}
                            onChange={(e) => setRead(e.target.checked)}
                        />
                        Read
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={write}
                            onChange={(e) => setWrite(e.target.checked)}
                        />
                        Write
                    </div>
                    <div className="button-container">
                        <button type="submit">作成する</button>
                    </div>
                    <div>
                        <label>consumerKey</label>
                        <p>{consumerKey}</p>
                        <label>consumerSecret</label>
                        <p>{consumerSecret}</p>
                    </div>
                    <style jsx>{`
                        .button-container {
                            text-align: right;
                            margin-top: 20px;
                        }
                        button {
                            font-family: "M PLUS 1", sans-serif;
                            font-weight: 700;
                            width: 140px;
                            font-size: 16px;
                            flex: 0 0 auto;
                            box-sizing: border-box;
                            margin: 10px;
                            margin-right: 0;
                            padding: 0 16px;
                            cursor: pointer;
                            border: 1px solid rgb(0, 0, 0);
                            border-radius: 50px;
                            height: 48px;
                            background-color: rgba(0, 0, 0, 0.9);
                            color: white;
                            transition: 0.3s;
                        }
                        button:hover {
                            transform: translateY(-3px);
                            background-color: rgb(50, 50, 50);
                        }
                        button:active {
                            background-color: rgb(90, 90, 90);
                        }
                    `}</style>
                </form>
            </ThemeProvider>
        </>
    )
}
