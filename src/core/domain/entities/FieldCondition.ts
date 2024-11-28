export interface FieldCondition {
  id: string;
  fieldId: string;
  variableName: string;
  operator: "contains" | "equals" | "notEquals" | "greaterThan" | "lessThan";
  value: string;
  action: "show" | "hide";
}
