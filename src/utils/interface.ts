import {workItemTypes} from "@app-utils";

export type ParsedWorkItem = { type: workItemTypes, number: number, title: string };
export type FieldType = 'workItem' | 'requirement';