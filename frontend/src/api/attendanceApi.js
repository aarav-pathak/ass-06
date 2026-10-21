import client from "./client";

export const getAttendanceSheet = async (subjectId, date) => {
  return client.get("/attendance/sheet", { subjectId, date });
};

export const markAttendance = async (payload) => {
  return client.post("/attendance", payload);
};

export const getStudentSummary = async () => {
  return client.get("/attendance/my-summary");
};

export const getStudentSubjectDetail = async (subjectId) => {
  return client.get("/attendance/my-detail/" + subjectId);
};

export const getShortageList = async (filters = {}) => {
  return client.get("/attendance/shortage", filters);
};

export const getDashboardStats = async () => {
  return client.get("/attendance/dashboard");
};

export const get_sheet = getAttendanceSheet;
export const mark_att = markAttendance;
export const get_sum = getStudentSummary;
export const get_det = getStudentSubjectDetail;
export const get_shortage = getShortageList;
export const get_stats = getDashboardStats;
