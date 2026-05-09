"use client";

import { useAuth } from '@/contexts/AuthContext';
//import { PricingSection } from '@/components/PricingSection';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { TypewriterEffect } from '@/components/TypewriterEffect';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as ScrollLink } from 'react-scroll';
import { VideoModal } from '@/components/VideoModal';
import { supabase } from '@/utils/supabase';

/* eslint-disable @typescript-eslint/no-unused-vars */

// 頂部導覽 sections
const workflowSections = [
  {
    id: 'overview',
    title: '泳會簡介',
    description:
      '川河泳會 Nile Swimming Club｜成人及兒童游泳課程、泳隊訓練、私人班',
    bgColor: 'bg-white dark:bg-black',
  },
  {
    id: 'courses',
    title: '課程介紹',
    description:
      '技術改良班、泳隊訓練、興趣班及私人泳班，按程度分班教學',
    bgColor: 'bg-slate-50 dark:bg-black',
  },
  {
    id: 'schedule',
    title: '時間及地點',
    description:
      '主要於顯田、天秀、屏山等泳池開班，方便元朗、西北區學員',
    bgColor: 'bg-white dark:bg-black',
  },
  {
    id: 'enroll',
    title: '報名及查詢',
    description:
      '填寫網上表格，我們會透過 WhatsApp 與你聯絡確認上課安排',
    bgColor: 'bg-slate-50 dark:bg-black',
  },
];

// 三類主打課程卡片
const courseCards = [
  {
    title: '技術改良班',
    description:
      '適合已有基本泳術，希望改善動作細節、提速及耐力的學員。',
    detail:
      '逢星期日 7:00–8:30pm｜天秀公園游泳池附近（實際時間以最新公佈為準）',
    tag: '適合青少年及成人',
  },
  {
    title: '泳隊訓練',
    description: '系統化泳隊訓練，提升比賽技術、體能及比賽經驗。',
    detail: '逢星期一、六 7:00–9:00pm｜顯田游泳池',
    tag: '泳隊及預備泳隊',
  },
  {
    title: '興趣班及私人班',
    description:
      '由零開始學水、自救基礎、四式入門，小組或一對一均可安排。',
    detail: '於顯田、屏山、西北、天秀等泳池按需開班。',
    tag: '兒童及成人均可',
  },
];

// 報名表初始狀態
const initialFormState = {
  name: '',
  age: '',
  phone: '',
  whatsapp: '',
  courseType: '技術改良班',
  message: '',
};

