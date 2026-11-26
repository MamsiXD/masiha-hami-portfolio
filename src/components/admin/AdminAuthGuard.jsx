import { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  clearAdminSession,
  getLockoutRemainingSeconds,
  isAdminAuthenticated,
  verifyAndCreateSession,
} from '../../utils/adminAuth';
import SvgIcon from '../SvgIcon';

const AdminAuthContext = createContext({
  logout: () => {
    clearAdminSession();
  },
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthGuard({ children }) {
  const { language, theme, toggleTheme } = usePortfolio();
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockSeconds, setLockSeconds] = useState(() => getLockoutRemainingSeconds());

  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = window.setInterval(() => {
      const rem = getLockoutRemainingSeconds();
      setLockSeconds(rem);
      if (rem <= 0) {
        setErrorMsg('');
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockSeconds]);

  const logout = () => {
    clearAdminSession();
    setUsername('');
    setPassword('');
    setErrorMsg('');
    setAuthenticated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockSeconds > 0) return;

    const result = verifyAndCreateSession(username, password);
    if (result.ok) {
      setErrorMsg('');
      setUsername('');
      setPassword('');
      setAuthenticated(true);
      return;
    }

    if (result.lockedSeconds > 0) {
      setLockSeconds(result.lockedSeconds);
      setErrorMsg(
        language === 'fa'
          ? `تعداد تلاش ناموفق زیاد بود. لطفاً ${result.lockedSeconds} ثانیه صبر کنید.`
          : `Too many failed attempts. Try again in ${result.lockedSeconds}s.`
      );
    } else {
      setErrorMsg(
        language === 'fa'
          ? `نام کاربری یا رمز عبور نادرست است (${result.attemptsLeft} تلاش باقی‌مانده).`
          : `Invalid credentials (${result.attemptsLeft} attempts remaining).`
      );
    }
  };

  if (!authenticated) {
    const isFa = language === 'fa';
    return (
      <div className="admin-shell bg-surface-dark font-body-md text-on-surface flex flex-col min-h-screen w-full px-4 py-8 items-center justify-center">
        <div className="w-full max-w-sm rounded-xl bg-surface-container-low p-6 shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-accent-teal">
                <SvgIcon className="w-5 h-5" name="lock" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-code text-[11px] text-accent-teal uppercase tracking-wider">
                  CMS_GATE::AUTH
                </span>
                <h1 className="font-headline-md text-headline-md text-primary font-medium">
                  {isFa ? 'ورود به پنل مدیریت' : 'Admin Authentication'}
                </h1>
              </div>
            </div>
            <button
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={toggleTheme}
              type="button"
            >
              <SvgIcon
                className="w-[18px] h-[18px]"
                name={theme === 'dark' ? 'dark_mode' : 'light_mode'}
              />
            </button>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                className="font-label-code text-label-code text-text-muted-dark"
                htmlFor="admin-username"
              >
                {isFa ? 'نام کاربری' : 'Username'}
              </label>
              <input
                autoComplete="username"
                className="bg-surface-dark text-on-surface font-label-code text-label-code px-3 py-2.5 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                disabled={lockSeconds > 0}
                id="admin-username"
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isFa ? 'نام کاربری ادمین' : 'Enter username'}
                required
                type="text"
                value={username}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-label-code text-label-code text-text-muted-dark"
                htmlFor="admin-password"
              >
                {isFa ? 'رمز عبور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  className="w-full bg-surface-dark text-on-surface font-label-code text-label-code ps-3 pe-10 py-2.5 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                  disabled={lockSeconds > 0}
                  id="admin-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-text-muted-dark hover:text-primary p-1 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  <SvgIcon
                    className="w-[18px] h-[18px]"
                    name={showPassword ? 'visibility_off' : 'visibility'}
                  />
                </button>
              </div>
            </div>

            {(errorMsg || lockSeconds > 0) && (
              <div className="rounded-lg bg-error-container/30 px-3 py-2 font-label-code text-[11px] text-error">
                {lockSeconds > 0
                  ? isFa
                    ? `دسترسی موقتاً قفل شد. ${lockSeconds} ثانیه صبر کنید.`
                    : `Access temporarily locked. Retry in ${lockSeconds}s.`
                  : errorMsg}
              </div>
            )}

            <button
              className="w-full bg-primary text-on-primary font-label-code text-label-code py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 cursor-pointer mt-1"
              disabled={lockSeconds > 0}
              type="submit"
            >
              <SvgIcon className="w-4 h-4" name="lock" />
              <span>{isFa ? 'ورود به پنل' : 'Unlock Control Panel'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-border-dark flex items-center justify-between text-xs">
            <Link
              className="font-label-code text-label-code text-text-muted-dark hover:text-primary transition-colors flex items-center gap-1"
              to="/"
            >
              <SvgIcon className="w-4 h-4" name="arrow_outward" />
              <span>{isFa ? 'بازگشت به پورتفولیو' : 'Back to Portfolio'}</span>
            </Link>
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
              Protected
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
