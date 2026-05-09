'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { FaInstagram } from 'react-icons/fa'; // 新增 Instagram icon

// TopBar component handles user profile display and navigation
export default function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { isInTrial } = useTrialStatus();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user logout with error handling and loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 你的 Instagram 連結
  const instagramUrl = 'https://www.instagram.com/nile.swimming';

  return (
    <div className="w-full bg-white/90 dark:bg-black/80 border-b border-gray-200/70 dark:border-gray-800/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* 左邊 Logo：黑白 + 少少金色感覺 */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/60 bg-black text-white text-sm font-semibold tracking-[0.1em]">
            NS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">
              Nile Swimming Club
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              川河泳會
            </span>
          </div>
        </Link>

        {/* 右邊操作區 */}
        <div className="flex items-center gap-3">
          {/* Instagram 按鈕（取代 BuyMeCoffee） */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/70 bg-black px-3 py-1.5 text-xs sm:text-sm text-amber-300 hover:bg-slate-900 hover:border-amber-400 hover:text-amber-200 transition-colors"
          >
            <FaInstagram className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Instagram</span>
          </a>

          {/* 未登入狀態：顯示 Sign in */}
          {!user ? (
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-medium text-black bg-white hover:bg-slate-100 border border-amber-500/70 rounded-full transition-colors shadow-sm hover:shadow-md"
            >
              Sign in
            </Link>
          ) : (
            <>
              {/* 已登入：視乎訂閱／試用顯示 Dashboard / Subscription button */}
              {!isLoadingSubscription &&
                !isInTrial &&
                (!subscription ||
                  subscription.status === 'canceled' ||
                  (subscription.cancel_at_period_end &&
                    new Date(subscription.current_period_end) >
                      new Date())) && (
                  <button
                    onClick={() => router.push('/profile')}
                    className="hidden sm:block px-4 py-2 bg-black hover:bg-slate-900 text-white rounded-full text-xs sm:text-sm font-medium transition-colors border border-amber-500/70 shadow-sm hover:shadow-md"
                  >
                    View Subscription
                  </button>
                )}

              {!isLoadingSubscription &&
                (subscription || isInTrial) &&
                pathname !== '/dashboard' && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="hidden sm:block px-4 py-2 bg-black hover:bg-slate-900 text-white rounded-full text-xs sm:text-sm font-medium transition-colors border border-amber-500/70 shadow-sm hover:shadow-md"
                  >
                    {isInTrial ? 'Start Free Trial' : 'Dashboard'}
                  </button>
                )}

              {/* 用戶頭像＋下拉選單 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 px-2.5 py-1.5 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-black rounded-lg shadow-lg py-1 z-[60] border border-slate-200/80 dark:border-slate-700/80">
                    <div className="px-4 py-2 border-b border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        已登入
                      </p>
                      <p className="text-sm text-slate-900 dark:text-slate-100 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropdownOpen(false);
                        router.push('/profile');
                      }}
                    >
                      Profile & Subscription
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}