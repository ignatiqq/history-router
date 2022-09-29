import {
    IRouter, 
    RouteSubscriberType, 
    RouteHandler,
    IRouterArguments, 
    RouteHandlerParams, 
    RoutesStructure
} from "./types.Router";

    // TODO ADD FNS TO move page
    // TODO ADD STATE

class Router implements IRouter {

    public routes: RouteSubscriberType;
    static debug: boolean;
    static notFound: boolean;
    static rawPath = '*';
    private subscribed: boolean;

    constructor({debug = false}: IRouterArguments) {
        Router.debug = debug;
        Router.notFound = false;
        // ADD ALL ROUTER Fn OPTIONAL
        this.routes = {};
        this.subscribed = false;
    }

    debugLog(pathname: string) {
        console.log(`Fired ${pathname} pathname`);
    }

    subscribeAny(routes: RoutesStructure[]) {
        routes.forEach(item => {
            const {pathname, handler} = item;
            this.subscribe(pathname, handler);
        });
    }

    subscribe(pathname:string, handler: (params: RouteHandlerParams) => void) {
        if(this.routes && !this.routes[pathname]) {
            this.routes[pathname] = [];
            this.routes[pathname] = this.routes[pathname].filter(item => item !== handler);
        }
        this.routes[pathname] = [...this.routes[pathname], handler];

        return () => {
            if(this.routes[pathname].length <= 1) {
                return delete this.routes[pathname];
            }
            this.routes[pathname] = this.routes[pathname].filter(item => item !== handler);
        }
    }

    fireHandlers(params: Record<string, string>, pathname: string) {
        this.routes[pathname].forEach(callback => callback({
            params,
            pathname,
            url: window.location.href,
        }));
    }

    private parseRoute(pathname: string): {regexp: RegExp, parameterNames: string[]} {
        const parameterNames: string[] = [],
        expression = pathname.replaceAll(/([:*])(\w+)/g, (full, dots, name) => {
            console.log(pathname, name);
            parameterNames.push(name);
            return "([^/]+)";
          })
          .replace(/\*/g, '(?:.*)'),
        regexp = new RegExp(`${expression}(?:/$|$)`);
        return {
            parameterNames,
            regexp,
        }
    }

    private getPathnameParams(paramNames: string[], params: string[]): Record<string, string> {
        const parameters: Record<string, string> = {};
        paramNames.forEach((key, i) => {
            parameters[key] = params[i];
        })
        return parameters;
    }

    private checkPathnameAccordingAndFireHandlers(pathname: string) {
        let isCalled = false;
        Object.keys(this.routes).forEach((key) => {
            if(key === "*" || isCalled) return;

            const {parameterNames, regexp} = this.parseRoute(key);
            const isRouteMatchPathname = pathname.match(regexp);

            if(!isRouteMatchPathname) return;
            isCalled = true;

            if(Router.debug) {
                this.debugLog(pathname);
            }

            if(parameterNames.length > 0) {
                const parameters = this.getPathnameParams(parameterNames, isRouteMatchPathname.slice(1));
                this.routes[key].forEach(() => this.fireHandlers(parameters, key));
                return;
            } else {
                this.routes[key].forEach(() => this.fireHandlers({}, pathname));
            }
        });

        const handlersOfRawPath = this.routes[Router.rawPath];
        if(handlersOfRawPath?.length > 0 && !isCalled) {

            if(Router.debug) {
                this.debugLog(pathname);
            }

            this.routes[Router.rawPath].forEach(() => this.fireHandlers({}, Router.rawPath));
        }
    }

    private onLocationChange() {
        const pathname = window.location.pathname;
        this.checkPathnameAccordingAndFireHandlers(pathname);
    }

    public init() {
        // Fire handler via pathname on initialization;
        this.checkPathnameAccordingAndFireHandlers(window.location.pathname);
        // Check window.history access
        if(!Object.hasOwn(window, 'history')) {
            throw new Error("window.history is missing");
        }
        // add listener to popsate for fire handlers
        if(!this.subscribed) {
            this.subscribed = true;
            window.addEventListener("popstate", () => {this.onLocationChange()});
        }
        return this;
    }

    public destroy() {
        if(this.subscribed) {
            this.subscribed = false;
            window.removeEventListener("popstate", () => this.onLocationChange());
            this.routes = {};
        }
    }

}

export default Router;

// class RouterNavigation {
 

//     static goTo() {
        
//     }

//     static goBack() {

//     }

//     static goForward() {

//     }
// }