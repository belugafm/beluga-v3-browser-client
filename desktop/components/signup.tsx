import React, {
    useState,
    createContext,
    useContext,
    useCallback,
    useEffect,
} from "react"

const context = {
    name: "",
    password: "",
    confirmed_password: "",
    handleUpdateName: null,
    handleUpdatePassword: null,
    handleUpdateConfirmedPassword: null,
}
const SignupFormContext = createContext(context)

const Input = (props) => {
    return (
        <div className="input-component">
            <input {...props} />
            <style jsx>{`
                .input-component {
                }
            `}</style>
        </div>
    )
}

const TextInputName = () => {
    const { name, handleUpdateName } = useContext(SignupFormContext)
    return (
        <Input
            type="text"
            name="name"
            value={name}
            onChange={handleUpdateName}
        />
    )
}
const TextInputPassword = () => {
    const { password, handleUpdatePassword } = useContext(SignupFormContext)
    return (
        <Input
            type="password"
            name="password"
            value={password}
            onChange={handleUpdatePassword}
        />
    )
}
const TextInputConfirmedPassword = () => {
    const { confirmed_password, handleUpdateConfirmedPassword } = useContext(
        SignupFormContext
    )
    return (
        <Input
            type="password"
            name="confirmed_password"
            value={confirmed_password}
            onChange={handleUpdateConfirmedPassword}
        />
    )
}

export const SignupFormComponent = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmed_password, setConfirmedPassword] = useState("")
    const handleUpdateName = useCallback(
        (event) => {
            setName(event.target.value)
        },
        [name]
    )
    const handleUpdatePassword = useCallback(
        (event) => {
            setPassword(event.target.value)
        },
        [password]
    )
    const handleUpdateConfirmedPassword = useCallback(
        (event) => {
            setConfirmedPassword(event.target.value)
        },
        [confirmed_password]
    )
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        fetch("/api/v1/account/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                name,
                password,
                confirmed_password,
            }),
        })
            .then((response) => {
                const result = response.json()
                if (result.ok === true) {
                } else {
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <SignupFormContext.Provider
            value={{
                name,
                password,
                confirmed_password,
                handleUpdateName,
                handleUpdatePassword,
                handleUpdateConfirmedPassword,
            }}
        >
            <form method="POST" action="/signup" onSubmit={handleSubmit}>
                <TextInputName />
                <TextInputPassword />
                <TextInputConfirmedPassword />
                <button type="submit">登録する</button>
            </form>
        </SignupFormContext.Provider>
    )
}
