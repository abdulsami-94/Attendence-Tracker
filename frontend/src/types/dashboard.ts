export interface StudentInfo {
  id: string;
  fullName: string;
  rollNumber: string;
  department: string;
  semester: number;
  division: string;
  profileImageUrl?: string;
}

export interface AttendanceSummary {
  overallPercentage: number;
  presentLectures: number;
  absentLectures: number;
  totalLectures: number;
}

export interface DashboardData {
  student: StudentInfo;
  attendanceSummary: AttendanceSummary;
}
