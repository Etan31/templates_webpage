import Icon from './Icon.jsx'
import styles from './Chip.module.css'

// Small round gold-outlined icon badge. Pass `icon` name, or custom `children`.
// `className` lets a parent add contextual spacing.
export default function Chip({ icon, className = '', children }) {
  return (
    <span className={[styles.chip, className].filter(Boolean).join(' ')}>
      {icon ? <Icon name={icon} /> : children}
    </span>
  )
}
