import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from './Icon';
import styles from './Layout.module.css';

const NAV = [
  { to: '/', label: '首页', icon: 'home' as const },
  { to: '/tasks', label: '学任务', icon: 'book-open' as const },
  { to: '/chat', label: '问陪练', icon: 'message-circle' as const, fab: true },
  { to: '/profile', label: '我的', icon: 'user' as const },
];

export default function Layout() {
  const loc = useLocation();

  return (
    <div className={styles.layout}>
      <div className={styles.content}><Outlet /></div>
      <nav className={styles.nav}>
        {NAV.map((item) => {
          const active = item.fab
            ? loc.pathname.startsWith('/chat')
            : loc.pathname === item.to || (item.to !== '/' && loc.pathname.startsWith(item.to));

          if (item.fab) {
            return (
              <NavLink key={item.to} to={item.to} className={`${styles.navFab} ${active ? styles.active : ''}`}>
                <Icon name={item.icon} size={26} strokeWidth={2} />
              </NavLink>
            );
          }
          return (
            <NavLink key={item.to} to={item.to} className={`${styles.navItem} ${active ? styles.active : ''}`}>
              <Icon name={item.icon} size={22} strokeWidth={2} />
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
