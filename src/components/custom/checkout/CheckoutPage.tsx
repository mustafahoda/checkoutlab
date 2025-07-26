import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutPageProps {
    children: React.ReactNode;
    className?: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col h-full rounded-t-lg rounded-b-xl text-foreground", className)}>
            <div className="flex flex-col md:flex-row h-full bg-card rounded-t-lg rounded-b-xl">
                {/* Browser chrome */}
                <div className="w-full shadow-xl border border-gray-200 bg-white flex flex-col rounded-t-lg rounded-b-xl">
                    {/* Browser toolbar */}
                    <div className="bg-background border-b border-gray-200 px-4 py-2 flex items-center rounded-t-lg">
                        {/* Window controls */}
                        <div className="flex space-x-2 mr-4">
                            <div className="w-2 h-2 rounded-full bg-warning"></div>
                            <div className="w-2 h-2 rounded-full bg-js"></div>
                            <div className="w-2 h-2 rounded-full bg-adyen"></div>
                        </div>

                        {/* URL bar */}
                        <div className="flex-1 bg-accent rounded-md border border-gray-300 px-3 py-1 flex items-center text-xs text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-gray-600">mystoredemo.io</span>
                        </div>

                        {/* Browser actions */}
                        <div className="ml-4 flex space-x-3 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Browser content */}
                    <div className="flex flex-col w-full h-full overflow-auto">
                        {/* Logo centered at the top */}
                        <div className="w-full flex justify-center items-center pt-4 pb-2 border-b border-gray-100">
                            <Link href="/" className="flex items-center justify-center">
                                <Image
                                    src="https://www.mystoredemo.io/f6e7f6d7efa9bdeb212d.svg"
                                    alt="MyStore Logo"
                                    width={90}
                                    height={20}
                                    className="object-contain"
                                />
                            </Link>
                        </div>
                        {/* Two-column layout */}
                        <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto p-4 md:p-8">
                            {/* Left side - Order summary (Stripe-like) */}
                            <div className="w-full md:w-3/5 bg-gray-50 p-6 flex flex-col rounded-l-lg">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Order summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 overflow-hidden border border-gray-200">
                                                    <Image
                                                        src="https://www.mystoredemo.io/1689f3f40b292d1de2c6.png"
                                                        alt="Polo Shirt"
                                                        width={40}
                                                        height={40}
                                                        className="object-cover bg-card"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-800 font-medium block">Polo Shirt</span>
                                                    <span className="text-xs text-gray-500">x 1</span>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-800">$199.00</span>
                                        </div>
                                        
                                        <div className="pt-3 mt-3 border-t border-gray-200">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="text-gray-800">$199.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-gray-500">Tax</span>
                                                <span className="text-gray-800">$15.92</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-3 mt-3 border-t border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-gray-900">Total</span>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-gray-900 block">$214.92</span>
                                                    <span className="text-xs text-gray-500">USD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right side - Payment component */}
                            <div className="w-full md:w-3/5 pt-2 flex flex-col bg-white rounded-r-lg">
                                <div className="max-w-md w-full">
                                    <h2 className="text-xl font-medium text-gray-900 mb-1">Complete your purchase</h2>
                                    <p className="text-sm text-gray-500 mb-6">Enter your payment details below</p>
                                        {children}
                                    <div className="mt-6">                                       
                                        <div className="flex items-center justify-center mt-4 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="text-xs text-gray-500">Your payment is secured with industry-standard encryption</span>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center space-x-4">
                                                    <span className="hover:text-gray-700 cursor-pointer">Terms</span>
                                                    <span className="hover:text-gray-700 cursor-pointer">Privacy</span>
                                                    <span className="hover:text-gray-700 cursor-pointer">Contact</span>
                                                </div>
                                                <span className="text-xs font-medium text-blue-600">Powered by Adyen</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 