import { create } from 'zustand';

interface ModalData {
  id?: string;
  item?: any;
  apiUrl?: string;
  onSuccess?: () => void; 
}

interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  data: ModalData;
  onOpen: (type: string, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, modalType: type, data }),
  onClose: () => set({ isOpen: false, modalType: null, data: {} }),
}));