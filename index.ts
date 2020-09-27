import Schema from "async-validator";
import type {
  RuleType,
  Rules,
  RuleItem,
  ErrorList,
  ValidateOption,
} from "async-validator";

type Values = { [key: string]: any };
type ValidationError = { errors: ErrorList };
type ResolverSchema = Rules | { current?: Rules };

const convertErrors = (errors: ErrorList) =>
  errors.reduce<Values>(
    (a, { field, message }) => ({ [field]: message, ...a }),
    {}
  );

export interface ResolverConfig extends ValidateOption {
  useRef?: boolean;
}

const resolver = (
  schema: ResolverSchema,
  { useRef, ...config }: ResolverConfig = {}
) => (values: Values) => {
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

export type { RuleType, Rules, RuleItem };
export default resolver;
