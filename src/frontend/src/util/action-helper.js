export const createActionSet = (actionName) => ({
  PENDING: `${actionName}_PENDING`,
  SUCCESS: `${actionName}_SUCCESS`,
  ERROR: `${actionName}_ERROR`,
  RESET: `${actionName}_RESET`,
  actionName,
});

export const createPaginationActionSet = (actionName) => ({
  ...createActionSet(actionName),
});
