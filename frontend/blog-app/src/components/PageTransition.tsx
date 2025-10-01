import React, { useEffect, useRef } from 'react'
import Logo from './Logo'
import { gsap } from 'gsap'
import { useLocation, useNavigate } from 'react-router-dom'


const PageTransition = ({children}) => {

  const navigate = useNavigate()
  const pathname = useLocation()
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const logoOverlayRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const blockRef = useRef<HTMLDivElement[]>([])
  const isTransitioning = useRef(false)

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blockRef.current = []

      for (let i=0; i<20; i++){
        const block = document.createElement("div");
        block.className = ""
        blockRef.current.push(block);
      }
    }

    createBlocks();

    gsap.set(blockRef.current, {scaleX: 0, transformOrigin: "left"}) // scaleX: 0 --> the block will be initially collapsed, transformOrigin: left --> later the scaling movement will occur using the left edge
    
    if (logoRef.current){
      const path = logoRef.current.querySelector("path")

      if (path){
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent"
        })
      }
    }  

  }, [pathname])

  return (
    <>
    <div ref={overlayRef} className='fixed top-0 left-0 w-full h-full flex pointer-events-none z-2'>
    </div>
    <div ref={logoOverlayRef} className='fixed top-0 left-0 w-full h-full z-2 flex justify-center items-center bg-[#222] pointer-events-none opacity-0'>
        {/* Logo Overlay */}
        <div className='w-[200px] h-[200px] flex justify-center items-center p-5'>
            {/* Logo container */}
            <Logo ref={logoRef}/>
        </div>
    </div>

    {children}

    </>
  )
}

export default PageTransition