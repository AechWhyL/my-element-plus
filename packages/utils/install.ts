import type { App,Plugin } from "vue";
import {each} from "lodash-es"

type SFCWithInstall<T> = T & Plugin

export const makeIntaller = (components:Plugin[])=>{
    const installer = (app:App)=>{
        each(components,(component)=>{
            app.use(component)
        })
    }

    return installer
}

export const withInstall = <T>(component:T,install?:(App:App)=>void)=>{
    if(install){
        (component as SFCWithInstall<T>).install = install
    }else{
    (component as SFCWithInstall<T>).install = (app:App)=>{
        const name = (component as any).name || "UnnamedComponent" 
        app.component(name,component as SFCWithInstall<T>)
    }}

    return component as SFCWithInstall<T>
}