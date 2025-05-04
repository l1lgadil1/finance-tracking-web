import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { accountTypeApi, AccountType } from '@/entities/account/api/accountTypeApi';

interface AccountTypeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChanged?: () => void;
}

// Placeholder for toast/snackbar
const showToast = (msg: string) => alert(msg);

export const AccountTypeManagerModal: React.FC<AccountTypeManagerModalProps> = ({ isOpen, onClose, onChanged }) => {
  const [types, setTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newType, setNewType] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await accountTypeApi.getAll();
      setTypes(res);
    } catch {
      setError('Failed to load types');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchTypes();
  }, [isOpen]);

  useEffect(() => {
    if (editId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.trim()) return;
    try {
      await accountTypeApi.create({ name: newType });
      setNewType('');
      fetchTypes();
      onChanged?.();
      showToast('Type added');
    } catch {
      setError('Failed to add type');
      showToast('Failed to add type');
    }
  };

  const handleEdit = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      await accountTypeApi.update(id, { name: editValue });
      setEditId(null);
      setEditValue('');
      fetchTypes();
      onChanged?.();
      showToast('Type updated');
    } catch {
      setError('Failed to update type');
      showToast('Failed to update type');
    }
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') handleEdit(id);
    if (e.key === 'Escape') { setEditId(null); setEditValue(''); }
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await accountTypeApi.delete(id);
      fetchTypes();
      onChanged?.();
      showToast('Type deleted');
    } catch {
      setDeleteError('Cannot delete type: it may be in use.');
      showToast('Cannot delete type: it may be in use.');
    }
    setDeleteId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Account Types">
      <p className="text-gray-500 text-sm mb-2">Add, rename, or delete account types for your records.</p>
      <div className="divide-y divide-gray-200 bg-background rounded-lg p-2 min-h-[400px] max-h-[80vh] overflow-y-auto">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ul>
            {types.length === 0 && <li className="py-4 text-center text-gray-400">No types found. Add your first type below!</li>}
            {types.map((type) => (
              <li
                key={type.id}
                className="flex items-center justify-between py-2 px-2 rounded hover:bg-gray-100 transition group"
              >
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="type">🏷️</span>
                  {editId === type.id ? (
                    <input
                      ref={editInputRef}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => handleEditKey(e, type.id)}
                      className="border rounded px-2 py-1"
                      aria-label="Edit type name"
                    />
                  ) : (
                    <span>{type.name}</span>
                  )}
                </span>
                <div className="flex gap-1">
                  {editId === type.id ? (
                    <>
                      <Button size="sm" onClick={() => handleEdit(type.id)} aria-label="Save">Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => { setEditId(null); setEditValue(''); }} aria-label="Cancel">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => { setEditId(type.id); setEditValue(type.name); }} aria-label="Edit">Edit</Button>
                      <Button size="sm" variant="secondary" onClick={() => setDeleteId(type.id)} aria-label="Delete">Delete</Button>
                    </>
                  )}
                </div>
                {/* Delete confirmation dialog */}
                {deleteId === type.id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white rounded shadow-lg p-4">
                      <p>Are you sure you want to delete this type?</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleDelete(type.id)} aria-label="Confirm Delete">Yes</Button>
                        <Button size="sm" variant="secondary" onClick={() => setDeleteId(null)} aria-label="Cancel Delete">No</Button>
                      </div>
                      {deleteError && <div className="text-red-500 text-sm pt-2">{deleteError}</div>}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAdd} className="flex gap-2 pt-3 items-center" aria-label="Add new type">
          <input
            value={newType}
            onChange={e => setNewType(e.target.value)}
            placeholder="New type name"
            className="border rounded px-2 py-1"
            aria-label="New type name"
          />
          <Button type="submit" size="sm" disabled={!newType.trim()}>Add</Button>
        </form>
      </div>
    </Modal>
  );
}; 