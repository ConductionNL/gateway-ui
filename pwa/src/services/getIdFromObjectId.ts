export const getIdFromObjectId = (objects: any) => {
    Object.keys(objects).forEach((key) => { objects[key] = getId(objects[key]) });
    return objects;
  }

const getId = (id: string) => {
    const finalSlashIndex = id.lastIndexOf("/");
    return id.substring(finalSlashIndex + 1);
  };

