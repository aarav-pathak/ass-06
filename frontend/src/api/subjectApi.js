import client from "./client";

export const getSubjects = async (semester) => {
  let params = {};
  if (semester) {
    params = { semester: semester };
  }
  const response = await client.get("/subjects", { params: params });
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await client.get("/subjects/" + id);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await client.post("/subjects", subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await client.put("/subjects/" + id, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await client.delete("/subjects/" + id);
  return response.data;
};

export const get_subs = getSubjects;
export const get_sub_by_id = getSubjectById;
export const create_sub = createSubject;
export const update_sub = updateSubject;
export const del_sub = deleteSubject;
