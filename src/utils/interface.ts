import {workItemTypes} from "./enums";

export interface ButtonsState {
    next: ButtonProperties,
    prev: ButtonProperties,
    submit: ButtonProperties
}

export interface ButtonProperties {
    isEnabled: boolean,
    isDisplayed: boolean
}

export type ParsedWorkItem = { type: workItemTypes, number: number, title: string };