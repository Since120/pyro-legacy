// apps/dashboard/src/components/dashboard/category-management/CategoryManagement.tsx
'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PlusCircle, Search } from 'lucide-react';

// Komponenten
import StatCards from './components/StatCards';
import CategoryList from './components/CategoryList';
import CategoryModal from './components/CategoryModal';
import ZoneModal from './components/ZoneModal';
import CategoryErrorBoundary from './CategoryErrorBoundary';

// Hooks
import { useCategories, EnhancedCategory } from './hooks/useCategories';
import { useZones, ZoneInput } from './hooks/useZones';
import { useRoles } from './hooks/useRoles';
import { EnhancedZone } from './hooks/useCategories';

const CategoryManagement: React.FC = () => {
  // State für Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<EnhancedCategory | null>(null);
  const [currentZone, setCurrentZone] = useState<EnhancedZone | null>(null);

  // State für Lösch-Dialoge
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // State für Zonen-Lösch-Dialog
  const [showDeleteZoneDialog, setShowDeleteZoneDialog] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

  // Hooks
  const {
    categories,
    loading: categoriesLoading,
    expandedCategories,
    searchQuery,
    setSearchQuery,
    toggleCategoryExpand,
    saveCategory,
    updateCategoryWithZones,
    deleteCategory,
    getTotalStats,
    refetch: refetchCategories
  } = useCategories();

  const { roles } = useRoles();
  const { saveZone, deleteZone } = useZones(
    currentCategory?.id || undefined,
    updateCategoryWithZones
  );

  // Statistiken
  const stats = getTotalStats();

  // Modal Handler
  const handleOpenCategoryModal = (category: EnhancedCategory | null = null) => {
    setCurrentCategory(category);
    setShowCategoryModal(true);
  };

  // Kategorie-Lösch-Dialog Handler
  const handleOpenDeleteCategoryDialog = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Verhindert, dass die Kategorie aufgeklappt wird
    setCategoryToDelete(categoryId);
    setDeleteErrorMessage(null);
    setShowDeleteCategoryDialog(true);
  };

  const handleCloseDeleteCategoryDialog = () => {
    setShowDeleteCategoryDialog(false);
    setCategoryToDelete(null);
    setDeleteErrorMessage(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const result = await deleteCategory(categoryToDelete);

    if (result.success) {
      handleCloseDeleteCategoryDialog();
    } else {
      setDeleteErrorMessage(result.message || 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  // Zonen-Lösch-Dialog Handler
  const handleOpenDeleteZoneDialog = (zoneId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Verhindert, dass die Kategorie aufgeklappt wird
    setZoneToDelete(zoneId);
    setShowDeleteZoneDialog(true);
  };

  const handleCloseDeleteZoneDialog = () => {
    setShowDeleteZoneDialog(false);
    setZoneToDelete(null);
  };

  const handleConfirmDeleteZone = async () => {
    if (!zoneToDelete) return;

    const success = await deleteZone(zoneToDelete);

    if (success) {
      handleCloseDeleteZoneDialog();
    }
  };

  const handleOpenZoneModal = (categoryId: string, zoneId?: string) => {
    const foundCategory = categories.find(cat => cat.id === categoryId);
    if (!foundCategory) return;

    setCurrentCategory(foundCategory);

    if (zoneId) {
      const foundZone = foundCategory.zones.find(zone => zone.id === zoneId);
      setCurrentZone(foundZone || null);
    } else {
      setCurrentZone(null);
    }

    setShowZoneModal(true);
  };

  const handleSaveCategory = async (categoryData: any) => {
    const result = await saveCategory(categoryData);
    if (result) {
      setShowCategoryModal(false);
    }
    return result;
  };

  const handleSaveZone = async (zoneData: ZoneInput) => {
    const result = await saveZone(zoneData);
    if (result) {
      setShowZoneModal(false);
    }
    return result;
  };

  const handleZoneDelete = (zoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenDeleteZoneDialog(zoneId, e);
  };

  return (
    <CategoryErrorBoundary>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Page Header with Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Kategorien & Zonen Manager
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={18} />}
              onClick={() => handleOpenCategoryModal()}
            >
              Neue Kategorie
            </Button>
          </Box>

          {/* Stats Summary */}
          <StatCards
            categoriesCount={stats.totalCategories}
            totalUsers={stats.totalUsers}
            totalTime={stats.totalTime}
          />

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Suche nach Kategorie oder Zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>

          {/* Categories List */}
          <CategoryList
            categories={categories}
            expandedCategories={expandedCategories}
            loading={categoriesLoading}
            onToggleExpand={toggleCategoryExpand}
            onEditCategory={handleOpenCategoryModal}
            onDeleteCategory={handleOpenDeleteCategoryDialog}
            onAddZone={(categoryId) => handleOpenZoneModal(categoryId)}
            onEditZone={(categoryId, zoneId) => handleOpenZoneModal(categoryId, zoneId)}
            onDeleteZone={handleZoneDelete}
          />
        </Container>

        {/* Category Modal */}
        <CategoryModal
          open={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleSaveCategory}
          category={currentCategory}
          availableRoles={roles}
        />

        {/* Zone Modal */}
        <ZoneModal
          open={showZoneModal}
          onClose={() => setShowZoneModal(false)}
          onSave={handleSaveZone}
          zone={currentZone}
          categoryId={currentCategory?.id || ''}
          categoryName={currentCategory?.name || ''}
        />

        {/* Delete Category Dialog */}
        <Dialog
          open={showDeleteCategoryDialog}
          onClose={handleCloseDeleteCategoryDialog}
          aria-labelledby="delete-category-dialog-title"
        >
          <DialogTitle id="delete-category-dialog-title">
            Kategorie löschen
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Möchten Sie diese Kategorie wirklich löschen?
            </DialogContentText>
            {deleteErrorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {deleteErrorMessage}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteCategoryDialog} color="primary">
              Abbrechen
            </Button>
            <Button onClick={handleConfirmDeleteCategory} color="error">
              Löschen
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Zone Dialog */}
        <Dialog
          open={showDeleteZoneDialog}
          onClose={handleCloseDeleteZoneDialog}
          aria-labelledby="delete-zone-dialog-title"
        >
          <DialogTitle id="delete-zone-dialog-title">
            Zone löschen
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Möchten Sie diese Zone wirklich löschen?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteZoneDialog} color="primary">
              Abbrechen
            </Button>
            <Button onClick={handleConfirmDeleteZone} color="error">
              Löschen
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CategoryErrorBoundary>
  );
};

export default CategoryManagement;