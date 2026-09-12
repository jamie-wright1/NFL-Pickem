import LoginForm from '../components/loginForm';
import { Suspense } from 'react';
import styles from './page.module.css';
 
export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.bannerInner}>
            <h1 className={styles.title}>
              NFL Pick'em
            </h1>
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}