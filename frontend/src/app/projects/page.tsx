"use client";

import { useState } from "react";
import { Plus, Search, Loader2, Edit2, Trash2, Briefcase, User, FileText, Calendar, MoreVertical } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useProjects } from '@/hooks/useProjects';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuotations } from '@/hooks/useInvoices';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
    const { customers } = useCustomers();
    const { quotations } = useQuotations();
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const selectedCustomerId = watch('customer');
    const filteredQuotationsForCustomer = quotations.filter((q: any) => {
        const customerId = typeof q.customer === 'object' ? q.customer?._id : q.customer;
        return customerId === selectedCustomerId;
    });

    const filteredProjects = projects.filter((p: any) =>
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (data: any) => {
        await createProject(data);
        setIsModalOpen(false);
        reset();
    };

    const handleUpdate = async (data: any) => {
        if (editingId) {
            await updateProject(editingId, data);
            setEditingId(null);
        }
        setIsModalOpen(false);
        reset();
    };

    const handleEdit = (project: any) => {
        setEditingId(project._id);
        setValue('name', project.name);
        setValue('description', project.description);
        setValue('customer', project.customer?._id || project.customer);
        setValue('quotation', project.quotation?._id || project.quotation);
        setValue('status', project.status);
        setValue('startDate', project.startDate);
        setValue('endDate', project.endDate);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'planned': return 'bg-blue-500/10 text-blue-500';
            case 'ongoing': return 'bg-amber-500/10 text-amber-500';
            case 'completed': return 'bg-emerald-500/10 text-emerald-500';
            case 'on hold': return 'bg-rose-500/10 text-rose-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage and track your projects and their association with customers.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Add Project
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by project name or customer..."
                        className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-bold">Fetching projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-[2.5rem]">
                        <p className="font-bold">No projects found.</p>
                    </div>
                ) : filteredProjects.map((project: any) => (
                    <div key={project._id} className="bg-card p-6 rounded-3xl border shadow-sm hover:border-primary/40 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Briefcase size={24} />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => deleteProject(project._id)}
                                    className="p-2 hover:bg-destructive/10 rounded-full text-destructive transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{project.name}</h3>
                                <div className={`inline-block px-2 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                                {project.description || 'No description provided.'}
                            </p>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={14} className="text-primary" />
                                    <span className="font-medium">{project.customer?.name || 'Unknown Customer'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText size={14} className="text-primary" />
                                    <span className="text-muted-foreground">
                                        Quote: QT-{project.quotation?._id?.slice(-6).toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={14} className="text-primary" />
                                    <span className="text-muted-foreground">
                                        {project.startDate ? formatDate(project.startDate) : 'No start date'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    reset();
                }}
                title={editingId ? 'Edit Project' : 'Add New Project'}
            >
                <form onSubmit={handleSubmit(editingId ? handleUpdate : handleCreate)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Project Name</label>
                        <input {...register('name')} required type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Website Redesign" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea {...register('description')} className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Brief project overview..." />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Customer</label>
                            <select {...register('customer')} required className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="">Select Customer</option>
                                {customers.map((c: any) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="space-y-1">
                            <label className="text-sm font-medium">Quotation</label>
                            <select {...register('quotation')} required className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" disabled={!selectedCustomerId}>
                                <option value="">Select Quotation</option>
                                {filteredQuotationsForCustomer.map((q: any) => (
                                    <option key={q._id} value={q._id}>QT-{q._id?.slice(-6).toUpperCase()} - {formatCurrency(q.total)}</option>
                                ))}
                            </select>
                        </div> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Status</label>
                            <select {...register('status')} className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="Planned">Planned</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Start Date</label>
                            <input {...register('startDate')} type="date" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">End Date</label>
                            <input {...register('endDate')} type="date" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                        <button type="button" onClick={() => {
                            setIsModalOpen(false);
                            setEditingId(null);
                            reset();
                        }} className="order-2 sm:order-1 flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
                        <button type="submit" className="order-1 sm:order-2 flex-1 py-3 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            {editingId ? 'Update' : 'Create'} Project
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
