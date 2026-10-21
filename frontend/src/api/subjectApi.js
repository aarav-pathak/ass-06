import client from "./client";

export const getSubjects = async (semester) => {
  const params = semester ? { semester } : {};
  return client.get("/subjects", params);
};

export const getSubjectById = async (id) => {
  return client.get("/subjects/" + id);
};

export const createSubject = async (subjectData) => {
  return client.post("/subjects", subjectData);
};

export const updateSubject = async (id, subjectData) => {
  return client.put("/subjects/" + id, subjectData);
};

export const deleteSubject = async (id) => {
  return client.delete("/subjects/" + id);
};

export const get_subs = getSubjects;
export const get_sub_by_id = getSubjectById;
export const create_sub = createSubject;
export const update_sub = updateSubject;
export const del_sub = deleteSubject;
