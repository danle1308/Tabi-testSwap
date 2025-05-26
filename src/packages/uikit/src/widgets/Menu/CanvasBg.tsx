import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hovered: boolean
}

const ConnectedParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const numParticles = 100
    const maxDistance = 100
    const hoverDistance = 10 // Khoảng cách để phát hiện hover
    const hoverEffectDistance = 200 // Khi hover, liên kết xa hơn

    // Khởi tạo particles
    const particles: Particle[] = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 3,
      hovered: false,
    }))

    particlesRef.current = particles

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x <= 0 || p.x >= width) p.vx *= -1
        if (p.y <= 0 || p.y >= height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.hovered ? 'red' : 'white'
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          const isHovered = particles[i].hovered || particles[j].hovered
          const linkDistance = isHovered ? hoverEffectDistance : maxDistance

          if (distance < linkDistance) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = isHovered
              ? `rgba(255, 0, 0, ${1 - distance / linkDistance})`
              : `rgba(255, 255, 255, ${1 - distance / linkDistance})`
            ctx.lineWidth = isHovered ? 1.5 : 0.5
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(drawParticles)
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      let foundIndex: number | null = null

      particles.forEach((p, index) => {
        const dx = clientX - p.x
        const dy = clientY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < hoverDistance) {
          foundIndex = index
        }
      })

      setHoveredIndex(foundIndex)
    }

    const handleMouseLeave = () => {
      setHoveredIndex(null)
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    animationRef.current = requestAnimationFrame(drawParticles)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    particlesRef.current.forEach((p, index) => {
      p.hovered = index === hoveredIndex
    })
  }, [hoveredIndex])

  return <Bg ref={canvasRef} className="absolute top-0 left-0 w-full h-full bg-black" />
}

export default ConnectedParticles

const Bg = styled.canvas`
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 100%;
`
