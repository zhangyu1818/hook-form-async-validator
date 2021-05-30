import Schema from "async-validator";
import type { Resolver } from "react-hook-form";
import type { Rules, ErrorList, ValidateOption } from "async-validator";

export type Values = { [key: string]: any };
export type ValidationError = { errors: ErrorList };
export type ResolverSchema = Rules | { current?: Rules };

export type {
  RuleType,
  Rules,
  RuleItem,
  ValidateOption,
  ValidateError,
  ValidateSource,
  ErrorList,
  FieldErrorList,
} from "async-validator";

const convertErrors = <T extends Values = Values>(errors: ErrorList) =>
  errors.reduce<T>(
    (a, { field, message }) => ({ [field]: message, ...a }),
    {} as T
  );

export interface ResolverConfig extends ValidateOption {
  useRef?: boolean;
}

const resolver = <T extends Values = Values>(
  schema: ResolverSchema,
  { useRef, ...config }: ResolverConfig = {}
): Resolver<T> => (values) => {
  const validatorSchema = (useRef ? schema.current : schema) as Rules;
  const validator = new Schema(validatorSchema);
  return validator
    .validate(values, config)
    .then(() => ({
      values,
      errors: {},
    }))
    .catch(({ errors }: ValidationError) => ({
      values: {},
      errors: convertErrors(errors),
    }));
};

export default resolver;