export default function LandingPage() {
  const { user } = useAuth();
  const { isInTrial } = useTrialStatus();
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [formData, setFormData] = useState(initialFormState);
  const [formStatus, setFormStatus] =
    useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    field: keyof typeof initialFormState,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormStatus('submitting');
  setErrorMessage(null);

  try {
    const { data, error } = await supabase.from('Enrollment').insert({
      'Student Name': formData.name,
      'Student Age': formData.age,
      'Student Phone': formData.phone,
      'Student Course Type': formData.courseType,
      Message: formData.message,
    });

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2));
      setFormStatus('error');
      setErrorMessage('提交時出現問題，請稍後再試或以 WhatsApp 直接聯絡我們。');
      return;
    }

    setFormStatus('submitted');
    setFormData(initialFormState);
  } catch (err) {
    console.error('Unexpected error:', err);
    setFormStatus('error');
    setErrorMessage('系統暫時未能處理，請稍後再試或以 WhatsApp 直接聯絡。');
  }
};

  // 👇 TODO: 改成你真實 WhatsApp 號碼，例如 8529XXXXXXX
  const whatsappNumber = '85212345678';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `你好，我想查詢／報名川河泳會游泳課程：
姓名：${formData.name}
年齡：${formData.age}
電話：${formData.phone}
課程類型：${formData.courseType}
備註：${formData.message}`,
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black relative">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 overflow-x-auto hide-scrollbar">
            {workflowSections.map((section, index) => (
              <ScrollLink
                key={section.id}
                to={section.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                onSetActive={() => setActiveSection(section.id)}
                className="flex items-center cursor-pointer group min-w-fit mx-4 first:ml-0 last:mr-0"
              >
                <div className="relative">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 hidden md:block whitespace-nowrap ${
                    activeSection === section.id
                      ? 'text-amber-500'
                      : 'text-slate-600 dark:text-slate-300 group-hover:text-amber-400'
                  }`}
                >
                  {section.title}
                </span>
              </ScrollLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section / 泳會簡介 */}
      <div
        id="overview"
        className="relative overflow-hidden"
        onMouseEnter={() => setActiveSection('overview')}
      >
        {/* 背景純黑 */}
        <div className="absolute inset-0 bg-black" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pb-24">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white">
                
                <span className="block mt-2 text-5xl sm:text-6xl lg:text-7xl text-white">
                  川河泳會
                </span>


                <span className="block tracking-[0.25em] uppercase text-3xl sm:text-4xl 1g:text-5xl" style={{
    color: '#373d46', // slate-300
    WebkitTextStroke: '2px #fbbf24',
  }}>
                  Nile Swimming Club
                </span>

                <br />
                
                <span className="block mt-4 text-lg sm:text-2xl text-amber-400">
                  成人及兒童游泳班｜泳隊訓練｜技術改良
                </span>
              </h1>

              <p className="mt-6 max-w-6xl mx-auto text-base sm:text-lg text-slate-100">
                由經驗教練 Tsang Sir 帶領，專注元朗及西北區游泳訓練，
                提供技術改良班、泳隊訓練、兒童及成人興趣班，以及一對一私人課程。
              </p>

              <div className="mt-4 text-sm text-slate-300">
                主要地點：顯田游泳池、天秀公園游泳池、屏山游泳池、西北區多個泳池
              </div>
            </div>

            {/* 下方兩欄：左哲學、右三課程，總高度一致 */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* 左邊哲學字卡，填滿高度 */}
              <div className="relative h-full flex">
                <pre className="relative rounded-xl bg-slate-900 p-8 shadow-2xl border border-amber-500/40 w-full flex">
                  <code className="text-sm sm:text-base text-slate-100 m-auto">
                    <TypewriterEffect
                      text={`川河泳會 Nile Swimming Club
授課哲學 Training Philosophy 

  安全第一，循序漸進
  重視技術，培養水感
  趣味練習，建立自信
  因應程度，分組教學
`}
                    />
                  </code>
                </pre>
              </div>

              {/* 右邊三大課程 summary（卡片同樣拉滿高度） */}
              <div className="grid grid-cols-1 gap-4">
                {courseCards.map((course) => (
                  <div
                    key={course.title}
                    className="relative p-4 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 rounded-xl shadow-lg hover:border-amber-500/70 transition-colors h-full"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {course.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {course.detail}
                    </p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                      {course.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="mt-12 flex gap-4 justify-center flex-wrap">
              <button
                onClick={() =>
                  document
                    .getElementById('enroll')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="px-8 py-3 bg-white hover:bg-slate-200 text-black rounded-lg shadow-lg hover:shadow-xl border border-amber-500/60 transition-all"
              >
                立即報名 / 查詢
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl border border-white/10 transition-all"
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp 直接聯絡
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 課程介紹 Section */}
      <section
        id="courses"
        className="py-20 bg-slate-50 dark:bg-black"
        onMouseEnter={() => setActiveSection('courses')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              課程介紹
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              按程度及目標分班教學，無論你係完全唔識游，定係想提升比賽成績，都有合適課程。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courseCards.map((course) => (
              <div
                key={course.title}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/70 dark:border-slate-700/70 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  {course.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {course.detail}
                </p>
                <div className="text-xs px-2 py-1 inline-block rounded-full bg-amber-500/10 text-amber-500">
                  {course.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 時間及地點 Section */}
      <section
        id="schedule"
        className="py-20 bg-black"
        onMouseEnter={() => setActiveSection('schedule')}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">時間及地點</h2>
            <p className="mt-4 text-lg text-slate-200">
              以下為常見班別時間，只供參考。<br /> 實際安排以教練最新公佈為準，
              可在報名表內註明你的可上課時間，我們會因應情況作出最佳安排。
            </p>
            <div className="mt-2 text-sm text-amber-400">
              服務主要覆蓋：元朗 · 天水圍 · 西北區附近泳池
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-100">
            <div className="border border-slate-700/70 rounded-lg p-4 bg-slate-900/60">
              <h3 className="font-semibold text-amber-400">技術改良班</h3>
              <p className="mt-1">
                星期日 7:00pm – 8:30pm｜天秀公園游泳池附近
              </p>
            </div>

            <div className="border border-slate-700/70 rounded-lg p-4 bg-slate-900/60">
              <h3 className="font-semibold text-amber-400">泳隊訓練</h3>
              <p className="mt-1">
                星期一、六 7:00pm – 9:00pm｜顯田游泳池
              </p>
            </div>

            <div className="border border-slate-700/70 rounded-lg p-4 bg-slate-900/60">
              <h3 className="font-semibold text-amber-400">興趣班及私人班</h3>
              <p className="mt-1">
                於顯田、屏山、西北、天秀等泳池按需求安排時間及人數，
                可為個人、家庭或小組度身訂造。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 報名及查詢 Section */}
      <section
        id="enroll"
        className="py-20 bg-slate-50 dark:bg-black"
        onMouseEnter={() => setActiveSection('enroll')}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              網上報名 / 查詢
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              填妥以下資料，我們會透過 WhatsApp 與你聯絡，確認合適課程及上課時間。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 border border-slate-200/70 dark:border-slate-700/70 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                學員姓名
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-3 py-2 text-sm"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  年齡（或年齡組別）
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：8 歲 / 成人"
                  className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-3 py-2 text-sm"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  聯絡電話
                </label>
                <input
                  type="tel"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-3 py-2 text-sm"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                想報讀課程類型
              </label>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-3 py-2 text-sm"
                value={formData.courseType}
                onChange={(e) => handleChange('courseType', e.target.value)}
              >
                <option>技術改良班</option>
                <option>泳隊訓練</option>
                <option>興趣班（兒童 / 成人）</option>
                <option>一對一私人班</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                簡單介紹現有水準及可上課時間（可選填）
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-black px-3 py-2 text-sm"
                placeholder="例：識踩水，識少少自由式；逢星期日同三晚間較得閒。"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full md:w-auto px-8 py-3 bg-black hover:bg-slate-900 text-white rounded-lg shadow-lg hover:shadow-xl border border-amber-500/60 transition-all disabled:opacity-60"
              >
                {formStatus === 'submitting' ? '提交中…' : '提交表格'}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl border border-white/10 transition-all"
              >
                <FaWhatsapp className="mr-2" />
                以 WhatsApp 直接聯絡
              </a>
            </div>

            {formStatus === 'submitted' && (
              <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
                表格已提交，我們會盡快透過 WhatsApp / 電話與你聯絡。
              </p>
            )}

            {formStatus === 'error' && errorMessage && (
              <p className="mt-4 text-sm text-red-500 dark:text-red-400">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* 價格區暫時關閉，有需要再打開 */}
      {/* <section id="pricing" className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSection />
        </div>
      </section> */}

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="S1cnQG0-LP4"
      />
    </div>
  );
}