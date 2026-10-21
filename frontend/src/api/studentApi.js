import client from "./client";

export const get_std = async (p = {}) => {
  const res = await client.get("/students", { params: p });
  return res.data;
};

export const get_std_by_sem = async (sem) => {
  let p = {};
  if (sem) {
    p = { semester: sem };
  }
  return get_std(p);
};

export const get_std_by_id = async (id) => {
  const res = await client.get("/students/" + id);
  return res.data;
};

export const getStudents = get_std;
export const getStudentsBySemester = get_std_by_sem;
export const getStudentById = get_std_by_id;
