export interface AttendanceSummary {
    subjectId: number;
    subjectName: string;
    present: number;
    total: number;
    percentage: number;
}