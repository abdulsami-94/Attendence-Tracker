package com.attendance.attendance_api.dto;

import com.attendance.attendance_api.model.SessionType;

public interface SessionSubjectCount {
    Long getSubjectId();
    SessionType getSessionType();
    long getCount();
}
