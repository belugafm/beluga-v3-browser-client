export const Heading2Component = ({ children }) => {
    return (
        <>
            <h2>{children}</h2>
            <style jsx>{`
                h2 {
                    line-height: 1em;
                    font-size: 20px;
                    margin: 16px 0;
                    padding: 0;
                }
                h2:first-child {
                    margin-top: 0;
                }
                h2:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </>
    )
}
