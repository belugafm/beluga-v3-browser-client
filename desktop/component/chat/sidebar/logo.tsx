export const LogoSidebarComponent = () => {
    const emojiList = ["🥹", "🫠", "🫢", "🫡", "🫥", "🫤"]
    var emoji = emojiList[Math.floor(Math.random() * emojiList.length)]

    return (
        <>
            <div>{emoji}</div>
            <style jsx>{`
                div {
                    position: relative;
                    height: 80px;
                    margin-top: -24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    font-size: 20px;
                }
            `}</style>
        </>
    )
}
