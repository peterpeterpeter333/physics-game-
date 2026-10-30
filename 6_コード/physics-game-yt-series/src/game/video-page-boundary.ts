/** Stop on the last frame INSIDE this page, not the first frame of the next. */
export function holdVideoPage(video:{currentTime:number;pause:()=>void},start:number,end:number):boolean {
 if(video.currentTime<end)return false;
 video.pause();
 video.currentTime=Math.max(start,end-1/30);
 return true;
}
