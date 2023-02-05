import { useContext } from "react"
import { DrawerActionContext } from "../../../state/component/drawer"

export const DrawerButton = () => {
    const action = useContext(DrawerActionContext)
    return (
        <>
            <button className="menu-button" onTouchStart={action.toggle}>
                <svg className="icon-nested-list">
                    <use href="#icon-nested-list"></use>
                </svg>
            </button>
            <style jsx>{`
                .icon-nested-list {
                    width: 20px;
                    height: 20px;
                }
                .menu-button {
                    border: none;
                    outline: none;
                    background: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                }
            `}</style>
        </>
    )
}
