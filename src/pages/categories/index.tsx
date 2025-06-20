import { useState, useEffect } from 'react';
import { useData } from "@/context/DataContext";
import { request } from "@/lib/request";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Category {
    _id: string;
    name: string;
    description?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const { getCurrentUser } = useData();

    const fetchCategories = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await request<Category[]>({
            url: '/category/getAllCategories',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        });
        if (response && response.data) {
            setCategories(response.data);
        }
    };

    useEffect(() => {
        if (getCurrentUser()) fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentUser]);

    const handleAddCategory = async () => {
        const response = await request<Category>({
            url: '/category/addCategory',
            method: 'POST',
            data: {
                newCategory
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        }, {
            successMessage: 'Category added successfully',
            errorMessage: 'Failed to add category'
        });

        if (response) {
            setCategories([...categories, response]);
            setIsAddDialogOpen(false);
            setNewCategory({ name: '', description: '' });
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;

        const response = await request<Category>({
            url: `/category/updateCategory`,
            method: 'POST',
            data: {
                selectedCategory
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        }, {
            successMessage: 'Category updated successfully',
            errorMessage: 'Failed to update category'
        });

        if (response) {
            setCategories(categories.map(cat =>
                cat._id === response._id ? response : cat
            ));
            setIsEditDialogOpen(false);
            setSelectedCategory(null);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        const response = await request({
            url: `/category/deleteCategory/${categoryId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        }, {
            successMessage: 'Category deleted successfully',
            errorMessage: 'Failed to delete category'
        });

        if (response) {
            setCategories(categories.filter(cat => cat._id !== categoryId));
        }
        setCategoryToDelete(null);
    };

    if (getCurrentUser()?.role !== 'admin') {
        return <div className="p-4">Access denied. Admin privileges required.</div>;
    }

    return (
        <div className="relative container mx-auto p-4 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">Categories</h1>
            </div>

            {(!categories || categories.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-lg">No categories found. Add your first category!</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(Array.isArray(categories) ? categories : []).map((category) => (
                        <div
                            key={category._id}
                            className="relative backdrop-blur-md bg-white/10 border border-blue-400/30 rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.03] hover:shadow-blue-500/30 group overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-blue-600/80 hover:text-white focus:ring-2 focus:ring-blue-400"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsEditDialogOpen(true);
                                    }}
                                    title="Edit"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-red-600 hover:text-white"
                                    onClick={() => setCategoryToDelete(category)}
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 drop-shadow">{category.name}</h3>
                            {category.description && (
                                <p className="text-blue-100 text-base mb-2 drop-shadow-sm">{category.description}</p>
                            )}
                            <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10" style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Add Category Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <button
                        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                        title="Add Category"
                    >
                        <Plus className="w-6 h-6" />
                        Add Category
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label>Name</label>
                            <Input
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Description</label>
                            <Input
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                placeholder="Category description"
                            />
                        </div>
                        <Button onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">Add Category</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label>Name</label>
                            <Input
                                value={selectedCategory?.name || ''}
                                onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Description</label>
                            <Input
                                value={selectedCategory?.description || ''}
                                onChange={(e) => setSelectedCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                                placeholder="Category description"
                            />
                        </div>
                        <Button onClick={handleUpdateCategory} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">Update Category</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            {categoryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-[#181f2a] rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4 text-white">Delete Category</h2>
                        <p className="mb-6 text-gray-300">Are you sure you want to delete <span className="font-semibold text-red-400">{categoryToDelete.name}</span>? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
                                onClick={() => handleDeleteCategory(categoryToDelete._id)}
                            >
                                Yes, Delete
                            </Button>
                            <Button
                                variant="outline"
                                className="px-6 border-gray-500 text-gray-200 hover:bg-gray-700"
                                onClick={() => setCategoryToDelete(null)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
