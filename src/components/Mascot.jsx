import mascotPng from '../assets/machinemy-mascot.png'

export default function Mascot({ className = '', size = 120, alt = 'Mascote Machinemy' }) {
  return (
    <img
      src={mascotPng}
      className={className}
      style={{ width: size, height: 'auto', objectFit: 'contain' }}
      alt={alt}
      draggable="false"
    />
  )
}
