export const Button = ({ onClick, children, className }) => {
    return (
        <>
            <button className={className} onClick={onClick}>
                {children}
            </button>
            <style jsx>{`
                .black {
                    background-color: rgba(255, 255, 255, 0.9);
                    color: #0a051e;
                }
                .white {
                    background-color: transparent;
                    background-color: rgba(10, 5, 30, 0.8);
                    color: white;
                }
                button {
                    font-weight: 700;
                    width: 220px;
                    font-size: 16px;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 10px;
                    padding: 0 20px;
                    cursor: pointer;
                    border: 1px solid white;
                    border-radius: 30px;
                    height: 50px;
                    backdrop-filter: blur(30px) saturate(120%);
                    transition: 0.3s;
                }
                button:hover {
                    transform: translateY(-3px);
                }
            `}</style>
        </>
    )
}
