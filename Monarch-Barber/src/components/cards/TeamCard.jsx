import Img from '../ui/Img.jsx'
import Icon from '../ui/Icon.jsx'
import { brand } from '../../data/site.js'
import styles from './TeamCard.module.css'

export default function TeamCard({ member }) {
  const { name, role, img, bio, exp, tags } = member
  return (
    <article className={styles.tcard}>
      <div className={styles.img}>
        <Img src={img} alt={`${name}, ${role} at ${brand.name}`} />
        <div className={styles.social}>
          <a href="#" aria-label="Instagram">
            <Icon name="instagram" />
          </a>
          <a href="#" aria-label="Facebook">
            <Icon name="facebook" />
          </a>
          <a href="#" aria-label="X">
            <Icon name="x" />
          </a>
        </div>
      </div>
      <div className={styles.body}>
        <h3>{name}</h3>
        <div className={styles.role}>{role}</div>
        <p>{bio}</p>
        <div className={styles.exp}>{exp}</div>
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
