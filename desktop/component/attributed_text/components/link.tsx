type Props = {
    href: string
    hidden?: boolean
    onClick?: () => any
}

export default (props: Props) => {
    const { hidden, href, onClick } = props
    if (hidden) {
        return null
    }
    return (
        <>
            <a
                href={href}
                target="_blank"
                onClick={(event) => {
                    event.preventDefault()
                    onClick()
                }}>
                {href}
            </a>
            <style jsx>{`
                a {
                    line-height: 1.2em;
                    margin-bottom: 4px;
                    display: inline-block;
                    word-break: break-all;
                }
            `}</style>
        </>
    )
}
