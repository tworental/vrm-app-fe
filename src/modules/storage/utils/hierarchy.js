import orderBy from '@/utils/sort';

export const LOCATIONS = Object.freeze({
  DRIVE: 'drive',
  STARRED: 'starred',
  BIN: 'bin',
});

export const folderItems = (location, items, id = null, sort = []) => {
  let list = items.filter(({ folderId }) => Number(folderId) === Number(id));

  switch (location) {
    case LOCATIONS.BIN:
      list = list.filter(({ deletedAt }) => !!deletedAt);
      break;

    case LOCATIONS.STARRED:
      list = list.filter(({ starred }) => !!starred);
      break;

    default:
      list = list.filter(({ deletedAt }) => !deletedAt);
      break;
  }

  return orderBy(list, sort);
};

export const arrayToHierarchy = (id, items) => {
  const node = items.find((o) => Number(id) === Number(o.id));

  if (!node) {
    return [];
  }

  const nodes = [{
    id: node.id,
    uuid: node.uuid,
    name: node.name,
  }];

  if (!node.folderId) {
    return nodes;
  }

  return [arrayToHierarchy(node.folderId, items), nodes].flat();
};

export const getFoldersTree = (items, id = null) => items
  .filter((item) => item.folderId === id)
  .map((item) => ({
    key: item.id,
    label: item.name,
    children: getFoldersTree(items, item.id),
  }));
