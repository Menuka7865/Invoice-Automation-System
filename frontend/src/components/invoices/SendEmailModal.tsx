import { useState, useEffect } from 'react';
import { Send, X, Users, Mail, Check } from 'lucide-react';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (recipients: string[], options: { includeButtons: boolean }) => void;
    customer: any; // Customer object
}

export default function SendEmailModal({ isOpen, onClose, onSend, customer }: SendEmailModalProps) {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [includeButtons, setIncludeButtons] = useState(true);

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen && customer) {
            const emails = [];
            if (customer.email) emails.push(customer.email);
            // Auto-select primary email
            setSelectedEmails(emails);
            setIncludeButtons(true);
        }
    }, [isOpen, customer]);

    if (!isOpen) return null;

    const contacts = customer?.contacts || [];
    const mainEmail = customer?.email;
    const allEmails = [mainEmail, ...contacts.map((c: any) => c.email)].filter(Boolean);

    const toggleEmail = (email: string) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(prev => prev.filter(e => e !== email));
        } else {
            setSelectedEmails(prev => [...prev, email]);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedEmails(allEmails);
        } else {
            setSelectedEmails([]);
        }
    };

    const handleSend = () => {
        if (selectedEmails.length > 0) {
            onSend(selectedEmails, { includeButtons });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Send className="text-primary" size={24} /> Send Invoice
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-bold">Recipients</p>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                            <input
                                type="checkbox"
                                checked={selectedEmails.length === allEmails.length && allEmails.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            Select All
                        </label>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                        {/* Main Company Email */}
                        {mainEmail && (
                            <div
                                onClick={() => toggleEmail(mainEmail)}
                                className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedEmails.includes(mainEmail) ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <BuildingIcon />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-xs truncate">Main Contact</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{mainEmail}</p>
                                    </div>
                                </div>
                                {selectedEmails.includes(mainEmail) && <Check className="text-primary" size={16} />}
                            </div>
                        )}

                        {/* Contact Persons */}
                        {contacts.map((contact: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => toggleEmail(contact.email)}
                                className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedEmails.includes(contact.email) ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Users size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-xs truncate">{contact.name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{contact.email}</p>
                                    </div>
                                </div>
                                {selectedEmails.includes(contact.email) && <Check className="text-primary" size={16} />}
                            </div>
                        ))}

                        {(!mainEmail && contacts.length === 0) && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No email contacts found.
                            </div>
                        )}
                    </div>

                    {/* Options Section */}
                    {/* Note: Invoices might not need approval buttons like Quotations, 
                        but we keep the structure for consistency. If not needed, 
                        front-end logic will just pass it through. */}
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-sm font-bold">Email Options</p>
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeButtons}
                                onChange={(e) => setIncludeButtons(e.target.checked)}
                                className="w-5 h-5 rounded-md border-gray-300 text-primary focus:ring-primary"
                            />
                            <div>
                                <p className="text-sm font-bold">Include Interactive Elements</p>
                                <p className="text-[10px] text-muted-foreground">Add relevant links and actions to the email.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={selectedEmails.length === 0}
                        className="bg-primary disabled:opacity-50 text-black px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Send size={16} /> Send Email ({selectedEmails.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

function BuildingIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
    )
}
