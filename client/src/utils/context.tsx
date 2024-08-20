import { create } from "zustand";
import { User } from "../types/auth";
import { Project } from "../types/project";
import { ProjectService } from "../helpers/ProjectService";

interface MyState {
    projects: Project[];
    user: User | null;
    setProjects: (projects: Project[]) => void;
    setUser: (user: User | null) => void;
    fetchProjects: () => Promise<void>;
}

const useLoom = create<MyState>((set) => ({
    projects: [],
    user: null,
    setProjects: (projects) => set({ projects }),
    setUser: (user) => set({ user }),
    fetchProjects: async () => {
        const userId = useLoom.getState().user?._id;
        if (!userId) {
            return;
        }
        const res = await ProjectService.getProjectsByUserId(userId);
        if (res) {
            set({ projects: res.projects });
        }
    }
}))

export default useLoom;