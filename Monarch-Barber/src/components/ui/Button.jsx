import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import styles from './Button.module.css'

const VARIANTS = {
  dark: styles.dark,
  gold: styles.gold,
  ghost: styles.ghost,
}

// Pill/ghost button. Renders a router Link for `to`, or an anchor for `href`
// (external, tel:, mailto:). A trailing arrow icon shows by default; pass icon={null} to omit.
export default function Button({
  to,
  href,
  variant = 'dark',
  light = false,
  fullWidth = false,
  icon = 'arrowRight',
  className = '',
  children,
  ...props
}) {
  const cls = [
    styles.btn,
    VARIANTS[variant],
    light && styles.light,
    fullWidth && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {icon && <Icon name={icon} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} className={cls} {...props}>
      {content}
    </a>
  )
}
