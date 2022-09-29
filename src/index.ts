import Router from "./libs/Router/Router";

const RouterInstance = new Router({debug: true});

RouterInstance.subscribe('/', () => {
    const root = document.getElementById('root');
    root!.innerHTML = "";
    const h1 = document.createElement('h1');
    const text = document.createTextNode('Main page :)');
    h1.appendChild(text);
    root?.append(h1);
})

RouterInstance.subscribe('/hello/world', ({params, pathname, url}) => {
    console.log('on hello world page');
    console.log('params: ', params, pathname, url);
});

RouterInstance.subscribe('/hello/me', ({params, pathname, url}) => {
    console.log('on hello me page');
    console.log('params: ', params, pathname, url);
});

RouterInstance.subscribe('*', () => {
    document.getElementById('root')!.innerText = "404 Not found";
})

RouterInstance.subscribe('/user/:id', ({params}) => {
    const root = document.getElementById('root');
    root!.innerHTML = "";
    const h1 = document.createElement('h1');
    const text = document.createTextNode(`User: ${params?.id}`);
    h1.appendChild(text);
    root?.append(h1)
});

RouterInstance.init();