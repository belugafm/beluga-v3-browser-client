import { useCallback, useEffect, useRef, useState } from "react"
import * as api from "../../api"
import { Response } from "../../api"

import Head from "next/head"
import { ThemeProvider } from "../../component/Theme"
import useSWR from "swr"
import { InputComponent } from "../../component/desktop/form/Input"
import { postFormData, UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/fetch"
import { ApplicationObjectT, UserObjectT } from "../../api/object"

const ProfileImageComponent = ({ bot }: { bot: UserObjectT }) => {
    const fileInputRef = useRef(null)
    const handleUploadMedia = async (e) => {
        const files = e.target.files
        if (files.length == 0) {
            alert("ファイルを選択してください")
            fileInputRef.current.value = ""
            return
        }
        const file = files[0]
        var formData = new FormData()
        formData.append("file", file)
        formData.append("user_id", String(bot.id))
        const result = await postFormData("account/update_profile_image", formData)
        if (result.file == null) {
            alert("問題が発生したためアップロードできませんでした")
            fileInputRef.current.value = ""
            return
        }
        alert("変更しました")
        fileInputRef.current.value = ""
    }
    return <input type="file" ref={fileInputRef} onChange={handleUploadMedia} multiple />
}

export default () => {
    const [name, setName] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [description, setDescription] = useState("")
    const [botUserId, setBotUserId] = useState(-1)
    const [appId, setAppId] = useState(-1)
    const [accessToken, setAccessToken] = useState("")
    const [accessTokenSecret, setAccessTokenSecret] = useState("")

    let apps: ApplicationObjectT[] = []
    let bots: UserObjectT[] = []

    useEffect(() => {
        if (apps.length > 0 && appId == -1) {
            setAppId(apps[0].id)
        }
    })

    const response1 = useSWR("/api/bot/list_bots", () => {
        return api.bot.listBots()
    })
    const response2 = useSWR("/api/app/list_apps", () => {
        return api.app.listApps()
    })
    if (response1.error) return <div>failed to load</div>
    if (!response1.data) return <div>loading...</div>
    bots = response1.data.bots

    if (response2.error) return <div>failed to load</div>
    if (!response2.data) return <div>loading...</div>
    apps = response2.data.apps

    const createBot = async () => {
        try {
            return await api.bot.create({
                name,
                displayName,
                description,
                appId,
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

        const response = await createBot()
        if (response.ok) {
            setName("")
            setDisplayName("")
            setDescription("")
            setAccessToken(response.accessToken)
            setAccessTokenSecret(response.accessTokenSecret)
            setBotUserId(response.user.id)
        }
    }

    const botDomList = []
    bots.forEach((bot, index) => {
        botDomList.push(
            <div className="container" key={index}>
                <div className="section">
                    <label>ユーザー名</label>
                    <p>{bot.name}</p>
                </div>
                <div className="section">
                    <label>名前</label>
                    <p>{bot.display_name}</p>
                </div>
                <div className="section">
                    <label>説明</label>
                    <p>{bot.description}</p>
                </div>
                <div className="section">
                    <label>プロフィール画像</label>
                    <p>
                        <ProfileImageComponent bot={bot} />
                    </p>
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

    const appSelectOptionList = []
    apps.forEach((app, index) => {
        appSelectOptionList.push(<option key={index}>{app.id}</option>)
    })

    return (
        <>
            <Head>
                <title>bot一覧</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={null}>
                <div className="apps">
                    <p>bot一覧</p>
                    {botDomList}
                </div>
                <form method="POST" action="" onSubmit={handleSubmit}>
                    <InputComponent
                        label="ユーザー名"
                        type="text"
                        name="name"
                        value={name}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputComponent
                        label="名前"
                        type="text"
                        name="display_name"
                        value={displayName}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setDisplayName(e.target.value)}
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
                    <select name="app_id" onChange={(e) => setAppId(Number(e.target.value))}>
                        {appSelectOptionList}
                    </select>
                    <div className="button-container">
                        <button type="submit">作成する</button>
                    </div>
                    <div>
                        <label>userId</label>
                        <p>{botUserId}</p>
                        <label>accessToken</label>
                        <p>{accessToken}</p>
                        <label>accessTokenSecret</label>
                        <p>{accessTokenSecret}</p>
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
