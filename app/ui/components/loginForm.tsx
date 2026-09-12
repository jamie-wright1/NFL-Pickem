'use client';
 
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './Button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import styles from './loginForm.module.css';
 
export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
 
  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Please log in to continue.
        </h1>
        <div className={styles.fields}>
          <div>
            <label className={styles.label} htmlFor="username">
              Name
            </label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                id="username"
                name="username"
                placeholder="Enter your username"
                required
              />
              <AtSymbolIcon className={styles.icon} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className={styles.icon} />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div className={styles.submit}>
          <Button aria-disabled={isPending}>
            Log in <ArrowRightIcon className={styles.submitIcon} />
          </Button>
        </div>
        <div className={styles.status} aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className={styles.errorIcon} />
              <p className={styles.errorText}>{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}