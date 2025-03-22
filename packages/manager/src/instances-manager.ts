type ComponentInstance = {
    element: HTMLElement;
    instance: any;
};

type ComponentsRegistry = {
    [key: string]: ComponentInstance[];
};

declare global {
    interface Window {
        $flexillaInstances: ComponentsRegistry;
    }
}

export class InstancesManager {
    private static initGlobalRegistry() {
        if (!window.$flexillaInstances) {
            window.$flexillaInstances = {};
        }
    }

    static register(componentName: string, element: HTMLElement, instance: any) {
        this.initGlobalRegistry();
        
        if (!window.$flexillaInstances[componentName]) {
            window.$flexillaInstances[componentName] = [];
        }

        const existing = this.getInstance(componentName, element);
        if (existing) {
            return existing;
        }

        window.$flexillaInstances[componentName].push({ element, instance });
        return instance;
    }

    static getInstance(componentName: string, element: HTMLElement) {
        this.initGlobalRegistry();
        return window.$flexillaInstances[componentName]?.find(
            item => item.element === element
        )?.instance;
    }

    static removeInstance(componentName: string, element: HTMLElement) {
        this.initGlobalRegistry();
        if (!window.$flexillaInstances[componentName]) return;

        window.$flexillaInstances[componentName] = window.$flexillaInstances[componentName].filter(
            item => item.element !== element
        );
    }
}