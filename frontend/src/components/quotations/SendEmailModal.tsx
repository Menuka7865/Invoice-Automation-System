import { useState, useEffect } from 'react';
import { Send, X, Users, Mail, Check } from 'lucide-react';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (recipients: string[]) => void;
    customer: any; // Customer object
}

export default function SendEmailModal({ isOpen, onClose, onSend, customer }: SendEmailModalProps) {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen && customer) {
            const emails = [];
            if (customer.email) emails.push(customer.email);
            // Auto-select primary email
            setSelectedEmails(emails);
        }
    }, [isOpen, customer]);

    if (!isOpen) return null;

    const contacts = customer?.contactPersons || [];
    const mainEmail = customer?.email;

    const toggleEmail = (email: string) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(prev => prev.filter(e => e !== email));
        } else {
            setSelectedEmails(prev => [...prev, email]);
        }
    };

    const handleSend = () => {
        if (selectedEmails.length > 0) {
            onSend(selectedEmails);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Send className="text-primary" size={24} /> Send Quotation
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Select recipients for this quotation:</p>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {/* Main Company Email */}
                        {mainEmail && (
                            <div
                                onClick={() => toggleEmail(mainEmail)}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedEmails.includes(mainEmail) ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <BuildingIcon />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Main Contact</p>
                                        <p className="text-xs text-muted-foreground">{mainEmail}</p>
                                    </div>
                                </div>
                                {selectedEmails.includes(mainEmail) && <Check className="text-primary" size={20} />}
                            </div>
                        )}

                        {/* Contact Persons */}
                        {contacts.map((contact: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => toggleEmail(contact.email)}
                                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedEmails.includes(contact.email) ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{contact.designation}</p>
                                    </div>
                                </div>
                                {selectedEmails.includes(contact.email) && <Check className="text-primary" size={20} />}
                            </div>
                        ))}

                        {(!mainEmail && contacts.length === 0) && (
                            <div className="p-8 text-center text-muted-foreground">
                                No email contacts found for this customer.
                            </div>
                        )}
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
