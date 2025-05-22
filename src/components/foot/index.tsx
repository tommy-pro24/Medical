
import React from 'react';
import { Copyright, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-sidebar border-t border-border px-6 py-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">SSB Medical</h3>
                        <p className="text-sm text-sidebar-foreground/80">
                            Providing medical supplies and equipment to healthcare facilities since 2005.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
                            <Copyright className="h-4 w-4" />
                            <span>2025 SSB Medical. All rights reserved.</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/inventory" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                                    Inventory
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-sidebar-foreground/80 hover:text-primary transition-colors">
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
                                <Mail className="h-4 w-4" />
                                <span>support@ssbmedical.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
