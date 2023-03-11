export const Heading1Component = ({ children }) => {
    return (
        <>
            <h1>{children}</h1>
            <style jsx>{`
                h1 {
                    line-height: 1em;
                    font-size: 26px;
                    margin: 16px 0;
                    padding: 0;
                }
                h1:first-child {
                    margin-top: 0;
                }
                h1:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </>
    )
}
