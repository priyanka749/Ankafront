import fashionVideo from '../assets/images/..mp4'

<div className="relative">
  <video
    src={fashionVideo}
    autoPlay
    muted
    loop
    className="w-full h-[500px] object-cover"
  />
  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/30">
    <h1 className="text-white text-4xl font-bold">Welcome to Anka Attire</h1>
  </div>
</div>

