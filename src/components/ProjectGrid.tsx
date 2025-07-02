import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ProjectCard, LoadingSpinner, ErrorMessage } from '@/shared/components';

interface Project {
  id: number;
  title: string;
  description: string;
  category: 'web' | 'mobile' | '3d' | 'animation' | 'illustration';
  technologies: string[];
  image_url?: string;
  video_url?: string;
  model_url?: string;
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectGridProps {
  className?: string;
  category?: string;
  limit?: number;
  featuredOnly?: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  className = '',
  category,
  limit,
  featuredOnly = false,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/projects`;

        if (featuredOnly) {
          url += '/featured';
        } else if (category) {
          url += `/category/${category}`;
        }

        const response = await axios.get(url);

        if (response.data.success) {
          let projectData = response.data.data;

          // Apply limit if specified
          if (limit) {
            projectData = projectData.slice(0, limit);
          }

          setProjects(projectData);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category, limit, featuredOnly]);

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <LoadingSpinner size='lg' color='primary' />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              image={project.image_url}
              imageAlt={project.title}
              category={project.category}
              technologies={project.technologies}
              links={{
                live: project.live_url,
                github: project.github_url,
                demo: project.video_url || project.model_url,
              }}
              featured={project.featured}
              onClick={() => handleProjectClick(project.id)}
            />
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-lg mb-2'>No projects found</div>
          <p className='text-gray-500'>
            {category
              ? `No projects in the "${category}" category yet.`
              : featuredOnly
                ? 'No featured projects available.'
                : 'No projects available yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
