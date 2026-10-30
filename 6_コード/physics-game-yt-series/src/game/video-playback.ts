export const VIDEO_RATES=[0.5,0.75,0.9,1,1.25,1.5,2];
export const VIDEO_RATE_KEY='physics-quest:video-playback-rate:v1';
export function savedVideoRate(storage:Pick<Storage,'getItem'>){
 try{const n=Number(storage.getItem(VIDEO_RATE_KEY));return VIDEO_RATES.includes(n)?n:0.9;}catch{return 0.9;}
}
export function applyVideoRate(video:HTMLVideoElement,rate:number){
 const safe=VIDEO_RATES.includes(rate)?rate:0.9;
 video.defaultPlaybackRate=safe;video.playbackRate=safe;video.preservesPitch=true;
 const legacy=video as HTMLVideoElement&{webkitPreservesPitch?:boolean;mozPreservesPitch?:boolean};
 if('webkitPreservesPitch' in legacy)legacy.webkitPreservesPitch=true;
 if('mozPreservesPitch' in legacy)legacy.mozPreservesPitch=true;
}
