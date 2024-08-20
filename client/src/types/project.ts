import { User } from "./auth";

export type CreateProjectFormType = {
    name: string;
    description: string;
    repo: string;
    labels: Label[];
    members: string[];
    managers: string[];
    createdby: string;
}

export type UpdateProjectFormType = {
    name?: string;
    description?: string;
    repo?: string;
    labels?: Label[];
}

export type Label = {
    name: string;
    color: string;
}

export type Project = {
    _id: string;
    name: string;
    description: string;
    repo: string;
    labels: Label[];
    members: User[];
    managers: User[];
    createdby: User;
    createdAt: string;
    updatedAt: string;
}

export type MemberFormType = {
    userId: string;
    role: "member" | "manager";
}