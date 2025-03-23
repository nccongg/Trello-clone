import { create } from 'zustand';

export interface Workspace {
  id: string;
  name: string;
  isExpanded?: boolean;
  icon?: string;
  backgroundColor?: string;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  toggleWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [
    {
      id: 'trello',
      name: 'Trello Workspace',
      isExpanded: true,
      icon: 'T',
      backgroundColor: 'emerald',
    },
  ],
  setWorkspaces: (workspaces) => set({ workspaces }),
  toggleWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) => (ws.id === id ? { ...ws, isExpanded: !ws.isExpanded } : ws)),
    })),
}));
