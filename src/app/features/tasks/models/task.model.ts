export interface Task {
    id: string; //MongoDB ObjectId as string
    title: string;
    description: string;
    type: string;
    status: string;
    createdOn: Date;
}