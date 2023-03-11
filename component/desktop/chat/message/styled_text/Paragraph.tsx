export const ParagraphComponent = ({ children }) => {
    return (
        <>
            <p>{children}</p>
            <style jsx>{`
                p {
                    line-height: 1.3em;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </>
    )
}
