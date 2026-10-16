import {useEffect,useState} from "react";
import {api} from "../lib/api.js";
export const defaultSections=["hero","services","projects","gallery","social","about","skills","education","talk","contact"].map(id=>({id,visible:true}));
export const defaultNav=[{label:"Home",href:"/"},{label:"About",href:"/about"},{label:"Work",href:"/projects"},{label:"Gallery",href:"/gallery"},{label:"Blog",href:"/blog"}];
export const parseList=(raw,fallback)=>{try{const a=JSON.parse(raw);return Array.isArray(a)?a:fallback}catch{return fallback}};
export function useAppearance(){const [settings,setSettings]=useState({});useEffect(()=>{let live=true;api.getSettings().then(v=>{if(live)setSettings(v)}).catch(()=>{});return()=>{live=false}},[]);return settings}
export function AppearanceTheme(){const settings=useAppearance();useEffect(()=>{const root=document.documentElement;for(const [key,css] of [["accent_color","--accent"],["accent_color_2","--accent-2"]]){if(/^#[0-9a-fA-F]{6}$/.test(settings[key]||""))root.style.setProperty(css,settings[key]);else root.style.removeProperty(css)}},[settings]);return null}
