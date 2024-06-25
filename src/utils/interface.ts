import {workItemTypes} from "@app-utils";

export type ParsedWorkItem = { type: workItemTypes, number: number, title: string };
export type FieldType = 'workItem' | 'requirement';

type BranchNameConf = {
    Requirement: {
        setBranchName: (reqNumber: string | number, reqTitle: string) => string;
    },
    Task: {
        setBranchName: (reqNumber: string | number, reqTitle: string, taskNumber: string | number, taskTitle: string) => string;
    },
    Bug: {
        setBranchName: (
            bugNumber: string | number,
            bugTitle: string,
            reqNumber?: string | number,
            reqTitle?: string
        ) => string;
    };
};
export const branchNameConf: BranchNameConf = {
    Requirement: {
        setBranchName: (number: number | string, title: string): string => {
            number = number.toString();
            return `requirement/${number}-${title}/${number}-${title}`
        }
    },
    Task: {
        setBranchName: (reqNum: string | number, reqTitle: string, TaskNum: string | number, TaskTitle: string) => {
            reqNum = reqNum.toString();
            return `requirement/${reqNum}-${reqTitle}/task/${TaskNum}-${TaskTitle}`
        }
    },
    Bug: {
        setBranchName: (bugNumber: string | number, bugTitle: string, reqNumber?: string | number, reqTitle?: string) => {
            bugNumber = bugNumber.toString();
            if (reqNumber && reqTitle) {
                reqNumber = reqNumber.toString();
                return `requirement/${reqNumber}-${reqTitle}/bug/${bugNumber}-${bugTitle}`;
            } else {
                return `bug/${bugNumber}-${bugTitle}/${bugNumber}-${bugTitle}`;
            }
        }
    }
};
