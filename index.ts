import Schema from "async-validator";
import type { Rules, ErrorList, ValidateOption } from "async-validator";

type Values<T = any> = { [key: string]: T };
type ValidationError = { errors: ErrorList };
type RulesRef = { current: Rules };
type ResolverSchema = Rules | RulesRef;

const convertErrors = (errors: ErrorList) =>
  errors.reduce<Values<string>>(
    (a, { field, message }) => ({ [field]: message, ...a }),
    {}
  );

export interface ResolverConfig extends ValidateOption {
  useRef?: boolean;
}

const resolver = <StoreValues extends Values = Values>(
  schema: ResolverSchema,
  { useRef, ...config }: ResolverConfig
) => (values: StoreValues) => {
  const validatorSchema = (useRef ? schema.current : schema) as Rules;
  const validator = new Schema(validatorSchema);
  return validator
    .validate(values, config)
    .then(() => ({
      values,
      errors: {},
    }))
    .catch(({ errors }: ValidationError) => ({
      values,
      errors: convertErrors(errors),
    }));
};

export default resolver;
