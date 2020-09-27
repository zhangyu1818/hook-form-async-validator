# hook-form-async-validator

async-validator for react-hook-form

# Usage

```sh
  yarn add hook-form-async-validator
```

```js
  import resolver from 'hook-form-async-validator';
  
  // ...
  const form = useForm({
    resolver: resolver({
        username: {
          required: true,
          message: 'please input you name',
        },
      }),
  });
```
