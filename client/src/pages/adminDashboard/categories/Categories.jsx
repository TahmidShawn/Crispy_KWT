import {
    ArrowDown,
    ArrowUp,
    Edit,
    ImageOff,
    Plus,
    Save,
    Search,
    Trash2,
    Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useGet from "@/hooks/useGet";

export default function Categories() {
    const [search, setSearch] = useState("");
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [orderedCategories, setOrderedCategories] = useState([]);

    const {
        data: categoriesResponse,
        isLoading,
        refetch,
    } = useGet({
        url: "/admin/categories",
        queryKey: ["admin", "categories"],
    });

    const serverCategories = categoriesResponse?.data;

    useEffect(() => {
        setOrderedCategories(serverCategories || []);
    }, [serverCategories]);

    const isSearching = search.trim() !== "";

    const hasOrderChanged =
        !!serverCategories &&
        orderedCategories.length === serverCategories.length &&
        orderedCategories.some(
            (category, index) => category._id !== serverCategories[index]?._id,
        );

    const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
        mutationFn: async (categoryId) => {
            const response = await api.delete(
                `/admin/categories/${categoryId}`,
            );

            return response.data;
        },
        onSuccess: (response) => {
            toast.success(response?.message || "Category deleted successfully");

            setCategoryToDelete(null);
            refetch();
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to delete category",
            );
        },
    });

    const { mutate: saveOrder, isPending: isSavingOrder } = useMutation({
        mutationFn: async () => {
            const orders = orderedCategories.map((category, index) => ({
                categoryId: category._id,
                order: index,
            }));

            const response = await api.patch("/admin/categories/order", {
                orders,
            });

            return response.data;
        },
        onSuccess: (response) => {
            toast.success(
                response?.message || "Category order saved successfully",
            );

            refetch();
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to save category order",
            );
        },
    });

    const filteredCategories = orderedCategories.filter((category) => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return true;
        }

        return (
            category.name?.en?.toLowerCase().includes(searchValue) ||
            category.name?.ar?.toLowerCase().includes(searchValue) ||
            category.slug?.toLowerCase().includes(searchValue)
        );
    });

    const handleDelete = () => {
        if (!categoryToDelete) {
            return;
        }

        deleteCategory(categoryToDelete._id);
    };

    // direction: -1 = up, 1 = down
    const moveCategory = (index, direction) => {
        const targetIndex = index + direction;

        setOrderedCategories((prev) => {
            if (targetIndex < 0 || targetIndex >= prev.length) {
                return prev;
            }

            const next = [...prev];
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

            return next;
        });
    };

    const handleResetOrder = () => {
        setOrderedCategories(serverCategories || []);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Categories
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your cake categories. Use the arrows to
                            change the display order, then click Save Order.
                        </p>
                    </div>

                    <Button asChild  className="h-12 px-5">
                        <Link
                            to="/admin/categories/add"
                            className="flex items-center"
                        >
                            <Plus className="mr-2 size-4" />
                            Add Category
                        </Link>
                    </Button>
                </div>

                <div className="rounded-2xl border bg-background p-5">
                    <div className="relative max-w-md bg-card">
                        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search categories..."
                            className="h-12 rounded-xl pl-11 pr-4 text-[15px] shadow-none"
                        />
                    </div>

                    {isSearching && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Clear the search to reorder categories.
                        </p>
                    )}
                </div>

                <div className="overflow-hidden rounded-2xl border bg-card">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-12 w-[60px] px-5">
                                        #
                                    </TableHead>

                                    <TableHead className="h-12 w-[90px] px-5">
                                        Image
                                    </TableHead>

                                    <TableHead className="h-12 px-5">
                                        Category
                                    </TableHead>

                                    <TableHead className="h-12 px-5">
                                        Arabic
                                    </TableHead>

                                    <TableHead className="h-12 px-5">
                                        Slug
                                    </TableHead>

                                    <TableHead className="h-12 px-5">
                                        Status
                                    </TableHead>

                                    <TableHead className="h-12 px-5">
                                        Popular
                                    </TableHead>

                                    <TableHead className="h-12 px-5 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-32 text-center text-sm text-muted-foreground"
                                        >
                                            Loading categories...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-32 text-center text-sm text-muted-foreground"
                                        >
                                            {search
                                                ? "No categories found."
                                                : "No categories available."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCategories.map(
                                        (category, index) => (
                                            <TableRow
                                                key={category._id}
                                                className="hover:bg-muted/30"
                                            >
                                                <TableCell className="px-5 py-4">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {index + 1}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                                                        {category.imageUrl ? (
                                                            <img
                                                                src={
                                                                    category.imageUrl
                                                                }
                                                                alt={
                                                                    category
                                                                        .name
                                                                        ?.en ||
                                                                    "Category"
                                                                }
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageOff className="size-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <span className="font-medium">
                                                        {category.name?.en ||
                                                            "—"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <span
                                                        dir="rtl"
                                                        className="font-medium"
                                                    >
                                                        {category.name?.ar ||
                                                            "—"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <span className="text-sm text-muted-foreground">
                                                        {category.slug || "—"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <span
                                                        className={
                                                            category.isActive
                                                                ? "text-sm font-medium text-emerald-400"
                                                                : "text-sm font-medium text-muted-foreground"
                                                        }
                                                    >
                                                        {category.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <span
                                                        className={
                                                            category.isPopular
                                                                ? "text-sm font-medium text-emerald-400"
                                                                : "text-sm font-medium text-muted-foreground"
                                                        }
                                                    >
                                                        {category.isPopular
                                                            ? "Yes"
                                                            : "No"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-10 cursor-pointer"
                                                            disabled={
                                                                isSearching ||
                                                                isSavingOrder ||
                                                                index === 0
                                                            }
                                                            onClick={() =>
                                                                moveCategory(
                                                                    index,
                                                                    -1,
                                                                )
                                                            }
                                                            aria-label={`Move ${
                                                                category.name
                                                                    ?.en ||
                                                                "category"
                                                            } up`}
                                                        >
                                                            <ArrowUp className="size-4" />
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-10 cursor-pointer"
                                                            disabled={
                                                                isSearching ||
                                                                isSavingOrder ||
                                                                index ===
                                                                    orderedCategories.length -
                                                                        1
                                                            }
                                                            onClick={() =>
                                                                moveCategory(
                                                                    index,
                                                                    1,
                                                                )
                                                            }
                                                            aria-label={`Move ${
                                                                category.name
                                                                    ?.en ||
                                                                "category"
                                                            } down`}
                                                        >
                                                            <ArrowDown className="size-4" />
                                                        </Button>

                                                        <Link
                                                            to={`/admin/categories/${category._id}`}
                                                            aria-label={`Edit ${category.name?.en || "category"}`}
                                                            className="inline-flex size-10 items-center justify-center rounded-lg border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <Edit className="size-4" />
                                                        </Link>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            onClick={() =>
                                                                setCategoryToDelete(
                                                                    category,
                                                                )
                                                            }
                                                            aria-label={`Delete ${
                                                                category.name
                                                                    ?.en ||
                                                                "category"
                                                            }`}
                                                            className="size-10 rounded-lg cursor-pointer text-white bg-primary hover:bg-red-500 hover:text-white"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {!isLoading && orderedCategories.length > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredCategories.length} of{" "}
                            {orderedCategories.length} categories
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {hasOrderChanged && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 px-5"
                                    disabled={isSavingOrder}
                                    onClick={handleResetOrder}
                                >
                                    <Undo2 className="mr-2 size-4" />
                                    Discard
                                </Button>
                            )}

                            <Button
                                type="button"
                                className="h-12 px-5"
                                disabled={!hasOrderChanged || isSavingOrder}
                                onClick={() => saveOrder()}
                            >
                                <Save className="mr-2 size-4" />
                                {isSavingOrder ? "Saving..." : "Save Order"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog
                open={!!categoryToDelete}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setCategoryToDelete(null);
                    }
                }}
            >
                <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md border-blush border gap-0 rounded-2xl p-6 sm:p-7">
                    <AlertDialogHeader className="space-y-2 text-left">
                        <AlertDialogTitle className="text-lg font-semibold tracking-tight">
                            Delete category?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {categoryToDelete?.name?.en}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-7 bg-blush/50 flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="mt-0 h-10 rounded-xl px-5"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={isDeleting}
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete();
                            }}
                            className="h-10 rounded-xl bg-red-500 text-white px-5 hover:bg-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
