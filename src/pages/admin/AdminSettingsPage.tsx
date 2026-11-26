import React, { useEffect, useState } from 'react';
import SvgIcon from '../../components/SvgIcon';
import AdminLayout from '../../components/admin/AdminLayout';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminSettingsPage() {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    rtlSimulated,
    setRtlSimulated,
    cms,
    updateHeroStatus,
    updateContactEmail,
    resetCMSState,
  } = usePortfolio();

  const [statusEn, setStatusEn] = useState(cms.heroStatusEn);
  const [statusFa, setStatusFa] = useState(cms.heroStatusFa);
  const [email, setEmail] = useState(cms.email);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setStatusEn(cms.heroStatusEn);
    setStatusFa(cms.heroStatusFa);
    setEmail(cms.email);
  }, [cms.heroStatusEn, cms.heroStatusFa, cms.email]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroStatus(statusEn, statusFa);
    updateContactEmail(email);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <AdminLayout breadcrumb="Settings">
      <div className="flex flex-col w-full px-4 md:px-0 pt-4 pb-space-xl gap-space-lg">
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-1.5 font-label-code text-label-code text-accent-teal">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
            <span>CMS_CONFIG::GLOBAL</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight">
            System &amp; Identity Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
          {/* Identity & Status Form */}
          <form
            onSubmit={handleSave}
            className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-md shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <label className="font-label-code text-label-code text-text-muted-dark">
                Hero Status Headline (EN)
              </label>
              <input
                className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                value={statusEn}
                onChange={(e) => setStatusEn(e.target.value)}
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1" dir="rtl">
              <label className="font-label-code text-label-code text-text-muted-dark">
                عنوان وضعیت هیرو (فارسی)
              </label>
              <input
                className="bg-surface-dark text-on-surface font-body-md text-body-md px-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                value={statusFa}
                onChange={(e) => setStatusFa(e.target.value)}
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-code text-label-code text-text-muted-dark">
                Direct Contact Email
              </label>
              <input
                className="bg-surface-dark text-on-surface font-label-code text-label-code px-3 py-2 rounded-lg outline-none focus:bg-surface-container-highest transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>

            <button
              className="w-full bg-primary text-on-primary font-label-code text-label-code py-2.5 rounded-lg font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              type="submit"
            >
              <SvgIcon className="w-[18px] h-[18px]" name="save" />
              <span>{savedToast ? 'Saved to Session!' : 'Save Identity Config'}</span>
            </button>
          </form>

          {/* Appearance & Locale */}
          <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm shadow-sm">
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
              Display &amp; Bi-Directional Preferences
            </span>

            <div className="flex flex-wrap items-center justify-between gap-3 py-1">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-primary font-medium">
                  Theme Mode
                </span>
                <span className="font-label-code text-[11px] text-text-muted-dark">
                  Current: {theme === 'dark' ? 'Dark Monochrome' : 'Light Editorial'}
                </span>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-code text-label-code cursor-pointer shrink-0"
                onClick={toggleTheme}
                type="button"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 py-1">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-primary font-medium">
                  Active Language
                </span>
                <span className="font-label-code text-[11px] text-text-muted-dark">
                  {language === 'en' ? 'English (LTR)' : 'فارسی (RTL)'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-dark p-1 rounded-lg shrink-0">
                <button
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] cursor-pointer ${
                    language === 'en' ? 'bg-primary text-on-primary' : 'text-text-muted-dark'
                  }`}
                  onClick={() => setLanguage('en')}
                  type="button"
                >
                  EN
                </button>
                <button
                  className={`px-2.5 py-1 rounded-lg font-label-code text-[11px] cursor-pointer ${
                    language === 'fa' ? 'bg-primary text-on-primary' : 'text-text-muted-dark'
                  }`}
                  onClick={() => setLanguage('fa')}
                  type="button"
                >
                  FA
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-primary font-medium">
                  Simulate Persian Layout (RTL)
                </span>
                <span className="font-label-code text-[11px] text-text-muted-dark">
                  Mirror direction for inspection
                </span>
              </div>
              <button
                aria-label="Simulate Persian Layout (RTL)"
                aria-pressed={rtlSimulated}
                dir="ltr"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-[0.75rem] transition-colors ${
                  rtlSimulated ? 'bg-accent-teal' : 'bg-surface-container-highest'
                }`}
                onClick={() => setRtlSimulated(!rtlSimulated)}
                type="button"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-[0.75rem] bg-primary transition-transform m-0.5 ${
                    rtlSimulated ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Submissions Inbox */}
        <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted-dark uppercase">
              Contact Dispatch Inbox
            </span>
            <span className="font-label-code text-[11px] text-accent-teal">
              {cms.contactMessages.length} Received
            </span>
          </div>
          {cms.contactMessages.length === 0 ? (
            <p className="font-label-code text-[11px] text-text-muted-dark">
              Messages submitted on the public portfolio contact form will appear here.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {cms.contactMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-lg bg-surface-dark flex flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-body-sm text-body-sm text-primary font-medium">
                      {msg.name}
                    </span>
                    <span className="font-label-code text-[10px] text-text-muted-dark break-all">
                      {msg.email}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Storage Reset */}
        <div className="rounded-xl bg-surface-container-low p-space-sm flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-col min-w-0">
            <span className="font-body-sm text-body-sm text-primary font-medium">
              Reset CMS State
            </span>
            <span className="font-label-code text-[11px] text-text-muted-dark">
              Restore default portfolio snapshot
            </span>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg bg-surface-container-high text-error hover:bg-error-container hover:text-on-error font-label-code text-label-code transition-colors cursor-pointer shrink-0"
            onClick={() => {
              resetCMSState();
            }}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
