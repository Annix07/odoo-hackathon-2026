import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, Mail, User as UserIcon, BadgeInfo, Phone, MapPin, Activity, ArrowRight, X, Facebook, Instagram, Youtube, MessageSquare, ArrowUp, CheckCircle2, Users, CalendarDays, Clock, CreditCard, ShieldCheck, PieChart, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { PaymentModal } from './PaymentModal';

export const Auth: React.FC = () => {
  const { login, signup } = useAppContext();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'about' | 'features' | 'pricing' | 'contact' | 'faq'>('home');
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string, interval?: string} | null>(null);
  
  const [email, setEmail] = useState('admin@hrsync.com'); // Default for demo
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState<'Employee' | 'Admin'>('Employee');
  const [profession, setProfession] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signup({
          email,
          name,
          role,
          employeeId,
          phone: '',
          address: '',
          department: profession || 'General',
          designation: profession || 'New Role',
          basicPay: 0,
          hra: 0,
          specialAllowance: 0,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
        }, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    // Clear demo credentials when switching to sign up
    if (!isSignUp) {
      setEmail('');
      setPassword('');
    } else {
      setEmail('admin@hrsync.com');
      setPassword('password123');
    }
  };

  const openModal = (signupMode: boolean) => {
    setIsSignUp(signupMode);
    setShowModal(true);
    setError('');
    if (!signupMode) {
      setEmail('admin@hrsync.com');
      setPassword('password123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-6 flex justify-between items-center hidden md:flex">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><Phone className="w-3 h-3"/> +1 (555) 123-4567</span>
          <span className="flex items-center gap-2"><Mail className="w-3 h-3"/> contact@hrsync.com</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3"/> 123 Corporate Ave, Tech District, NY 10001
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center">
          <Logo className="h-8 w-auto" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button onClick={() => setActivePage('home')} className={`${activePage === 'home' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>{t('home')}</button>
          <button onClick={() => setActivePage('about')} className={`${activePage === 'about' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>{t('about_us')}</button>
          <button onClick={() => setActivePage('features')} className={`${activePage === 'features' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>{t('features')}</button>
          <button onClick={() => setActivePage('pricing')} className={`${activePage === 'pricing' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>{t('pricing')}</button>
          <button onClick={() => setActivePage('faq')} className={`${activePage === 'faq' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>FAQ</button>
          <button onClick={() => setActivePage('contact')} className={`${activePage === 'contact' ? 'text-[#2563eb] border-b-2 border-[#2563eb] pb-1' : 'hover:text-[#2563eb] transition-colors'}`}>Contact</button>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button 
            onClick={() => openModal(false)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Lock className="w-4 h-4"/> Sign In
          </button>
        </div>
      </nav>

      {/* Content based on activePage */}
      {activePage === 'home' && (
        <section id="home" className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="flex items-center mb-10">
              <Logo className="h-14 w-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Workplace Harmony Is Our <br/>
              <span className="text-[#2563eb]">Top Priority</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl leading-relaxed">
              Experience world-class HR operations with our comprehensive suite of tools and state-of-the-art facilities. We are committed to providing seamless alignment for you and your team.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => openModal(true)}
                className="w-full sm:w-auto bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Get Started <ArrowRight className="w-5 h-5"/>
              </button>
              <button onClick={() => setActivePage('features')} className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-[#2563eb] border-2 border-blue-100 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-lg">
                Learn More
              </button>
            </div>
          </div>

        <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
          {/* Graphic Container */}
          <div className="w-full aspect-square md:aspect-[4/3] bg-gradient-to-tr from-blue-50 to-indigo-50/50 rounded-3xl flex items-center justify-center relative shadow-inner overflow-hidden border border-slate-100">
             
             {/* Mock Dashboard Illustration */}
             <div className="absolute inset-x-8 -bottom-16 top-16 bg-white rounded-t-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-6">
                {/* Header Mock */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                     <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                  </div>
                </div>
                {/* Chart Mock */}
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-6 flex flex-col justify-end gap-2">
                   <div className="flex items-end justify-between h-32 gap-3">
                      <div className="w-full bg-[#93c5fd] rounded-t-sm" style={{height: '40%'}}></div>
                      <div className="w-full bg-[#60a5fa] rounded-t-sm" style={{height: '60%'}}></div>
                      <div className="w-full bg-[#3b82f6] rounded-t-sm" style={{height: '80%'}}></div>
                      <div className="w-full bg-[#2563eb] rounded-t-sm" style={{height: '50%'}}></div>
                      <div className="w-full bg-[#1d4ed8] rounded-t-sm" style={{height: '90%'}}></div>
                   </div>
                </div>
             </div>

             {/* Floating badge */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -left-4 md:-left-12 bottom-24 bg-white p-5 rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 flex items-center gap-4 z-10"
             >
               <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                 <Activity className="w-6 h-6"/>
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Success Rate</p>
                 <p className="text-3xl font-extrabold text-slate-900">99.9%</p>
               </div>
             </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* About Us Section */}
      {activePage === 'about' && (
      <section id="about" className="py-20 bg-slate-50 border-t border-slate-100 flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-[#2563eb] text-sm font-bold tracking-wide mb-6">
            About HRSync
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Empowering Modern Workforces</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            HRSync is a comprehensive Human Resource Management System designed to simplify, automate, and elevate HR operations. Our mission is to bridge the gap between complex administrative tasks and intuitive employee experiences. From streamlined onboarding and precision payroll to advanced analytics and role-based access control, HRSync provides a unified platform that aligns your team for unparalleled success.
          </p>
        </div>
      </section>
      )}

      {/* Features Section */}
      {activePage === 'features' && (
      <section id="features" className="py-24 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything You Need to Manage Your Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful, intuitive features that automate the busywork so you can focus on your people.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-blue-50 text-[#2563eb] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Employee Management</h3>
              <p className="text-slate-600">Centralized database for all employee records, documents, and career progression with intuitive search and filtering.</p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Attendance Tracking</h3>
              <p className="text-slate-600">Real-time clock-in/out capabilities with geofencing, automated timesheets, and shift scheduling made simple.</p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CalendarDays className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Leave Management</h3>
              <p className="text-slate-600">Automated leave requests, custom policy configurations, and instant balance updates with a transparent approval workflow.</p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Payroll</h3>
              <p className="text-slate-600">Error-free salary calculations, dynamic tax deductions, compliance handling, and one-click payslip generation.</p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access & Security</h3>
              <p className="text-slate-600">Granular permissions ensuring admins, managers, and employees see only what they need with bank-grade encryption.</p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white group">
              <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <PieChart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Reports</h3>
              <p className="text-slate-600">Actionable insights into workforce analytics, turnover rates, and operational costs with visual, exportable dashboards.</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Pricing Section */}
      {activePage === 'pricing' && (
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-100 flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Transparent Pricing for Every Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Choose the perfect plan to scale your HR operations effortlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:border-[#2563eb] transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic</h3>
              <p className="text-slate-500 mb-6">Perfect for small teams starting out.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">$19</span>
                <span className="text-slate-500">/mo per user</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> <span className="text-slate-600">Up to 50 Employees</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> <span className="text-slate-600">Basic Employee Directory</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> <span className="text-slate-600">Leave & Attendance Tracking</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> <span className="text-slate-600">Standard Email Support</span></li>
              </ul>
              <button onClick={() => setSelectedPlan({ name: 'Basic', price: '$19', interval: '/mo per user' })} className="w-full py-4 rounded-xl font-bold text-[#2563eb] bg-blue-50 hover:bg-[#2563eb] hover:text-white transition-colors">Get Started</button>
            </div>

            {/* Professional Plan */}
            <div className="bg-[#1e3a8a] rounded-3xl p-8 border border-[#2563eb] shadow-2xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2563eb] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-blue-200 mb-6">Ideal for growing businesses.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">$59</span>
                <span className="text-blue-200">/mo per user</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> <span className="text-blue-50">Up to 250 Employees</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> <span className="text-blue-50">Automated Payroll Processing</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> <span className="text-blue-50">Advanced Reporting & Analytics</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> <span className="text-blue-50">Role-Based Access Control</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> <span className="text-blue-50">Priority 24/7 Support</span></li>
              </ul>
              <button onClick={() => setSelectedPlan({ name: 'Professional', price: '$59', interval: '/mo per user' })} className="w-full py-4 rounded-xl font-bold bg-white text-[#2563eb] hover:bg-blue-50 transition-colors">Start Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative flex flex-col">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">Premium Plan</div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-6">Customized for large-scale organizations.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">$129</span>
                <span className="text-slate-400">/mo per user</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/> <span className="text-slate-300">Unlimited Employees</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/> <span className="text-slate-300">Custom Integrations & APIs</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/> <span className="text-slate-300">Dedicated Account Manager</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/> <span className="text-slate-300">On-Premise Deployment Option</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/> <span className="text-slate-300">Custom Branding</span></li>
              </ul>
              <button onClick={() => setSelectedPlan({ name: 'Enterprise', price: '$129', interval: '/mo per user' })} className="w-full py-4 rounded-xl font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors">Get Premium</button>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      {activePage === 'faq' && (
      <section id="faq" className="py-24 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Find answers to common questions about HRSync.</p>
          </div>
          <div className="space-y-6">
            {[
              { q: 'What is HRSync?', a: 'HRSync is a comprehensive Human Resource Management System that automates payroll, attendance, and employee management.' },
              { q: 'Is my data secure?', a: 'Yes, we use bank-grade encryption and strict role-based access control to ensure your data is always secure.' },
              { q: 'Can I upgrade my plan later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time from the billing dashboard.' },
              { q: 'Do you offer a free trial?', a: 'Yes, our Professional plan comes with a 14-day free trial so you can explore all features before committing.' }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      {activePage === 'contact' && (
      <section id="contact" className="py-24 bg-slate-50 flex-1">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <form className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input type="email" required className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
              <textarea required rows={5} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>
      )}

      <footer className="bg-slate-900 text-slate-300 py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <Logo className="h-12 w-auto" light />
            </div>
            <p className="text-sm text-slate-400">
              Empowering your workforce with intelligent HR solutions. Every workday, perfectly aligned.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Core HR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payroll</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Time & Attendance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Employee Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us On</h4>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/HRSync-Official/61591292235400/?rdid=gw3luNbAz9DtqmJI&share_url=https%253A%252F%252Fwww.facebook.com%252Fshare%252F1D3f3YRBC9%252F" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/hrsync.official?igsh=MXd1YnNud3JpN3Ztbg==" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@hrsyncofficial?si=KPpU43dJ-jpXZ1H3" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div className="mb-4 md:mb-0">
            &copy; 2026 HRSync. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>Version v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white text-slate-600 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto overflow-x-hidden"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
               <X className="w-5 h-5"/>
            </button>
            
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center mb-6">
                <Logo className="h-12 w-auto" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-slate-600 mt-2 text-lg">{isSignUp ? 'Sign up to' : 'Sign in to'} perfectly align your workday.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors"
                        placeholder="John Doe"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <BadgeInfo className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors"
                          placeholder="EMP-XXX"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'Employee' | 'Admin')}
                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors bg-white"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Admin">HR/Admin</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 mt-4">Working Profession</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      list="profession-list"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors"
                      placeholder="e.g. Software Engineer"
                      required={isSignUp}
                    />
                    <datalist id="profession-list">
                      <option value="Software Engineer" />
                      <option value="HR Manager" />
                      <option value="Marketing Specialist" />
                      <option value="Sales Representative" />
                      <option value="Product Manager" />
                      <option value="Designer" />
                      <option value="Accountant" />
                    </datalist>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-[#2563eb] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] transition-colors mt-4 text-lg"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-sm text-[#2563eb] hover:text-blue-800 font-bold transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                <p className="font-semibold text-slate-700 mb-2">Demo accounts:</p>
                <div className="space-y-2">
                  <button onClick={() => setEmail('admin@hrsync.com')} className="text-[#2563eb] hover:underline">admin@hrsync.com</button> (Admin)<br/>
                  <button onClick={() => setEmail('employee@hrsync.com')} className="text-[#2563eb] hover:underline">employee@hrsync.com</button> (Employee)
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <PaymentModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        plan={selectedPlan} 
      />
    </div>
  );
};
