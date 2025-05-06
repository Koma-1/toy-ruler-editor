import { EditorPlane } from "../core/EditorPlane";
import { CornerRulerAreaView } from "./CornerRulerAreaView";
import { EditorPlaneView } from "./EditorPlaneView";
import { RulerAreaView } from "./RulerAreaView";
import { EditorContext } from "./EditorContext";
import { ToolBar as ToolBarView } from "./ToolBarView";

export class EditorScreen {
    private editorPlaneView: EditorPlaneView;
    private rulerAreaView: RulerAreaView;
    private cornerRulerAreaView: CornerRulerAreaView;
    private toolBarView: ToolBarView;
    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane,
        private context: EditorContext,
    ) {
        this.context.setRenderCallback(() => {this.render();});
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const [
            editorPlaneContainer,
            hRulerAreaContainer,
            vRulerAreaContainer,
            cornerRulerAreaContainer,
            toolBarContainer,
        ] = this.createLayout();

        this.editorPlaneView = new EditorPlaneView(editorPlaneContainer, this.model, this.context);
        this.rulerAreaView = new RulerAreaView(
            hRulerAreaContainer,
            vRulerAreaContainer,
            model,
            this.context,
            () => this.render());
        this.cornerRulerAreaView = new CornerRulerAreaView(cornerRulerAreaContainer, this.model);
        this.toolBarView = new ToolBarView(toolBarContainer, this.model, this.context);

        this.setScreenSize(500, 500, 50);
        // this.context.setCanvasSize(800, 800);
    }

    private createLayout(): [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement] {
        const [
            editorPlaneContainer,
            hRulerAreaContainer,
            vRulerAreaContainer,
            cornerRulerAreaContainer,
            toolBarContainer
        ] = this.createContainers();

        this.setupScrollSync(editorPlaneContainer, hRulerAreaContainer, vRulerAreaContainer);


        const row1 = document.createElement("div");
        row1.setAttribute("id", "editorRow1");
        row1.appendChild(cornerRulerAreaContainer);
        row1.appendChild(vRulerAreaContainer);
        const row2 = document.createElement("div");
        row2.setAttribute("id", "editorRow2");
        row2.appendChild(hRulerAreaContainer);
        row2.appendChild(editorPlaneContainer);
        this.container.appendChild(row1);
        this.container.appendChild(row2);
        this.container.appendChild(toolBarContainer);
        return [
            editorPlaneContainer,
            hRulerAreaContainer,
            vRulerAreaContainer,
            cornerRulerAreaContainer,
            toolBarContainer,
        ];
    }

    private createContainers(): [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement] {
        const editorPlaneContainer = document.createElement("div");
        const hRulerAreaContainer = document.createElement("div");
        const vRulerAreaContainer = document.createElement("div");
        const cornerRulerAreaContainer = document.createElement("div");
        const toolBarContainer = document.createElement("div");
        editorPlaneContainer.setAttribute("id", "editorPlaneContainer");
        hRulerAreaContainer.setAttribute("id", "hRulerAreaContainer");
        vRulerAreaContainer.setAttribute("id", "vRulerAreaContainer");
        cornerRulerAreaContainer.setAttribute("id", "cornerRulerAreaContainer");
        editorPlaneContainer.style.display = "inline-block";
        hRulerAreaContainer.style.display = "inline-block";
        vRulerAreaContainer.style.display = "inline-block";
        cornerRulerAreaContainer.style.display = "inline-block";
        editorPlaneContainer.style.overflow = "scroll";
        hRulerAreaContainer.style.overflow = "hidden";
        vRulerAreaContainer.style.overflow = "hidden";
        cornerRulerAreaContainer.style.overflow = "hidden";
        return [editorPlaneContainer, hRulerAreaContainer, vRulerAreaContainer, cornerRulerAreaContainer, toolBarContainer];
    }

    public render() {
        this.editorPlaneView.render();
        this.rulerAreaView.render();
        this.cornerRulerAreaView.render();
        this.toolBarView.render();
    }

    private setupScrollSync(
        editor: HTMLDivElement,
        hRuler: HTMLDivElement,
        vRuler: HTMLDivElement
    ): void {
        editor.addEventListener("scroll", () => {
            vRuler.scrollLeft = editor.scrollLeft;
            hRuler.scrollTop = editor.scrollTop;
        });
    }

    private setScreenSize(width: number, height: number, rulerAreaWidth: number) {
        this.editorPlaneView.setScreenSize(width, height);
        this.rulerAreaView.setRulerAreaSize(width, height, rulerAreaWidth);
        this.cornerRulerAreaView.setScreenSize(rulerAreaWidth, rulerAreaWidth);
    }

}