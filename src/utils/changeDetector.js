/**
 * Determines what changed in a monorepo push
 */

export const detectChanges = (commits = []) => {
  const changedFiles = new Set();

  for (const commit of commits) {
    commit.added?.forEach((f) => changedFiles.add(f));
    commit.modified?.forEach((f) => changedFiles.add(f));
    commit.removed?.forEach((f) => changedFiles.add(f));
    }
    
    let frontendChanges = false;
    let backendChanges = false;

    for (const file of changedFiles) {
        if (file.startsWith("client/")) frontendChanges = true;
        if (file.startsWith("server/")) backendChanges = true;
    }

    return {
        frontendChanges,
        backendChanges,
        changedFiles: Array.from(changedFiles),
    };
};
