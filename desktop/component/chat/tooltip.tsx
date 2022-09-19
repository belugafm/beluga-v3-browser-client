import { TooltipStateT } from "../../state/component/tooltip"
import classnames from "classnames"

export const TooltipComponent = (props: TooltipStateT) => {
    const { hidden, text, top, left } = props
    return (
        <div className={classnames("tooltip", { hidden: hidden })}>
            <div className="inner">
                <div className="tooltip-text">{text}</div>
            </div>
            <style jsx>{`
                .tooltip {
                    top: ${top}px;
                    left: ${left}px;
                }
            `}</style>
            <style jsx>{`
                .tooltip.hidden {
                    display: none;
                }
                .tooltip-text {
                }
                .tooltip {
                    position: fixed;
                    width: 300px;
                    z-index: 10;
                    text-align: center;
                }
                .tooltip > .inner {
                    display: inline-block;
                    padding: 6px 10px;
                    font-size: 13px;
                    line-height: 1.6em;
                    border-radius: 8px;
                    font-weight: 500;
                    background-color: black;
                    color: white;
                }
                .tooltip:before {
                    content: "";
                    position: absolute;
                    background-color: black;
                    transform: rotate(45deg);
                    bottom: -4px;
                    left: calc(50% - 5px);
                    width: 10px;
                    height: 10px;
                }
            `}</style>
        </div>
    )
}
