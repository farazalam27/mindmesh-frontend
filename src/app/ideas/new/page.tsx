'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ideaSchema, type IdeaFormData } from '@/lib/validations';
import { ideasService } from '@/lib/api';
import Link from 'next/link';

const categoryOptions = [
  { value: 'innovation', label: 'Innovation' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'problem_solving', label: 'Problem Solving' },
  { value: 'cost_saving', label: 'Cost Saving' },
  { value: 'revenue_generation', label: 'Revenue Generation' },
  { value: 'other', label: 'Other' },
];

function NewIdeaContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true);
    try {
      // Convert form data to API format
      const ideaData = {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
      };

      console.log('Submitting idea:', ideaData);
      
      // Call the real API
      const response = await ideasService.createIdea(ideaData);
      console.log('Idea created:', response);
      
      router.push('/ideas');
    } catch (error) {
      console.error('Error creating idea:', error);
      // You could add error state here to show user the error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/ideas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ideas
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Idea</h1>
        <p className="text-gray-600">
          Share your innovative ideas with the team and help drive positive change
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Idea Details</CardTitle>
          <CardDescription>
            Provide clear and detailed information about your idea
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Brief, descriptive title for your idea"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your idea, including the problem it solves and potential benefits"
                rows={6}
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                onValueChange={(value) => setValue('category', value as any)}
                value={selectedCategory}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., technology, automation, productivity)"
                {...register('tags')}
                className={errors.tags ? 'border-red-500' : ''}
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help others discover your idea
              </p>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Submission Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be clear and concise in your title and description</li>
                <li>• Explain the problem your idea solves</li>
                <li>• Include potential benefits and impact</li>
                <li>• Consider implementation feasibility</li>
                <li>• Use relevant tags to improve discoverability</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Submit Idea
                  </>
                )}
              </Button>
              <Link href="/ideas">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewIdeaPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <NewIdeaContent />
    </ProtectedRoute>
  );
}