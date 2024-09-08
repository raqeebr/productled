import { type Plugin, Theme } from "@productled/core";
import { Tooltip } from "./Tooltip";

export type Position = "top" | "bottom" | "left" | "right";

export interface TooltipConfig {
    selector: string;
    text: string;
    position?: Position;
}

class TooltipsPlugin implements Plugin {
    private readonly key: string = "tooltips";
    private tooltips: Map<string, Tooltip> = new Map<string, Tooltip>();
    private configs!: TooltipConfig[];
    private theme!: Theme;
    private mutationObserver!: MutationObserver;

    constructor() {
        this.mutationObserver = new MutationObserver(this.handleDomMutations);
    }

    get Name(): string {
        return this.key;
    }

    initialize(configs: TooltipConfig[], theme: Theme) {
        this.configs = configs;
        this.theme = theme;
        this.attachEventListeners();
        this.observeDomMutations();
    }

    removeAll(): void {
        throw new Error("Method not implemented.");
    }

    private attachEventListeners(): void {
        document.body.addEventListener("mouseenter", this.handleMouseEnter);
        document.body.addEventListener("mouseleave", this.handleMouseLeave);
        window.addEventListener("resize", this.updateTooltipPositions);
        window.addEventListener("scroll", this.updateTooltipPositions);
    }

    private handleMouseEnter = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const tooltipConfig = this.findTooltipConfig(target);
        if (!tooltipConfig) {
            return;
        }

        this.initializeTooltip(tooltipConfig, target);
    }

    private handleMouseLeave = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const tooltipConfig = this.findTooltipConfig(target);

        if (tooltipConfig) {
            const tooltip = this.tooltips.get(tooltipConfig.selector);
            if (tooltip) {
                tooltip.hide();
            }
        }
    }

    private initializeTooltip(tooltipConfig: TooltipConfig, target: HTMLElement) {
        const tooltip = this.tooltips.get(tooltipConfig.selector);
        if (tooltip) {
            tooltip.show(target);
        } else {
            const newTooltip = new Tooltip(target, tooltipConfig, this.theme);
            this.tooltips.set(tooltipConfig.selector, newTooltip);
        }

    }

    private observeDomMutations() {
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    private handleDomMutations = (mutations: MutationRecord[]) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node instanceof HTMLElement) {
                    this.configs.forEach(config => {
                        if (node.matches(config.selector) || node.querySelector(config.selector)) {
                            this.initializeTooltip(config, node);
                        }
                    });
                }
            });
        });
    }

    private updateTooltipPositions = () => {
        this.tooltips.forEach((tooltip, selector) => {
            if (tooltip.style.display !== 'none') {
                const target = document.querySelector(selector) as HTMLElement;
                if (target) {
                    const config = this.findTooltipConfig(target);
                    if (config) {
                        tooltip.show(target);
                    }
                }
            }
        });
    }

    private findTooltipConfig(element: HTMLElement): TooltipConfig | undefined {
        return this.configs.find(c => element.matches(c.selector));
    }
}

export default TooltipsPlugin;