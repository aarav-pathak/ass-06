import client from "./client";

export const getAttendanceSheet = async (subjectId, date) => {
  const response = await client.get("/attendance/sheet", {
    params: { subjectId, date },
  });
  return response.data;
};

export const markAttendance = async (payload) => {
  const response = await client.post("/attendance", payload);
  return response.data;
};

export const getStudentSummary = async () => {
  const response = await client.get("/attendance/my-summary");
  return response.data;
};

export const getStudentSubjectDetail = async (subjectId) => {
  const response = await client.get(`/attendance/my-detail/${subjectId}`);
  return response.data;
};

export const getShortageList = async (filters = {}) => {
  const response = await client.get("/attendance/shortage", { params: filters });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await client.get("/attendance/dashboard");
  return response.data;
};

export const get_sheet = getAttendanceSheet;
export const mark_att = markAttendance;
export const get_sum = getStudentSummary;
export const get_det = getStudentSubjectDetail;
export const get_shortage = getShortageList;
export const get_stats = getDashboardStats;
