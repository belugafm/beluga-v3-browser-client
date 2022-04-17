import { TooltipStateT } from "../../state/component/tooltip"
import classNames from "classnames"

export const TooltipComponent = ({ state }: { state: TooltipStateT }) => {
    return (
        <div className={classNames("tooltip", { hidden: state.hidden })}>
            <div className="inner">
                <div className="tooltip-text">{state.text}</div>
            </div>
            <style jsx>{`
                .tooltip {
                    top: ${state.top}px;
                    left: ${state.left}px;
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
