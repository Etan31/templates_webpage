import { Link } from 'react-router-dom'
import Img from './Img.jsx'
import styles from './PageHeader.module.css'

// Interior page hero with a dark photo backdrop, title, and breadcrumb.
export default function PageHeader({ title, current, bg }) {
  return (
    <section className={styles.phead}>
      <div className={styles.bg}>
        <Img src={bg} alt="" loading="eager" />
      </div>
      <div className={`container ${styles.inner}`}>
        <h1>{title}</h1>
        <div className={styles.crumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{current}</span>
        </div>
      </div>
    </section>
  )
}
