export type webengageFunction =
  | {
      track: (arg0: string, arg1: any) => void;
      user: {
        setAttribute: (arg0: string, arg1: any) => void;
        login: (arg0: string) => void;
      };
    }
  | undefined;

export default (): webengageFunction => {
  try {
    //@ts-ignore
    if (!window.webengage && !document.webengage) {
      throw new Error("No Webengage Code Found");
    }
    //@ts-ignore
    return webengage;
  } catch (error) {
    console.error(error);
  }
};
