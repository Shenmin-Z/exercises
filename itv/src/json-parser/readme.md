# Implement a JSON parser with Typescript

## JSON's grammar rules

I found [this](https://github.com/antlr/grammars-v4/blob/master/json/JSON.g4) very easy to understand.

## Step 1: Transform text into a list of words (tokens)

After studying the grammar rules, I decide to define my word to be one of these types.

```typescript
type TokenType =
  | "string"
  | "number"
  | "true"
  | "false"
  | "null"
  | "curly-left"
  | "curly-right"
  | "bracket-left"
  | "bracket-right"
  | "comma"
  | "colon";
```

So an input like `{ "aa": [ 123 ] }` would be transformed into:

```javascript
[
  { type: 'curly-left', content: '{' },
  { type: 'string', content: 'aa' },
  { type: 'colon', content: ':' },
  { type: 'bracket-left', content: '[' },
  { type: 'number', content: '123' },
  { type: 'bracket-right', content: ']' },
  { type: 'curly-right', content: '}' }
]
```

The main process is like this:

```typescript
export let tokenize = (input: string): Token[] => {
  let result: Token[] = [];
  let pointer = 0;
  
  // find a match, push it result
  // advance pointer
  ...

  return result;
};
```

To find out if the current text matches a certain type, there is this function:

```typescript
  let match = (regexString: string, type: TokenType) => (): Token | null => {
    let regex = RegExp(`^${isWS}*(${regexString})`, "u");
    if (regex.test(input.substring(pointer))) {
      let [whole, content] = regex.exec(
        input.substring(pointer)
      ) as RegExpExecArray;
      if (content === undefined) {
        throw new Error(`Failed to match ${type}`);
      }
      pointer += whole.length;
      if (type === "string") {
        // remove wrapping ""
        content = content.substring(1, content.length - 1);
      }
      return { type, content };
    } else {
      return null;
    }
  };
```

For type string and type number, it's not as easy as others. We need some regex to decide if it matches, and get the matched result.

If no match is found, simple return `null`.


Since we need to match a list of types, I did it like this:

```typescript
  let matches = [
    match("true", "true"),
    match("false", "false"),
    match("null", "null"),
    match("\\{", "curly-left"),
    match("\\}", "curly-right"),
    match("\\[", "bracket-left"),
    match("\\]", "bracket-right"),
    match(",", "comma"),
    match(":", "colon"),
    match(isNUMBER, "number"),
    match(isSTRING, "string")
  ];

  while (pointer < input.length) {
    let tmp: Token | null = null;
    for (let m of matches) {
      let res = m();
      if (res !== null) {
        tmp = res;
        break;
      }
    }
    if (tmp === null) {
      throw new Error(`Invalid input at index: ${pointer}`);
    } else {
      result.push(tmp);
    }
  }
```

## Step 2: analyze these words

First I defined some types to represent the JSON structure:

```typescript
type ContextType = "obj" | "arr" | "other";
type Context = {
  type: ContextType;
  value?: any;
  children: {
    key?: string;
    value: Context | null;
  }[];
};
```

So in `{ "aa": [ 123 ] }`, `123` would be in a context of
```javascript
{
  type: "other",
  value: 123
}
```
which is itself in a context of
```javascript
{
  type: "arr",
  children: [
    {
      value: // HERE
    }
  ]
}
```
which is in a context of
```javascript
{
  type: "obj",
  children: [
    {
      key: "aaa",
      value: // HERE
    }
  ]
}
```

Main process is like this(some utility functions are not shown):

```typescript
let analyze = (tokens: Token[]): Context => {
  let rootContext = null;
  let pointer = 0;  

  let analyzeObj = (context: Context) => {
    ...
    // calls analyzeValue
  };

  let analyzeArr = (context: Context) => {
    ...
    // calls analyzeValue
  };

  let analyzeValue = () => {
    if (is("curly-left")) {
      ...
      analyzeObj(newContext);
    } else if (is("bracket-left")) {
      ...
      analyzeArr(newContext);
    } else if (
      is("null") ||
      is("true") ||
      is("false") ||
      is("number") ||
      is("string")
    ) {
      ...
    } else {
      throw new Error(`Unexpected token: ${tokens[pointer].type}`);
    }
  };

  analyzeValue();
  return (rootContext as unknown) as Context;
};
```

### Object type

So a `pair` is defined as `string : value`, and an object can be one of these three:

`{}`

`{ pair }`

`{ pair , pair }` (`, pair` can appear multiple times)

And my code is like this:
```typescript
  let analyzeObj = (context: Context) => {
    let step = () => {
      let key = take("string");
      take("colon");
      context.children.push(createChild(key));
      analyzeValue();
    };

    if (is("curly-right")) {
      return;
    }

    step();

    while (is("comma")) {
      step();
    }

    take("curly-right");
  };
```

`step` would process a `pair`, and we keep processing it while the next word is `,`. Finally when we get a `}`, the object analysis is finished.

Notice `analyzeObj` would call `analyzeValue`, which may call `analyzeObj`, which may again call `analyzeValue`... The call **stack** is the key part for determining the matching `}` of `{`.

### Array type

This is similar to object type:

```typescript
  let analyzeArr = (context: Context) => {
    let step = () => {
      context.children.push(createChild());
      analyzeValue();
    };

    if (is("bracket-right")) {
      return;
    }

    step();

    while (is("comma")) {
      step();
    }

    take("bracket-right");
  };
```

### Other types

No recursive call, straightforward.

## Step 3: To the real JSON object

We don't need those `children`, `key`, `value` information, which is only needed while doing the analysis.

```typescript
let toJSON = (context: Context): any => {
  if (context.type === "other") return context.value;
  if (context.type === "obj") {
    let tmp: any = {};
    for (let c of context.children || []) {
      if (c.key === undefined || c.value === null) {
        throw new Error(`Context ${c} is invalid.`);
      } else {
        tmp[c.key] = toJSON(c.value);
      }
    }
    return tmp;
  }
  if (context.type === "arr") {
    return context.children?.map(i => toJSON(i.value as Context));
  }
};
```

## Finally

We combine these 3 steps:

```typescript
let JSONParse = (s: string) => {
  let tokens = tokenize(s);
  let context = analyze(tokens);
  let json = toJSON(context);
  return json;
};
```

