import { useState } from 'react';
import { FileText, Download, X, Image as ImageIcon } from 'lucide-react';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';

interface DownloadOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (options: any) => void;
}

export default function DownloadOptionsModal({ isOpen, onClose, onDownload }: DownloadOptionsModalProps) {
    const { profile } = useCompanyProfile();
    const [headerType, setHeaderType] = useState('default');
    const [customHeaderTitle, setCustomHeaderTitle] = useState('');
    const [customHeaderImage, setCustomHeaderImage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleDownload = () => {
        const options: any = {};
        if (headerType === 'custom_text') {
            options.headerTitle = customHeaderTitle;
        } else if (headerType === 'custom_image') {
            options.headerImage = customHeaderImage;
        } else if (headerType === 'company_header') {
            options.headerImage = profile?.pdfHeaderImage; // Use profile header if available
        }
        onDownload(options);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Download className="text-primary" size={24} /> Download Options
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Select Header Style</label>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => setHeaderType('default')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${headerType === 'default' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        >
                            <span className="font-bold block">Default Header</span>
                            <span className="text-xs text-muted-foreground">Standard "QUOTATION" title with Company Logo</span>
                        </button>

                        <button
                            onClick={() => setHeaderType('company_header')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${headerType === 'company_header' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        >
                            <span className="font-bold block">Company Header</span>
                            <span className="text-xs text-muted-foreground">Use the Header Image from Settings</span>
                            {!profile?.pdfHeaderImage && <span className="text-[10px] text-destructive block mt-1">No header image set in Settings</span>}
                        </button>

                        <button
                            onClick={() => setHeaderType('custom_text')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${headerType === 'custom_text' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        >
                            <span className="font-bold block">Custom Title</span>
                            <span className="text-xs text-muted-foreground">Use a custom text title (e.g. "PROPOSAL")</span>
                        </button>

                        <button
                            onClick={() => setHeaderType('custom_image')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${headerType === 'custom_image' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                        >
                            <span className="font-bold block">One-time Custom Header</span>
                            <span className="text-xs text-muted-foreground">Upload a specific header image for this download</span>
                        </button>
                    </div>

                    {headerType === 'custom_text' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-medium">Custom Title Text</label>
                            <input
                                value={customHeaderTitle}
                                onChange={(e) => setCustomHeaderTitle(e.target.value)}
                                className="w-full bg-muted border border-transparent rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter title..."
                            />
                        </div>
                    )}

                    {headerType === 'custom_image' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-medium">Upload Header Image</label>
                            <div className="relative w-full h-24 border-2 border-dashed border-muted-foreground/50 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setCustomHeaderImage(event.target?.result as string);
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
                                />
                                {customHeaderImage ? (
                                    <img src={customHeaderImage} alt="Header" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center p-2 text-center">
                                        <ImageIcon className="text-muted-foreground" size={20} />
                                        <span className="text-[10px] text-muted-foreground">Click to upload</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-primary text-black px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
