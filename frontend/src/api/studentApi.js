import client from "./client";

export const get_std = async (params = {}) => {
  return client.get("/students", params);
};

export const get_std_by_sem = async (sem) => {
  const params = sem ? { semester: sem } : {};
  return get_std(params);
};

export const get_std_by_id = async (id) => {
  return client.get("/students/" + id);
};

export const getStudents = get_std;
export const getStudentsBySemester = get_std_by_sem;
export const getStudentById = get_std_by_id;
