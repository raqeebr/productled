import { Theme } from "../../theme/ThemeManager";
import { templateStore } from "./TemplateStore";

export abstract class BaseComponent extends HTMLElement {
    private readonly template: HTMLTemplateElement;

    constructor(
        protected readonly targetElement: HTMLElement,
        protected readonly config: any,
        protected readonly theme: Theme,
        attach?: boolean
    ) {
        super();

        this.template = templateStore.get(
            this.constructor.name,
            this.getTemplate.bind(this));

        this.attachShadow({ mode: 'open' })

        if (attach) {
            this.attach();
        }
    }

    connectedCallback() {
        this.render();
    }

    protected abstract getTemplate(): HTMLTemplateElement;
    protected abstract render(): void;

    attach(): void {
        const clonedNode = this.template.cloneNode(true) as HTMLElement;
        this.targetElement.appendChild(clonedNode);
    }
}