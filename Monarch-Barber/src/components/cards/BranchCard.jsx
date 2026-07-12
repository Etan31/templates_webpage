import Chip from '../ui/Chip.jsx'
import Icon from '../ui/Icon.jsx'
import styles from './BranchCard.module.css'

export default function BranchCard({ branch }) {
  const { name, phone, phoneHref, address, hours } = branch
  return (
    <article className={styles.bcard}>
      <div className={styles.bhead}>
        <Chip icon="mapPin" />
        <h3>{name}</h3>
      </div>
      <a className={`${styles.brow} ${styles.link}`} href={phoneHref}>
        <Icon name="phone" />
        <span>
          <span className={styles.lbl}>Phone</span>
          {phone}
        </span>
      </a>
      <div className={styles.brow}>
        <Icon name="mapPin" />
        <span>
          <span className={styles.lbl}>Address</span>
          {address}
        </span>
      </div>
      <div className={styles.brow}>
        <Icon name="clock" />
        <span>
          <span className={styles.lbl}>Hours</span>
          {hours}
        </span>
      </div>
    </article>
  )
}
