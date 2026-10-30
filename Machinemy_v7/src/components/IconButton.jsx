export default function IconButton({ icon, label, onClick, className = '' }) {
  return (
    <button type="button" className={`icon-button ${className}`} onClick={onClick} aria-label={label}>
      {icon}
    </button>
  )
}
