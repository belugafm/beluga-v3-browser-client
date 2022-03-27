export const BlueButton = ({ type, children }) => {
    return (
        <>
            <button type={type}>{children}</button>
            <style jsx>{`
                button {
                    font-weight: 700;
                    width: 140px;
                    font-size: 16px;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 10px;
                    margin-right: 0;
                    padding: 0 16px;
                    cursor: pointer;
                    border: none;
                    border-radius: 50px;
                    height: 48px;
                    background-color: #2a85ff;
                    color: white;
                    transition: 0.3s;
                    outline: none;
                }
                button:hover {
                    background-color: #0069f6;
                }
            `}</style>
        </>
    )
}
