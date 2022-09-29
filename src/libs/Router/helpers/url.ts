export const getUrlParams = (url: string): Record<string, string> | null => {
    if(!url) {
        throw new Error("url must be string");
    }

    const paramsString = url.split("?")[1];
    
    if(!paramsString) {
        return {};
    }

    const arrayOfParams = paramsString.split("&");
    
    const params: Record<string, string> = {};
    arrayOfParams.forEach((item) => {
        const [key, value] = item.split("=");
        params[key] = value;
    });
    
    return Object.keys(params).length > 0 ? params : null;
};
