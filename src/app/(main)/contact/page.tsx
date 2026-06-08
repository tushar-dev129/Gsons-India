"use client";

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquareText, ShieldCheck } from "lucide-react";
import { sendContactEmail } from '@/services/contactApi';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export default function ContactPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const contactData = {
                name: formData.name,
                email: formData.email,
                message: formData.message
            };

            await sendContactEmail(contactData);
            toast.success("Message sent successfully!");
            setFormData({ name: '', email: user ? user.email : '', message: '' });
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: <Phone className="w-5 h-5" />, title: "Archive Line", details: "+91 98779 17738", link: "tel:+919877917738", desc: "Mon—Sat, 10am—8pm" },
        { icon: <Mail className="w-5 h-5" />, title: "Digital Dossier", details: "indiagsons@gmail.com", link: "mailto:indiagsons@gmail.com", desc: "Response within 24h" },
        { icon: <MapPin className="w-5 h-5" />, title: "The Studio", details: "Batala, Punjab, India", link: "https://maps.google.com", desc: "Flagship Showroom" },
    ];

    return (
        <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-48 relative overflow-hidden">
            {/* Pattern Accent */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    {/* Left: Brand Narrative & Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-slate-900/5 text-[9px]    text-slate-400 border border-slate-900/10 rounded-full">
                                Concierge Inquiry
                            </span>
                            <h1 className="text-4xl md:text-5xl  text-slate-900 leading-none font-display ">
                                Begin the <br />
                                <span className="text-primary italic">Dialogue.</span>
                            </h1>
                            <p className="text-slate-500 text-[13px] leading-relaxed font-medium max-w-lg pt-2">
                                Whether you're a professional specifier or a private collector, our architectural advisors are available for technical consultation and bespoke lighting solutions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contactInfo.map((info, i) => (
                                <a
                                    href={info.link}
                                    key={i}
                                    className="p-8 bg-white/40 backdrop-blur-md rounded-4xl border border-slate-100 shadow-luxe transition-all duration-500 hover:bg-white hover:-translate-y-2 hover:shadow-luxe-lg group"
                                >
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {info.icon}
                                    </div>
                                    <h4 className="text-[10px]    text-slate-900 mb-1">{info.title}</h4>
                                    <p className="text-sm  text-slate-900 truncate">{info.details}</p>
                                    <p className="text-[9px]    text-slate-400 mt-2">{info.desc}</p>
                                </a>
                            ))}

                            {/* WhatsApp Special Access */}
                            <a
                                href="https://wa.me/9877917738"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-8 bg-primary text-white rounded-4xl shadow-luxe-lg transition-all duration-500 hover:bg-primary/90 hover:-translate-y-2 group"
                            >
                                <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6">
                                    <MessageSquareText className="w-6 h-6" />
                                </div>
                                <h4 className="text-[10px]    text-white/70 mb-1">Instant Liaison</h4>
                                <p className="text-sm font-semibold opacity-100">WhatsApp Priority</p>
                                <span className="inline-flex items-center gap-2 text-[9px]    text-white mt-4 group-hover:gap-4 transition-all">
                                    Initialize Chat <Send className="w-3 h-3" />
                                </span>
                            </a>
                        </div>

                        <div className="p-8 bg-white rounded-4xl border border-slate-50 shadow-luxe flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-[10px]    text-slate-900">Professional Verification</h4>
                                <p className="text-xs text-slate-500 font-medium">All technical inquiries are handled by our certified lighting engineers.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Architectural Inquiry Form */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                        <div className="bg-white p-10 md:p-12 rounded-4xl border border-slate-100 shadow-luxe-lg sticky top-32">
                            <div className="mb-8">
                                <h3 className="text-2xl  text-slate-900 font-display  ">Technical Inquiry</h3>
                                <p className="text-slate-400 text-[10px]    mt-2"> Initialization</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px]    text-slate-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Identification"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all  text-xs   text-slate-900 placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px]    text-slate-400 ml-1">Email Coordinates</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Digital Address"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all  text-xs   text-slate-900 placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px]    text-slate-400 ml-1">Inquiry Narrative</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Detail your architectural requirements..."
                                        rows={5}
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all  text-xs   text-slate-900 placeholder:text-slate-200 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white p-6 py-3 rounded-2xl text-[13px] hover:bg-primary/90 transition-all focus:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
                                    disabled={loading}
                                >
                                    {loading ? 'Transmitting...' : (
                                        <>
                                            Submit 
                                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
