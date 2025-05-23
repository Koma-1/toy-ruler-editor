import { EditorInteractionController } from "../controller/EditorInteractionController";
import { InsertRectState } from "../controller/InsertRectState";
import { EditorPlane } from "../core/EditorPlane";
import { SvgSerializer } from "../svg/SvgSerializer";
import { EditorContext } from "./EditorContext";

export class ToolBar {
    private container: HTMLDivElement;
    private container_container: HTMLDivElement;
    constructor (
        container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
        private controller: EditorInteractionController
    ) {
        this.container_container = container;
        this.container_container.style.verticalAlign = "top";
        this.container = document.createElement("div");
        this.container_container.appendChild(this.container);
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
    }

    render() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const widthDiv = document.createElement("div");
        this.container.appendChild(widthDiv);
        const widthBox = document.createElement("input");
        widthBox.setAttribute("type", "number");
        widthBox.setAttribute("min", "0");
        widthBox.value = String(this.model.getWidth());
        widthBox.addEventListener("input", (e) => {
            this.model.setWidth(Number(widthBox.value));
            this.context.requestRender("only-EditorPlaneView");
        });
        widthDiv.innerText = "width:"
        widthDiv.appendChild(widthBox);

        const heightDiv = document.createElement("div");
        this.container.appendChild(heightDiv);
        const heightBox = document.createElement("input");
        heightBox.setAttribute("type", "number");
        heightBox.setAttribute("min", "0");
        heightBox.value = String(this.model.getHeight());
        heightBox.addEventListener("input", (e) => {
            this.model.setHeight(Number(heightBox.value));
            this.context.requestRender("only-EditorPlaneView");
        });
        heightDiv.innerText = "height:"
        heightDiv.appendChild(heightBox);


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

        const selectRectButton = document.createElement("button");
        selectRectButton.innerText = "Select Rect";

        const toggleSnapButton = document.createElement("button");
        toggleSnapButton.innerText = "Toggle Snap";
        toggleSnapButton.addEventListener("click", (e) => {
            this.context.pointPicker.toggleSnap();
        })
        this.container.appendChild(toggleSnapButton);

        const selectColor = document.createElement("input");
        selectColor.setAttribute("type", "color");
        this.container.appendChild(selectColor);
        if (this.controller.getSelectedIds().length !== 0) {
            const fill = this.model.getElement(this.controller.getSelectedIds()[0])?.graphicsAttributes.get("fill");
            if (fill === undefined) {
            } else {
                selectColor.value = fill;
            }
        }
        selectColor.addEventListener("input", (e) => {
            this.controller.push({type: "command", command: "fillColor", color: selectColor.value});
        });

        const removeSelectedRectButton = document.createElement("button");
        removeSelectedRectButton.innerText = "Remove";
        removeSelectedRectButton.addEventListener("click", (e) => {
            this.controller.push({type: "command", command: "remove"});
        })
        this.container.appendChild(removeSelectedRectButton);

        const exportButton = document.createElement("button");
        exportButton.innerText = "Export SVG";
        exportButton.addEventListener("click", (e) => {
            const svgText = new SvgSerializer(this.model).serialize()
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const a = document.createElement('a');
            a.href = svgUrl;
            a.download = "out.svg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(svgUrl);
        });
        this.container.appendChild(exportButton);
    }

}