"use client";

import { useState, useEffect } from 'react';
import { projectsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await projectsAPI.list();
            setProjects(data);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData: any) => {
        try {
            const { data } = await projectsAPI.create(projectData);
            // Fetch projects again to get populated data
            await fetchProjects();
            toast.success('Project added');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create project');
        }
    };

    const updateProject = async (id: string, projectData: any) => {
        try {
            const { data } = await projectsAPI.update(id, projectData);
            // Fetch projects again to get populated data
            await fetchProjects();
            toast.success('Project updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update project');
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await projectsAPI.delete(id);
            setProjects((prev) => prev.filter((p: any) => p._id !== id));
            toast.success('Project deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return { projects, loading, fetchProjects, createProject, updateProject, deleteProject };
}
