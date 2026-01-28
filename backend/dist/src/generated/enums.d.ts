export declare const Status: {
    readonly WAITING: "WAITING";
    readonly CALLING: "CALLING";
    readonly DONE: "DONE";
};
export type Status = (typeof Status)[keyof typeof Status];
