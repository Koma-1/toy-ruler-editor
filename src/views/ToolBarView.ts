import { EditorInteractionContoroller } from "../controller/EditorInteractionController";
import { InsertRectState } from "../controller/InsertRectState";
import { EditorPlane } from "../core/EditorPlane";
import { EditorContext } from "./EditorContext";

export class ToolBar {
    constructor (
        private container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
        private controller: EditorInteractionContoroller
    ) {}

    render() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const zoomUp = document.createElement("button");
        this.container.appendChild(zoomUp);
        zoomUp.innerText = "Zoom Up";
        zoomUp.addEventListener("click", (e) => {
            this.context.setZoom(this.context.getZoom() + 0.1);
            this.context.requestRender();
        });
        const zoomReset = document.createElement("button");
        this.container.appendChild(zoomReset);
        zoomReset.innerText = "Zoom Reset";
        zoomReset.addEventListener("click", (e) => {
            this.context.resetZoom();
            this.context.requestRender();
        });
        const zoomDown = document.createElement("button");
        this.container.appendChild(zoomDown);
        zoomDown.innerText = "Zoom Down";
        zoomDown.addEventListener("click", (e) => {
            this.context.setZoom(this.context.getZoom() - 0.1);
            this.context.requestRender();
        });

        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", (e) => {
            this.controller.push({type: "cancel"});
        })
        this.container.appendChild(cancelButton);

        const addRectButton = document.createElement("button");
        addRectButton.innerText = "Add Rect";
        addRectButton.addEventListener("click", (e) => {
            this.controller.enter(new InsertRectState());
        })
        this.container.appendChild(addRectButton);

        const toglleSnapButton = document.createElement("button");
        toglleSnapButton.innerText = "Toggle Snap";
        toglleSnapButton.addEventListener("click", (e) => {
            this.context.pointPicker.toggleSnap();
        })
        this.container.appendChild(toglleSnapButton);
    }

}