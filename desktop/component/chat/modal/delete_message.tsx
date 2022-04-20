import React, { MouseEvent } from "react"

import { DeleteMessageModalActionT } from "../../../state/component/model/modal"
import { MessageObjectT } from "../../../api/object"
import classNames from "classnames"

export const DeleteMessageModalComponent = ({
    hidden,
    message,
    modalAction,
}: {
    hidden: boolean
    message: MessageObjectT
    modalAction: DeleteMessageModalActionT
}) => {
    console.info("DeleteMessageModalComponent::render")
    const handleClickBackgroun = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        modalAction.hide()
    }
    return (
        <>
            <div
                className={classNames("modal-container", {
                    hidden,
                })}
                onClick={handleClickBackgroun}>
                <div className="modal"></div>
            </div>
            <style jsx>{`
                .modal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(5px);
                    z-index: 100;
                    opacity: 1;
                    transition: 0.1s;
                    visibility: visible;
                }
                .modal-container.hidden {
                    visibility: none;
                    z-index: 0;
                    opacity: 0;
                }
                .modal {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </>
    )
}
