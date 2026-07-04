import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    interval?: string;
  } | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !plan) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Column: Order Summary */}
          <div className="w-full md:w-5/12 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{plan.name} Plan</h4>
                  <p className="text-sm text-slate-500">HRSync Subscription</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                  {plan.interval && <span className="text-sm text-slate-500 block">{plan.interval}</span>}
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">{plan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxes (0%)</span>
                  <span className="font-semibold text-slate-900">$0.00</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Due</span>
                <span className="text-xl font-extrabold text-[#2563eb]">{plan.price}</span>
              </div>
            </div>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="w-full md:w-7/12 p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Method</h3>

            {isSuccess ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h4>
                <p className="text-slate-600">Your subscription has been activated.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="font-semibold text-sm">UPI / QR</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="font-semibold text-sm">Credit Card</span>
                  </button>
                </div>

                <div className="min-h-[280px]">
                  {paymentMethod === 'upi' ? (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                        <p className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Scan to Pay</p>
                        
                        {/* UPI QR Code */}
                        <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden p-4">
                          <QRCode
                            value="upi://pay?pa=anirban.60936@axl&pn=HRSync&cu=INR"
                            size={160}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                          />
                        </div>

                        <div className="w-full">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-left">UPI ID</label>
                          <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 font-mono text-sm text-center">
                            anirban.60936@axl
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ${plan.price}`
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
