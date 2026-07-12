import Img from '../ui/Img.jsx'
import Chip from '../ui/Chip.jsx'
import Icon from '../ui/Icon.jsx'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ service }) {
  const { title, icon, img, alt, desc, duration, price } = service
  return (
    <article className={styles.scard}>
      <div className={styles.img}>
        <Img src={img} alt={alt} />
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <div>
            <h3>{title}</h3>
          </div>
          <Chip icon={icon} />
        </div>
        <p>{desc}</p>
        <div className={styles.meta}>
          <span className={styles.dur}>
            <Icon name="clock" /> {duration}
          </span>
          <span className={styles.price}>
            from <b>${price}</b>
          </span>
        </div>
      </div>
    </article>
  )
}
