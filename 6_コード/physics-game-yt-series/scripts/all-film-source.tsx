import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {REGISTRY} from '../src/components/figures';
import {reviewShots} from '../src/components/figures/unique';
import {VideoTimeContext} from '../src/components/figures/anim';
export function figure(id:string,t:number){
 const Component=REGISTRY[id],shot=reviewShots[id];
 if(!Component&&!shot)throw Error(`Missing film illustration: ${id}`);
 const node=shot?<svg viewBox="0 0 320 220">{shot.draw(Math.min(1,t/10),.55)}</svg>:<Component/>;
 const html=renderToStaticMarkup(<VideoTimeContext.Provider value={t}>{node}</VideoTimeContext.Provider>);
 const svg=html.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
 if(!svg)throw Error(`No SVG illustration: ${id}`);
 return id==='pendulum-sync'?svg.replaceAll('y="168"','y="150"'):svg;
}
