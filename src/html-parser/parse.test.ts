import { toTokens, toTag } from "./parse";
// Does nothing
// Just for editor syntax highlight
const html = (i: TemplateStringsArray) => i[0];

const raw1 = html`
  <html>
    <head>
      <title>Page Title</title>
    </head>
    <body>
      <h1 class="c1" id="some-id">This is a Heading</h1>
      <div class="c2">
        Text1 Text2
        <p>
          This is a paragraph.
        </p>
      </div>
    </body>
  </html>
`;
const raw1_1 = `
  <
  html >
<head>
            <title>Page Title</title>
    </head>
    <body>
      <  h1     class="c1"
      id="some-id"
  >This is a Heading
</h1>
      <div      class="c2"      > Text1 Text2
        <p>
          This is a paragraph.  </p>
      </div> </body> </html>
`;

const raw2 = `$#%^&*&^&*GFGVB<GVBN<JHGBfg>><gvbhhjusdn<fj<hw`;

const raw1_raw = [
  "<html>",
  "<head>",
  "<title>",
  "Page Title",
  "</title>",
  "</head>",
  "<body>",
  '<h1 class="c1" id="some-id">',
  "This is a Heading",
  "</h1>",
  '<div class="c2">',
  "Text1 Text2",
  "<p>",
  "This is a paragraph.",
  "</p>",
  "</div>",
  "</body>",
  "</html>",
];

describe("To raw tags (string)", () => {
  test("Simple normal", () => {
    const res1 = toTokens(raw1);
    expect(res1).toEqual(raw1_raw);
    const res1_1 = toTokens(raw1_1);
    expect(res1_1).toEqual(raw1_raw);
  });

  test("Does not crash on invalid input", () => {
    const res = () => toTokens(raw2);
    expect(res).not.toThrow();
  });
});

describe("String to tag", () => {
  test("Invalid input", () => {
    const test0 = "^&&*&>";
    const res0 = () => toTag(test0);
    expect(res0).toThrow();

    const test1 = "<^&&*&>";
    const res1 = () => toTag(test1);
    expect(res1).toThrow();

    const test2 = "</^&&*&>";
    const res2 = () => toTag(test2);
    expect(res2).toThrow();

    const test3 = "<^&&*& />";
    const res3 = () => toTag(test3);
    expect(res3).toThrow();

    const test4 = "< />";
    const res4 = () => toTag(test4);
    expect(res4).toThrow();

    const test5 = "<///>";
    const res5 = () => toTag(test5);
    expect(res5).toThrow();

    const test6 = "<>";
    const res6 = () => toTag(test6);
    expect(res6).toThrow();
  });

  const test1 = "<div class=\"kurasu\" id=3 a='b'>";
  test(test1, () => {
    const res = toTag(test1);
    expect(res).toEqual({
      type: "left",
      name: "div",
      attributes: {
        class: "kurasu",
        id: 3,
        a: "b",
      },
    });
  });

  const test2 = "<div>";
  test(test2, () => {
    const res = toTag(test2);
    expect(res).toEqual({
      type: "left",
      name: "div",
    });
  });

  const test3 = "</div>";
  test(test3, () => {
    const res = toTag(test3);
    expect(res).toEqual({
      type: "right",
      name: "div",
    });
  });

  const test4 = "</div ^&*(^)aaa=&*&YHG>";
  test(test4, () => {
    const res = toTag(test4);
    expect(res).toEqual({
      type: "right",
      name: "div",
    });
  });

  const test5 = "<img src='imeigi' />";
  test(test5, () => {
    const res = toTag(test5);
    expect(res).toEqual({
      type: "selfClosing",
      name: "img",
      attributes: {
        src: "imeigi",
      },
    });
  });
});
