import {useEffect,useState} from "react";
import {api} from "./api.js";
export function useSiteSettings(){const [settings,setSettings]=useState({});useEffect(()=>{let alive=true;api.getSettings().then(s=>{if(alive)setSettings(s)}).catch(()=>{});return()=>{alive=false}},[]);return settings;}
