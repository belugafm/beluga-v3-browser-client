import { ThemeT } from "../../../../theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#6f767d",
            hoverColor: "#1a1d1f",
            backgroundColor: "#fafafa",
            hoverBackgroundColor: "#efefef",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#616d78",
            hoverColor: "#fcfcfc",
            backgroundColor: "#0d0e10",
            hoverBackgroundColor: "#1f2327",
        }
    }
    throw new Error()
}

export function Select({ onChange, className, options, value, theme }) {
    return (
        <>
            <select className={className} onChange={onChange} value={value}>
                <option hidden={true} value="" />
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <style jsx>{`
                select {
                    border: 0;
                    display: flex;
                    background: none;
                    border-radius: 10px;
                    padding: 8px;
                    padding-left: 12px;
                    vertical-align: middle;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    font-size: 14px;
                    text-overflow: ellipsis;
                    text-transform: capitalize;
                    width: 130px;
                    outline: none;
                    cursor: pointer;
                }
            `}</style>
            <style jsx>{`
                select {
                    color: ${getStyle(theme)["color"]};
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                select:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}
