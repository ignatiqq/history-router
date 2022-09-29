export interface IRouter {
    routes: RouteSubscriberType;
    subscribe: (path: string, handler: RouteHandler) => () => void;
    init: () => void;
    destroy: () => void;
};

// constructor arguments

export interface IRouterArguments {
    debug: boolean;
}

// router params 

type RouterParams = Record<string, string>;

// callback types

export type RouteHandler = (params: RouteHandlerParams) => void;  

export interface RouteHandlerParams {
    params: RouterParams | null;
    pathname: string;
    url: string;
}

// route item type

export interface RouteSubscriberType {
    [key: string]: RouteHandler[];
}

export interface RoutesStructure {
    pathname: string;
    handler: RouteHandler;
}