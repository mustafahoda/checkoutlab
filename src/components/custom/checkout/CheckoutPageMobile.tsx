import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutPageMobileProps {
    children: React.ReactNode;
    className?: string;
}

const CheckoutPageMobile: React.FC<CheckoutPageMobileProps> = ({ children, className }) => {
    return (
        <div className={cn("h-full bg-gradient-to-br pb-6 from-gray-100 to-gray-300 flex items-center justify-center", className)}>
            {/* iPhone frame */}
            <div className="relative w-[370px] max-h-[780px] h-full bg-black rounded-[40px] shadow-2xl border-4 border-black flex flex-col items-center overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-20" style={{ marginTop: 2 }} />
                {/* Speaker and camera dots in notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-30">
                    <div className="w-16 h-2 bg-gray-800 rounded-full" />
                    <div className="w-2 h-2 bg-gray-700 rounded-full" />
                </div>
                {/* Main content area inside device (no browser chrome) */}
                <div className="flex-1 w-full overflow-y-auto bg-card flex flex-col">
                    {/* Sticky header inside device */}
                    <header className="sticky top-0 z-20 bg-card border-b border-gray-200 flex items-center px-4 py-3">
                        <div className="flex-1 flex justify-center">
                            <Image
                                src="https://www.mystoredemo.io/f6e7f6d7efa9bdeb212d.svg"
                                alt="MyStore Logo"
                                width={80}
                                height={20}
                                className="object-contain"
                            />
                        </div>
                    </header>
                    {/* Main content */}
                    <main className="flex-1 flex flex-col px-2 pb-4 max-w-md w-full mx-auto">
                        {/* Order summary */}
                        <section className="bg-card text-foreground p-4 mt-4 mb-4">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order summary</h2>
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 rounded-md flex items-center justify-center mr-3 overflow-hidden border border-gray-200">
                                    <Image
                                        src="https://www.mystoredemo.io/1689f3f40b292d1de2c6.png"
                                        alt="Polo Shirt"
                                        width={48}
                                        height={48}
                                        className="object-cover bg-card"
                                    />
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm text-gray-800 font-medium block">Polo Shirt</span>
                                    <span className="text-xs text-gray-500">x 1</span>
                                </div>
                                <span className="text-sm text-gray-800">$199.00</span>
                            </div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-800">$199.00</span>
                            </div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Tax</span>
                                <span className="text-gray-800">$15.92</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold mt-2 pt-2 border-t border-gray-100">
                                <span className="text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-gray-900 block">$214.92</span>
                                    <span className="text-xs text-gray-500">USD</span>
                                </div>
                            </div>
                        </section>
                        {/* Payment form */}
                        <section className="bg-card text-foreground p-4 flex flex-col">
                            <h2 className="text-lg font-medium text-gray-900 mb-1">Complete your purchase</h2>
                            <p className="text-xs text-gray-500 mb-4">Enter your payment details below</p>
                            {children}

                            <div className="flex items-center justify-center mt-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-gray-500">Your payment is secured with industry-standard encryption</span>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-3">
                                        <span className="hover:text-gray-700 cursor-pointer">Terms</span>
                                        <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
                                        <span className="hover:text-gray-700 cursor-pointer">Contact</span>
                                    </div>
                                    <span className="text-xs font-medium text-blue-600">Powered by Adyen</span>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-2 rounded-full bg-gray-300 opacity-80 z-20" />
            </div>
        </div>
    );
};

export default CheckoutPageMobile; 