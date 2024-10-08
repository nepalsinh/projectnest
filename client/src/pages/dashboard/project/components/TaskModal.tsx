import { useEffect, useState } from "react";
import { Project } from "../../../../types/project";
import { Task, TaskStatusType, UpdateTaskFormType } from "../../../../types/task";
import { toast } from "sonner";
import { TaskService } from "../../../../helpers/TaskService";
import { Autocomplete, AutocompleteItem, Avatar, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Textarea, User } from "@nextui-org/react";
import { BiEdit, BiX } from "react-icons/bi";
import ReactTimeAgo from "react-time-ago";


const TaskModal = ({
    isOpen,
    onOpenChange,
    task,
    onStatusChange,
    project,
    onTaskChange,
    onDelete,
}: {
    isOpen: boolean;
    project: Project;
    onOpenChange: () => void;
    task?: Task;
    onDelete: () => void;
    onStatusChange: (val: TaskStatusType) => Promise<void>;
    onTaskChange: (task: Task) => Promise<void>;
}) => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [titleEditMode, setTitleEditMode] = useState(false);
    const [descriptionEditMode, setDescriptionEditMode] = useState(false);
    const [newTask, setNewTask] = useState<UpdateTaskFormType>({
        name: task?.name,
        description: task?.description,
    });
    const [btnLoading, setBtnLoading] = useState(false);

    const changeAssignedTo = async (userId: string) => {
        if (!task) return;
        const id = userId == "Unassigned" ? undefined : userId;
        if (id == task.assignedTo?._id) return;

        setLoading(true);
        const token = toast.loading("Assigning...");
        const res = await TaskService.assignTask(task._id!, id ?? null);
        if (res) {
            await onTaskChange(res.task);
            toast.success("Assigned Successfully");
            setEditMode(false);
        }
        toast.dismiss(token);
        setLoading(false);
    };
    const updateTask = async () => {
        if (!task) return;
        if (!newTask.name || !newTask.description)
            return toast.error("Name and Description are required");
        if (newTask.name == task.name && newTask.description == task.description)
            return;
        setBtnLoading(true);
        const res = await TaskService.updateTask(task._id!, newTask);
        if (res) {
            await onTaskChange(res.task);
            setTitleEditMode(false);
            setDescriptionEditMode(false);
            toast.success("Task Updated Successfully");
        }
        setBtnLoading(false);
    };

    useEffect(() => {
        if (task) {
            setNewTask({ name: task.name, description: task.description });
        }
    }, [task]);
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {task ? (
                            <ModalHeader className="flex items-center gap-5 capitalize font-bold text-2xl ">
                                {titleEditMode ? (
                                    <div className="flex-1 flex gap-2">
                                        <Input
                                            variant="faded"
                                            placeholder="Task Name"
                                            labelPlacement="outside"
                                            value={newTask.name}
                                            onChange={(e) => {
                                                const newt = { ...newTask, name: e.target.value };
                                                setNewTask(newt);
                                            }}
                                        />
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={() => setTitleEditMode(false)}
                                        >
                                            <BiX size={24} />
                                        </Button>
                                    </div>
                                ) : (
                                    <span
                                        onDoubleClick={() => setTitleEditMode(true)}
                                        className="cursor-pointer"
                                    >
                                        {task.name}
                                    </span>
                                )}
                                <Chip
                                    key={task.priority}
                                    className="mt-1.5"
                                    size="sm"
                                    variant="flat"
                                    color={
                                        task.priority == "Low"
                                            ? "success"
                                            : task.priority == "Medium"
                                                ? "warning"
                                                : "danger"
                                    }
                                >
                                    {task.priority}
                                </Chip>
                            </ModalHeader>
                        ) : null}
                        {task ? (
                            <ModalBody className="flex flex-col ">
                                {descriptionEditMode ? (
                                    <div className="flex gap-2">
                                        <Textarea
                                            rows={3}
                                            variant="faded"
                                            placeholder="Task description"
                                            labelPlacement="outside"
                                            value={newTask.description}
                                            onChange={(e) => {
                                                const newt = {
                                                    ...newTask,
                                                    description: e.target.value,
                                                };
                                                setNewTask(newt);
                                            }}
                                        />
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onClick={() => setDescriptionEditMode(false)}
                                        >
                                            <BiX size={24} />
                                        </Button>
                                    </div>
                                ) : (
                                    <p
                                        onDoubleClick={() => setDescriptionEditMode(true)}
                                        className="cursor-pointer"
                                    >
                                        {task.description}
                                    </p>
                                )}
                                <Card>
                                    <CardHeader>
                                        <RadioGroup
                                            label="status"
                                            isDisabled={loading}
                                            value={task.status}
                                            onValueChange={async (val) => {
                                                setLoading(true);
                                                await onStatusChange(val as TaskStatusType);
                                                setLoading(false);
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <Radio value="TODO" color="warning">
                                                    TODO
                                                </Radio>
                                                <Radio value="In Progress" color="secondary">
                                                    In Progress
                                                </Radio>
                                                <Radio value="Completed" color="success">
                                                    Completed
                                                </Radio>
                                            </div>
                                        </RadioGroup>
                                    </CardHeader>
                                    <CardBody className="flex flex-col gap-2">
                                        <span className="font-semibold text-neutral-500">
                                            Assignee:{" "}
                                        </span>
                                        <div className="flex justify-between my-2 gap-2 items-center">
                                            {!editMode ? (
                                                <User
                                                    className="justify-start"
                                                    name={task.assignedTo?.name ?? "Unassigned"}
                                                    description={task.assignedTo?.email ?? "Unassigned"}
                                                    avatarProps={{
                                                        src: task.assignedTo?.avatar,
                                                        size: "sm",
                                                    }}
                                                />
                                            ) : (
                                                <Autocomplete
                                                    defaultItems={[
                                                        {
                                                            _id: "Unassigned",
                                                            name: "Unassigned",
                                                            email: "",
                                                            avatar: "",
                                                        },
                                                        ...project.members,
                                                        ...project.managers,
                                                    ]}
                                                    variant="faded"
                                                    placeholder="Select a user"
                                                    labelPlacement="outside"
                                                    selectedKey={task.assignedTo?._id ?? "Unassigned"}
                                                    isRequired
                                                    allowsCustomValue={false}
                                                    onSelectionChange={(key) => {
                                                        if (!key) return;
                                                        changeAssignedTo(key.toString());
                                                    }}
                                                    isLoading={loading}
                                                >
                                                    {(u) => (
                                                        <AutocompleteItem key={u._id} textValue={u.name}>
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar
                                                                    alt={u.name}
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                    src={u.avatar}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{u.name}</span>
                                                                    <span className="text-tiny text-default-400">
                                                                        {u.email}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                            )}
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                onClick={() => setEditMode(!editMode)}
                                            >
                                                {editMode ? <BiX size={24} /> : <BiEdit size={24} />}
                                            </Button>
                                        </div>
                                        <span className="font-semibold ">
                                            Due Date: <ReactTimeAgo date={new Date(task.dueDate)} />
                                        </span>

                                        <Divider className="my-1" />
                                        <div className="flex gap-1">
                                            {task.labels.map((label) => (
                                                <Chip
                                                    key={label.name}
                                                    size="sm"
                                                    variant="flat"
                                                    style={{
                                                        backgroundColor: label.color + "30",
                                                        color: label.color,
                                                    }}
                                                    className="backdrop-blur"
                                                >
                                                    {label.name}
                                                </Chip>
                                            ))}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm">
                                                Created <ReactTimeAgo date={new Date(task.createdAt)} />{" "}
                                            </p>
                                            <p className="text-sm">
                                                Updated <ReactTimeAgo date={new Date(task.updatedAt)} />
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </ModalBody>
                        ) : null}
                        <ModalFooter>
                            <Button
                                color="warning"
                                isLoading={loading}
                                variant="flat"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            {task && (
                                <Button
                                    color="danger"
                                    isLoading={btnLoading}
                                    variant="flat"
                                    onPress={async () => {
                                        setBtnLoading(true);
                                        if (task) {
                                            const res = await TaskService.deleteTask(task._id!);
                                            if (res) {
                                                onDelete();
                                                toast.success("Task Deleted Successfully");
                                            }
                                        }
                                        setBtnLoading(false);
                                        onClose();
                                    }}
                                >
                                    Delete Task
                                </Button>
                            )}
                            {task &&
                                (newTask.name != task.name ||
                                    newTask.description != task.description) ? (
                                <Button
                                    color="success"
                                    isLoading={btnLoading}
                                    variant="flat"
                                    onPress={updateTask}
                                >
                                    Save Changes
                                </Button>
                            ) : null}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default TaskModal;