import { Theme, BaseComponent, customElement } from "@productled/core";
import { TooltipConfig } from "./TooltipsPlugin";

@customElement("productled-tooltip")
export class Tooltip extends BaseComponent {
    constructor(
        protected readonly targetElement: HTMLElement,
        protected readonly config: TooltipConfig,
        protected readonly theme: Theme) {
        super(targetElement, config, theme, true);
    }

    show(target: HTMLElement) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.getBoundingClientRect();

        let left, top;

        switch (this.config.position) {
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - 5;
                break;
            case 'left':
                left = rect.left - tooltipRect.width - 5;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                left = rect.right + 5;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            default: // bottom
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + 5;
        }

        // Adjust if tooltip would overflow viewport
        left = Math.max(0, Math.min(left, window.innerWidth - tooltipRect.width));
        top = Math.max(0, Math.min(top, window.innerHeight - tooltipRect.height));

        this.style.left = `${left}px`;
        this.style.top = `${top}px`;
        this.style.display = 'block';
    }

    hide(): void {
        this.style.display = "none";
    }

    protected render(): void {
        const pre = this.querySelector(".tooltip-content");
        if (pre) {
            pre.textContent = this.config.text;
        }

        // TODO: Add aria-describedBy on the target element 
        // with a unique id for the tooltip

    }

    protected getTemplate(): HTMLTemplateElement {
        const template = document.createElement('template');

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.setAttribute('role', 'tooltip');

        const content = document.createElement('pre');
        content.className = 'tooltip-content';

        tooltip.appendChild(content);
        template.content.appendChild(tooltip);

        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: relative;
                display: inline-block;
            }
                
            .tooltip {
                position: absolute;
                display: none;
                background-color: #333;
                color: white;
                padding: 5px;
                border-radius: 3px;
            }
        `;
        template.content.appendChild(style);

        return template;
    }
}