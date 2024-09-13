export class TaskAssignment {
  constructor(
    public taskId: number,
    public taskerId: number,
    public status: string,
    public assignedAt: Date,
    public id?: number
  ) {}
}
