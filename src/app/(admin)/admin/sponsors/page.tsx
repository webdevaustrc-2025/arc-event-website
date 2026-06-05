"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  PageHeader,
  DataTable,
  CreateEditDialog,
  useAdminData,
  useAdminDialog,
  FormField,
  SelectField,
  TextareaField,
} from "@/components/SharedAdminPanel";
import type { TableColumn } from "@/components/SharedAdminPanel/types/admin";

interface Sponsor {
  id: number;
  name: string;
  description?: string;
  category?: string;
  logoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
}

export default function AdminSponsorsPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: sponsors,
    loading,
    tableState,
    setPage,
    search,
    refetch,
    createItem,
    updateItem,
    deleteItem,
  } = useAdminData<Sponsor>({
    endpoint: "/api/admin/sponsors",
    pageSize: 10,
  });

  const dialog = useAdminDialog();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  const columns: TableColumn<Sponsor>[] = [
    {
      key: "name",
      label: "Name",
      width: "200px",
    },
    {
      key: "category",
      label: "Category",
      width: "150px",
      render: (value) => value || "—",
    },
    {
      key: "description",
      label: "Description",
      width: "250px",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      width: "150px",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (sponsor: Sponsor) => {
    dialog.open("edit", sponsor);
    setFormData({
      name: sponsor.name,
      category: sponsor.category,
      description: sponsor.description,
      websiteUrl: sponsor.websiteUrl,
      logoUrl: sponsor.logoUrl,
    });
  };

  const handleDelete = async (sponsor: Sponsor) => {
    try {
      await deleteItem(sponsor.id);
      toast.success("Sponsor deleted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete sponsor";
      toast.error(message);
    }
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (dialog.mode === "create") {
        await createItem(formData);
        toast.success("Sponsor created successfully");
      } else if (dialog.data?.id) {
        await updateItem(dialog.data.id, formData);
        toast.success("Sponsor updated successfully");
      }
      dialog.close();
      setFormData({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save sponsor";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;
  if (status === "loading") return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsors"
        subtitle={`Manage ${sponsors.length} sponsors`}
        showSearch
        searchPlaceholder="Search sponsors..."
        onSearch={search}
        actionButton={{
          label: "Add Sponsor",
          onClick: () => {
            dialog.open("create");
            setFormData({});
          },
        }}
      />

      <DataTable<Sponsor>
        columns={columns}
        data={sponsors}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          page: tableState.page,
          limit: tableState.limit,
          total: 0, // Update with actual total from useAdminData
          totalPages: 0,
        }}
        onPageChange={setPage}
      />

      <CreateEditDialog
        isOpen={dialog.isOpen}
        title={dialog.mode === "create" ? "Create Sponsor" : "Edit Sponsor"}
        onClose={() => {
          dialog.close();
          setFormData({});
        }}
        onSubmit={handleDialogSubmit}
        isLoading={isSubmitting}
        submitButtonText={dialog.mode === "create" ? "Create" : "Update"}
      >
        <div className="space-y-4">
          <FormField
            label="Sponsor Name"
            name="name"
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter sponsor name"
          />
          
          <SelectField
            label="Category"
            name="category"
            value={formData.category || ""}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={[
              { label: "Platinum", value: "platinum" },
              { label: "Gold", value: "gold" },
              { label: "Silver", value: "silver" },
              { label: "Bronze", value: "bronze" },
            ]}
          />

          <TextareaField
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter sponsor description"
          />

          <FormField
            label="Website URL"
            name="websiteUrl"
            type="url"
            value={formData.websiteUrl || ""}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            placeholder="https://example.com"
          />

          <FormField
            label="Logo URL"
            name="logoUrl"
            type="url"
            value={formData.logoUrl || ""}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </CreateEditDialog>
    </div>
  );
}
